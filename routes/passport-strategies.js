/**
 * Configure Passport Strategies
 **/
'use strict'

const passport = require('passport')

exports.configure = ({
    express = null, // Express Server
    user: User = null, // User model
    userDbKey = '_id',
    path = '/auth', // URL base path for authentication routes
    serverUrl: serverUrl
  } = {}) => {
  if (express === null) {
    throw new Error('express option must be an instance of an express server')
  }

  if (User === null) {
    throw new Error('user option must be a User model')
  }
  
  // Tell Passport how to seralize/deseralize user accounts
  passport.serializeUser((user, next) => {
    next(null, user[userDbKey])
  })

  passport.deserializeUser((id, next) => {
    User.one({[userDbKey]: id}, (err, user) => {
      // Pass error back (if there was one) and invalidate session if user
      // could not be fetched by returning 'false'. This prevents an exception
      // in edge cases like an account being deleted while logged in.
      if (err || !user)
        return next(err, false)
        
      // Note: We don't save all user profile fields with the session,
      // just ones we need.
      next(err, {
        id: user[userDbKey],
        name: user.name,
        email: user.email
      })
    })
  })

  let providers = []

  // IMPORTANT! If you add a provider, be sure to add a property to the User
  // model with the name of the provider or you won't be able to log in!

  if (process.env.FACEBOOK_ID && process.env.FACEBOOK_SECRET) {
    providers.push({
      providerName: 'facebook',
      providerOptions: {
        scope: ['email', 'public_profile']
      },
      Strategy: require('passport-facebook').Strategy,
      strategyOptions: {
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        profileFields: ['id', 'displayName', 'email', 'link']
      },
      getUserFromProfile(profile) {
        return {
          id: profile.id,
          name: profile.displayName,
          email: profile._json.email
        }
      }
    })
  }

  if (process.env.GOOGLE_ID && process.env.GOOGLE_SECRET) {
    providers.push({
      providerName: 'google',
      providerOptions: {
        scope: ['profile', 'email']
      },
      Strategy: require('passport-google-oauth').OAuth2Strategy,
      strategyOptions: {
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET
      },
      getUserFromProfile(profile) {
        return {
          id: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value
        }
      }
    })
  }

  // Note: Twitter doesn't expose emails by default so we create a placeholder
  // later if we don't get an email address.
  //
  // To have your Twitter oAuth return emails go to apps.twitter.com and add 
  // links to your Terms and Conditions and Privacy Policy under the "Settings" 
  // tab, then check the "Request email addresses" from users box under the 
  // "Permissions" tab. 
  if (process.env.TWITTER_KEY && process.env.TWITTER_SECRET) {
    providers.push({
      providerName: 'twitter',
      providerOptions: {
        scope: []
      },
      Strategy: require('passport-twitter').Strategy,
      strategyOptions: {
        consumerKey: process.env.TWITTER_KEY,
        consumerSecret: process.env.TWITTER_SECRET,
        userProfileURL: 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true'
      },
      getUserFromProfile(profile) {
        return {
          id: profile.id,
          name: profile.displayName,
          email: (profile.emails && profile.emails[0].value) ? profile.emails[0].value : ''
        }
      }
    })
  }

  // Define a Passport strategy for provider
  providers.forEach(({providerName, Strategy, strategyOptions, getUserFromProfile}) => {

    strategyOptions.callbackURL = (serverUrl || '') + path + '/oauth/' + providerName + '/callback' 
    strategyOptions.passReqToCallback = true
    
    passport.use(new Strategy(strategyOptions, (req, accessToken, refreshToken, profile, next) => {

      req.session[providerName] = {accessToken: accessToken}

      try {
        // Normalise the provider specific profile into a User object
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
        User.one({ [providerName+'.id']: profile.id }, (err, user) => {

          if (err) return next(err)

          if (req.user) {
            // If the current session is signed in
                        
            // If the oAuth account is not linked to another account, link it and exit
            if (!user) {
             return User.one({[userDbKey]: req.user.id}, (err, user) => {
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
                return user.save((err) => {
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
              // If we got a refreshToken try to save it to the profile 
              if (refreshToken) {
                user[providerName] = {
                  id: profile.id,
                  refreshToken: refreshToken
                }
                return user.save((err) => {
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
              // If we got a refreshToken try to save it to the profile 
              if (refreshToken) {
                user[providerName] = {
                  id: profile.id,
                  refreshToken: refreshToken
                }
                return user.save((err) => {
                  return next(null, user)
                })
              } else {
                return next(null, user)
              }
            }

            // If we don't have the oAuth account in the db, check to see if an account with the
            // same email address as the one associated with their oAuth acccount exists in the db
            return User.one({email: profile.email}, (err, user) => {
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
              return User.create({
                name: profile.name,
                email: profile.email,
                [providerName]: {
                  id: profile.id,
                  refreshToken: refreshToken
                }
              }, (err, user) => {
                if (err) {
                  return next(err)
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
  express.use(passport.initialize())
  express.use(passport.session())

  // Add routes for each provider
  providers.forEach(({providerName, providerOptions}) => {
    // Route to start sign in
    express.get(path + '/oauth/' + providerName, passport.authenticate(providerName, providerOptions))
    // Route to call back to after signing in
    express.get(path + '/oauth/' + providerName + '/callback',
      passport.authenticate(providerName, {
        successRedirect: path + '/signin?action=signin&service=' + providerName,
        failureRedirect: path + '/error/oauth?service=' + providerName
      })
    )
    // Route to post to unlink accounts
    express.post(path + '/oauth/' + providerName + '/unlink', (req, res, next) => {
      if (!req.user) {
        return next(new Error('Not signed in'))
      }
      // Lookup user
      User.one({[userDbKey]: req.user.id}, (err, user) => {
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

        return user.save((err) => {
          if (!user) {
            return next(err)
          }

          return res.redirect(path + '/signin?action=unlink_' + providerName)
        })
      })
    })
  })

  // A catch all for providers that are not configured
  express.get(path + '/oauth/:provider', (req, res) => {
    res.redirect(path + '/not-configured')
  })

  return passport
}