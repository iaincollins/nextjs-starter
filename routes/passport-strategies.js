/**
 * Configure Passport Strategies
 **/
'use strict'

const passport = require('passport')
const MongoObjectId = require('mongodb').ObjectId
const providers = require('../passport.config').providers

exports.configure = ({
    expressApp = null, // Express Server
    userdb = null,     // MongoDB connection to the user database
    path = '/auth',    // URL base path for authentication routes
    serverUrl = null,
    userDbKey = '_id'  // Always '_id' on Mongo but other databases may be 'id'
  } = {}) => {
  if (expressApp === null) {
    throw new Error('expressApp option must be an instance of an express server')
  }

  if (userdb === null) {
    throw new Error('userdb option must be provided')
  }

  // Tell Passport how to seralize/deseralize user accounts
  passport.serializeUser((user, next) => {
    next(null, user[userDbKey])
  })

  passport.deserializeUser((id, next) => {
    userdb.findOne({[userDbKey]: ObjectId(id)}, (err, user) => {
      // Pass error back (if there was one) and invalidate session if user
      // could not be fetched by returning 'false'. This prevents an exception
      // in edge cases like an account being deleted while logged in.
      if (err || !user)
        return next(err, false)
        
      // A user object returned to the user when they are logged in.
      // Contains properties for display in the UI (e.g. name, email, avatar…)
      // Note: This should not include fields you wish to keep private as
      // the user object returned here will be exported to the client.
      next(err, {
        id: user[userDbKey],
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        admin: user.admin || false
      })
    })
  })

  // Define a Passport strategy for provider
  providers.forEach(({providerName, Strategy, strategyOptions, getUserFromProfile}) => {

    strategyOptions.callbackURL = (serverUrl || '') + path + '/oauth/' + providerName + '/callback' 
    strategyOptions.passReqToCallback = true
    
    passport.use(new Strategy(strategyOptions, (req, accessToken, refreshToken, profile, next) => {

      req.session[providerName] = {accessToken: accessToken}

      try {
        // Normalise the provider specific profile into a standard user object
        profile = getUserFromProfile(profile)
        
        // If we didn't get an email address from the oAuth provider then
        // generate a unique one as placeholder, using Provider name and ID.
        // If you want users to specify a valid email address after signing in,
        // you can check for email addresses ending "@localhost.localdomain"
        // and prompt those users to supply a valid address.
        if (!profile.email) {
          profile.email = `${providerName}-${profile.id}@localhost.localdomain`
        }

        // See if we have this oAuth account in the database associated with a user
        userdb.findOne({ [providerName+'.id']: profile.id }, (err, user) => {

          if (err) return next(err)

          if (req.user) {
            // If the current session is signed in
                        
            // If the oAuth account is not linked to another account, link it and exit
            if (!user) {
             return userdb.findOne({[userDbKey]: ObjectId(req.user.id)}, (err, user) => {
                if (err) {
                  return next(err)
                }
                if (!user) {
                  return next(new Error('Could not find current user in database.'))
                }
                // If we don't have a name for the user, grab the one from oAuth
                user.name = user.name || profile.name
                // If we don't have a real email address for the user, grab the
                // one from the oAuth account they just signed in with
                if (user.email && user.email.match(/.*@localhost\.localdomain$/) &&
                    profile.email && !profile.email.match(/.*@localhost\.localdomain$/)) {
                  user.verified = false
                  user.email = profile.email
                }
                user[providerName] = {
                  id: profile.id,
                  refreshToken: refreshToken
                }
                
                return userdb.update({[userDbKey]: user[userDbKey]}, user, {}, (err) => {
                  // @FIXME Should check the error code to verify the error was
                  // actually caused by email already being in use here but is
                  // almost certainly the cause of any errors when saving here.
                  if (err) {
                    return next(null, false, {message: 'Please check there isn\'t an account associated with the same email address.'})
                  }
                  return next(null, user)
                })
              })
            }

            // If oAuth account already linked to the current user return okay
            if (req.user.id === user.id) {
              // @TODO Improve error handling and update query syntax here
              // If we got a refreshToken try to save it to the profile,
              // but don't worry about errors if we don't get one 
              if (refreshToken) {
                user[providerName] = {
                  id: profile.id,
                  refreshToken: refreshToken
                }
                return userdb.update({[userDbKey]: user[userDbKey]}, user, {}, (err) => {
                  return next(null, user)
                })
              } else {
                return next(null, user)
              }
            }

            // If the oAuth account is already linked to different account, exit with error
            if (req.user.id !== user.id) {
              return next(null, false, {message: 'This account is already associated with another login.'})
            }
          } else {
            // If the current session is not signed in

            // If we have the oAuth account in the db then let them sign in as that user
            if (user) {
              // @TODO Improve error handling and update query syntax here
              // If we got a refreshToken try to save it to the profile,
              // but don't worry about errors if we don't get one 
              if (refreshToken) {
                user[providerName] = {
                  id: profile.id,
                  refreshToken: refreshToken
                }
                return userdb.update({[userDbKey]: user[userDbKey]}, user, {}, (err) => {
                  return next(null, user)
                })
              } else {
                return next(null, user)
              }
            }

            // If we don't have the oAuth account in the db, check to see if an account with the
            // same email address as the one associated with their oAuth acccount exists in the db
            return userdb.findOne({email: profile.email}, (err, user) => {
              if (err) {
                return next(err)
              }
              // If we already have an account associated with that email address in the databases, the user
              // should sign in with that account instead (to prevent them creating two accounts by mistake)
              // Note: Automatically linking them here could expose a potential security exploit allowing someone
              // to pre-register or create an account elsewhere for another users email address, so don't do that.
              // @TODO This could be handled better in the UI (such as telling them it looks like they have
              // previously signed with via a Google account and maybe they should try signing in with that).
              if (user) {
                return next(null, false, {message: 'There is already an account associated with the same email address.'})
              }

              // If account does not exist, create one for them and sign the user in
              user = {
                name: profile.name,
                email: profile.email,
                [providerName]: {
                  id: profile.id,
                  refreshToken: refreshToken
                }
              }
              return userdb.insert(user, (err, response) => {
                if (err) {
                  return next(err)
                }

                // The MongoDB driver inserts the the ID on the object, but if
                // running a work-a-like, like the NeDB in-memory db, then
                // we need to add the ID on from the response.
                if (response[userDbKey]) {
                  user[userDbKey] = response[userDbKey]
                }
                
                return next(null, user)
              })
            })
          }
        })
      } catch (err) {
        return next(err)
      }
    }))
  })

  // Initialise Passport
  expressApp.use(passport.initialize())
  expressApp.use(passport.session())

  // Add routes for each provider
  providers.forEach(({providerName, providerOptions}) => {
    // Route to start sign in
    expressApp.get(path + '/oauth/' + providerName, passport.authenticate(providerName, providerOptions))
    // Route to call back to after signing in
    expressApp.get(path + '/oauth/' + providerName + '/callback',
      passport.authenticate(providerName, {
        successRedirect: path + '/callback?action=signin&service=' + providerName,
        failureRedirect: path + '/error/oauth?service=' + providerName
      })
    )
    // Route to post to unlink accounts
    expressApp.post(path + '/oauth/' + providerName + '/unlink', (req, res, next) => {
      if (!req.user) {
        return next(new Error('Not signed in'))
      }
      // Lookup user
      userdb.findOne({[userDbKey]: ObjectId(req.user.id)}, (err, user) => {
        if (err) {
          return next(err)
        }

        if (!user) {
          return next(new Error('Unable to look up account for current user'))
        }

        // Remove connection between user account and oauth provider
        if (user[providerName]) {
          user[providerName] = null
        }

        return userdb.update({[userDbKey]: user[userDbKey]}, user, {}, (err) => {
          if (err) return next(err)
          return res.redirect(path + '/callback?action=unlink&service=' + providerName)
        })
      })
    })
  })

  // A catch all for providers that are not configured
  expressApp.get(path + '/oauth/:provider', (req, res) => {
    res.redirect(path + '/error/not-configured')
  })

  return passport
}

function ObjectId(id) {
  if (process.env.USER_DB_CONNECTION_STRING) {
    return new MongoObjectId(id)
  } else {
    // If no database configured, assume NeDB DB being used, which uses
    // different ID format which doesn't match Mongo ObjectId's
    return id
  }
}