/**
 * Configure Passport Strategies
 */
'use strict'

const passport = require('passport')

exports.configure = ({
    app = null, // Next.js App
    server = null, // Express Server
    user: User = null, // User model
    path = '/auth' // URL base path for authentication routes
  } = {}) => {
  if (app === null) {
    throw new Error('app option must be a next server instance')
  }

  if (server === null) {
    throw new Error('server option must be an express server instance')
  }

  if (User === null) {
    throw new Error('user option must be a User model')
  }

  // Tell Passport how to seralize/deseralize user accounts
  passport.serializeUser(function (user, next) {
    next(null, user.id)
  })

  passport.deserializeUser(function (id, next) {
    User.get(id, function (err, user) {
      // Note: We don't return all user profile fields to the client, just ones
      // that are whitelisted here to limit the amount of user data we expose.
      next(err, {
        id: user.id,
        name: user.name,
        email: user.email,
        verified: user.verified,
        facebook: Boolean(user.facebook),
        google: Boolean(user.google),
        twitter: Boolean(user.twitter)
      })
    })
  })

  let providers = []

  // IMPORTANT! If you add a provider, be sure to add a property to the User
  // model with the name of the provider or you won't be able to log in!

  if (process.env.FACEBOOK_ID && process.env.FACEBOOK_SECRET) {
    /**
     * @FIXME: The Facebook API is not returning an email address anymore.
     * The scope value should explicitly state we want this field which last
     * time I checked still worked, but it's not working as expected anymore.
     * Facebook have form for changing the API but not doing semver…
     */
    providers.push({
      provider: 'facebook',
      Strategy: require('passport-facebook').Strategy,
      strategyOptions: {
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET
      },
      scope: 'email',
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
      provider: 'google',
      Strategy: require('passport-google-oauth').OAuth2Strategy,
      strategyOptions: {
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET
      },
      scope: 'profile email',
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
  if (process.env.TWITTER_KEY && process.env.TWITTER_SECRET) {
    providers.push({
      provider: 'twitter',
      Strategy: require('passport-twitter').Strategy,
      strategyOptions: {
        consumerKey: process.env.TWITTER_KEY,
        consumerSecret: process.env.TWITTER_SECRET
      },
      scope: 'email',
      getUserFromProfile(profile) {
        return {
          id: profile.id,
          name: profile.displayName,
          email: profile.email
        }
      }
    })
  }

  // Define a Passport strategy for provider
  providers.forEach(({provider, Strategy, strategyOptions, getUserFromProfile}) => {
    strategyOptions.callbackURL = path + '/oauth/' + provider + '/callback'
    strategyOptions.passReqToCallback = true

    passport.use(new Strategy(strategyOptions, (req, accessToken, refreshToken, profile, next) => {
      try {
        // Normalise the provider specific profile into a User object
        profile = getUserFromProfile(profile)
        
        // If we didn't get an email address from the oAuth provider then
        // generate a unique one as placeholder, using Provider name and ID.
        // If you want users to specify a valid email address after signing in,
        // you can check for email addresses ending "@localhost.localdomain"
        // and prompt those users to supply a valid address.
        if (!profile.email) {
          profile.email = `${provider}-${profile.id}@localhost.localdomain`
        }

        // See if we have this oAuth account in the database associated with a user
        User.one({[provider]: profile.id}, function (err, user) {
          if (err) {
            return next(err)
          }

          if (req.user) {
            // If the current session is signed in

            // If the oAuth account is not linked to another account, link it and exit
            if (!user) {
              return User.get(req.user.id, function (err, user) {
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
                user[provider] = profile.id
                user.save(function (err) {
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
              return next(null, user)
            }

            // If the oAuth account is already linked to different account, exit with error
            if (req.user.id !== user.id) {
              return next(null, false, {message: 'This account is already associated with another login.'})
            }
          } else {
            // If the current session is not signed in

            // If we have the oAuth account in the db then let them sign in as that user
            if (user) {
              return next(null, user)
            }

            // If we don't have the oAuth account in the db, check to see if an account with the
            // same email address as the one associated with their oAuth acccount exists in the db
            return User.one({email: profile.email}, function (err, user) {
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
              User.create({name: profile.name, email: profile.email, [provider]: profile.id}, function (err, user) {
                if (err) {
                  return next(err)
                }
                return next(null, user)
              })
            })
          }
        })
      } catch (err) {
        next(err)
      }
    }))
  })

  // Initialise Passport
  server.use(passport.initialize())
  server.use(passport.session())

  // Add routes for provider
  providers.forEach(({provider, scope}) => {
    // Route to start sign in
    server.get(path + '/oauth/' + provider, passport.authenticate(provider, {scope: scope}))
    // Route to call back to after signing in
    server.get(path + '/oauth/' + provider + '/callback', passport.authenticate(provider,
      {
        successRedirect: path + '/signin?action=signin_' + provider,
        failureRedirect: path + '/error/oauth'
      })
    )
    // Route to post to unlink accounts
    server.post(path + '/oauth/' + provider + '/unlink', (req, res, next) => {
      if (!req.user) {
        next(new Error('Not signed in'))
      }
      // Lookup user
      User.get(req.user.id, function (err, user) {
        if (!user) {
          next(err)
        }

        if (!user) {
          next(new Error('Unable to look up account for current user'))
        }

        // Remove connection between user account and oauth provider
        if (user[provider]) {
          user[provider] = null
        }

        user.save(function (err) {
          if (!user) {
            next(err)
          }

          return res.redirect(path + '/signin?action=unlink_' + provider)
        })
      })
    })
  })

  // A catch all for providers that are not configured
  server.get(path + '/oauth/:provider', function (req, res) {
    res.redirect(path + '/not-configured')
  })

  return passport
}
