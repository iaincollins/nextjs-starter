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
    
  // Tell Passport how to seralize/deseralize user accounts
  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function(id, done) {
    User.get(id, function(err, user) { done(err, user) })
  })
  
  // Initialise Passport
  server.use(passport.initialize())
  server.use(passport.session())

  return passport
}