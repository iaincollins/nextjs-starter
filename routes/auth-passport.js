/**
 * Confgiure Passport Strategies
 */
"use strict"

const passport = require('passport')

exports.configure = (app, server, options) => {
  if (!options) options = {}
  
  if (!options.db || !options.db.models || !options.db.models.user)
    throw new Error("Database with user model is a required option!")

  const User = options.db.models.user

  // Base path for auth URLs
  const path = options.path || '/auth'
        
  // Tell Passport how to seralize/deseralize user accounts
  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function(id, done) {
    User.get(id, function(err, user) { 
      // Note: We don't return all user profile fields to the client, just ones
      // that are whitelisted here to limit the amount of users' data we expose.
      done(err, {
        id: user.id,
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
      name: 'Facebook',
      provider: 'facebook',
      strategy: require('passport-facebook').Strategy,
      strategyOptions: {
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET
      },
      scope: ['email', 'user_location'],
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
      name: 'Google',
      provider: 'google',
      strategy: require('passport-google-oauth').OAuth2Strategy,
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
  
  if (process.env.TWITTER_KEY && process.env.TWITTER_SECRET) {
    providers.push({
      name: 'Twitter',
      provider: 'twitter',
      strategy: require('passport-twitter').Strategy,
      strategyOptions: {
        consumerKey: process.env.TWITTER_KEY,
        consumerSecret: process.env.TWITTER_SECRET
      },
      scope: null,
      getUserFromProfile(profile) {
        return {
          id: profile.id,
          name: profile.displayName,
          email: profile.username+'@twitter'
        }
      }
    })
  }
  
  // Define a Passport strategy for provider
  providers.forEach(({ name, provider, strategy, strategyOptions, scope, getUserFromProfile }) => {
    
    
    strategyOptions.callbackURL = path+'/oauth/'+provider+'/callback'
    strategyOptions.passReqToCallback = true
    
    passport.use(new strategy(strategyOptions, (req, accessToken, refreshToken, profile, done) => {
      try {
        // Normalise the provider specific profile into a User object 
        profile = getUserFromProfile(profile)

        User.one({ [provider]: profile.id }, function(err, user) {
          if (err) return done(err)
          if (req.user) {
            // User is already logged in
    
            if (user) {
              // User is logged in already (shouldn't happen)
              if (req.user.id === user.id) done(null, user)
              // Provider account is already linked to another account
              if (req.user.id !== user.id) if (user) return done(new Error("This account is already associated with another login."))
            } else {
              // No account associated with login, save user details
              User.get(req.user.id, function(err, user) {
                if (err) return done(err)
                user.name = user.name || profile.name
                user[provider] = profile.id
                user.save(function(err) { done(err, user) })
              })
            }

          } else {
            // User is not currently logged in

            // If account already exists, can just log in
            if (user) return done(null, user)
    
            // If they don't have account for ID, check to see if one exists
            // that matches the email address associated with their acccount
            User.one({ email: profile.email }, function(err, user) {
              if (err) return done(err)
              if (user) return done(new Error("There is already an account associated with the same email address."))
        
              // If account does not exist, create one
              User.create({ name: profile.name, email: profile.email, [provider]: profile.id }, function(err, user) {
                if (err) return done(err)
                return done(null, user)
              })
            })
          }
        })
      } catch (err) {
        done(err)
      }
    }))

  })

  // Initialise Passport
  server.use(passport.initialize())
  server.use(passport.session())

  // Add routes for provider
  providers.forEach(({ provider, scope }) => {
    server.get(path+'/oauth/'+provider, passport.authenticate(provider, { scope: scope }));
    server.get(path+'/oauth/'+provider+'/callback', passport.authenticate(provider, { failureRedirect: path+'/signin' }), function(req, res) {
      // Redirect to the sign in success, page which will force the client to update it's cache
      res.redirect(path+'/success')
    })
  })
  
  // A catch all for providers that are not configured
  server.get(path+'/oauth/:provider', function(req, res) {
    res.redirect(path+'/not-configured')
  })
    
  return passport
}