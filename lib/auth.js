"use strict"

const bodyParser = require('body-parser')
const session = require('express-session')
const FileStore = require('session-file-store')(session);
const passport = require('passport')
const csrf = require('lusca').csrf()
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const TwitterStrategy = require('passport-twitter').Strategy

module.exports = function(app, server, options) {

  const credentials = (options && options.credentials) ? options.credentials : {
    facebook: {
      clientID: process.env.FACEBOOK_ID || '',
      clientSecret: process.env.FACEBOOK_SECRET || '',
      callbackURL: '/auth/facebook/callback',
      passReqToCallback: true
    },
    google: {
      clientID: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || '',
      callbackURL: '/auth/google/callback',
      passReqToCallback: true
    },
    twitter: {
      consumerKey: process.env.TWITTER_ID || process.env.TWITTER_KEY || '',
      consumerSecret: process.env.TWITTER_SECRET  || '',
      callbackURL: '/auth/twitter/callback',
      passReqToCallback: true
    }
  }
  
  // Directory for auth pages
  const pages = (options && options.pages) ? options.pages : 'auth'
  
  // Base path for auth URLs
  const path = (options && options.path) ? options.path : '/auth'

  // The secret is used to encrypt/decrypt sessions (you should pass your own!)
  const secret = (options && options.secret) ? options.secret : 'AAAA-BBBB-CCCC-DDDD'
   
  // Configure session store (defaults to using file system)
  const store = (options && options.store) ? options.store : new FileStore({ path: '/tmp/sessions', secret: secret })

  // Max cookie age (default is 4 weeks)
  const maxAge = (options && options.maxAge) ? options.maxAge : 3600000 * 24 * 7 * 4

  // Load body parser to handle POST requests
  server.use(bodyParser.json())
  server.use(bodyParser.urlencoded({ extended: true }))

  // Configure sessions
  server.use(session({
    secret: secret,
    store: store,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: maxAge
    }
  }))
  
  // Initalize passport and wire it to use sessions
  server.use(passport.initialize())
  server.use(passport.session())
  
  // Add Cross Site Request Forgery Protection 
  server.use(function(req, res, next) {
    if (new RegExp(escape(path)+'\/').test(req.path)) {
      // Apply CSRF to all POST requests under /auth
      csrf(req, res, next)
    } else {
      // Do not apply CSRF to routes not under /auth
      return next()
    }
  })
  
  // Add route to get CSRF token via AJAX
  server.get(path+'/csrf', (req, res) => {
    return res.json({ _csrf: res.locals._csrf })
  })

  // On post request, redirect to page with instrutions to check email for link
  server.post(path+'/signin', (req, res) => {
    // @TODO Create tmp token and send email with verification link
    return app.render(req, res, pages+'/check-email', req.params)
  })

  server.get(path+'/signin/:emailToken', (req, res) => {
    // @TODO Verify emailToken and create login session if valid
    const redirectTo = req.params.redirect || '/'
    res.redirect(redirectTo)
  })

  server.post(path+'/signout', (req, res) => {
    // @TODO Teardown session
    return app.render(req, res, pages+'/signout', req.params)
  })

  // Add routes for Facebook, Google and Twitter oAuth
  server.get(path+'/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }))
  server.get(path+'/facebook/callback', passport.authenticate('facebook', { failureRedirect: path+'/signin' }), function(req, res) {
    res.redirect(req.session.returnTo || '/')
  })

  server.get(path+'/google', passport.authenticate('google', { scope: 'profile email' }));
  server.get(path+'/google/callback', passport.authenticate('google', { failureRedirect: path+'/signin' }), function(req, res) {
    res.redirect(req.session.returnTo || '/')
  })

  server.get(path+'/twitter', passport.authenticate('twitter'));
  server.get(path+'/twitter/callback', passport.authenticate('twitter', { failureRedirect: path+'/signin' }), function(req, res) {
    res.redirect(req.session.returnTo || '/')
  })

  // @TODO Define Passport authentication strategies

  passport.use(new LocalStrategy({ usernameField: 'email' }, function(email, verificationToken, done) {
    // @TODO Verify email address and verificationToken and sign users in
    /*
    if (emailIsValid() && verificationTokenIsValid()) {
      return done(null, true)
    } else {
      return done(null, false, { message: 'Invalid email address or verification token.' })
    }
    */
  }))

  /*
  passport.use(new FacebookStrategy(credentials.facebook, function(req, accessToken, refreshToken, profile, done) {
    if (userIsAlreadyLoggedIn()) {
      // If the user is already logged in, try to link it their Facebook account with it
      if (getProfileByAuthId('facebook', profile.id)) {
        // @TODO Display message indicating that a seperate local account linked to that Facebook account already exists
        // e.g. 'There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.'
      } else {
        // @TODO Link Facebook profile.id to the currently logged in account
      }
    } else {
      // If the user is not logged in, try logging them in
      if (getProfileByAuthId('facebook', profile.id)) {
        // @TODO Already has an account so just sign in
      } else {
        // @TODO Before creating an account, check for an existing account associated with their email address
        if (getProfileByEmail(profile._json.email)) {
          // @TODO Display message indicating there is already an account associated with that email address
          // e.g. 'There is already an account using this email address. Sign in to that account via email and link it with Facebook.'
        } else {
          // @TODO Create and account and sign them i
        }
      }
    }
  }))
  
  passport.use(new GoogleStrategy(credentials.google, function(req, accessToken, tokenSecret, profile, done) {
    if (userIsAlreadyLoggedIn()) {
      // If the user is already logged in, try to link it their Facebook account with it
      if (getProfileByAuthId('google', profile.id)) {
        // @TODO Display message indicating that a seperate local account linked to that Facebook account already exists
        // e.g. 'There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.'
      } else {
        // @TODO Link Facebook profile.id to the currently logged in account
      }
    } else {
      // If the user is not logged in, try logging them in
      if (getProfileByAuthId('google', profile.id)) {
        // @TODO Already has an account so just sign in
      } else {
        // @TODO Before creating an account, check for an existing account associated with their email address
        if (getProfileByEmail(profile._json.email)) {
          // @TODO Display message indicating there is already an account associated with that email address
          // e.g. 'There is already an account using this email address. Sign in to that account via email and link it with Facebook.'
        } else {
          // @TODO Create and account and sign them i
        }
      }
    }
  }))

  passport.use(new TwitterStrategy(credentials.twitter, function(req, accessToken, tokenSecret, profile, done) {
    if (userIsAlreadyLoggedIn()) {
      // If the user is already logged in, try to link it their Facebook account with it
      if (getProfileByAuthId('twitter', profile.id)) {
        // @TODO Display message indicating that a seperate local account linked to that Facebook account already exists
        // e.g. 'There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.'
      } else {
        // @TODO Link Facebook profile.id to the currently logged in account
      }
    } else {
      // If the user is not logged in, try logging them in
      if (getProfileByAuthId('twitter', profile.id)) {
        // @TODO Already has an account so just sign in
      } else {
        // @TODO Create and account and sign them in
        // Note: Twitter does not expose email addresses, so unlike other services
        // we can't check if a user already has an account associated  with their
        // email address. We can set a temporary email address for them.
        const email = profile.id+"@twitter"
      }
    }
  }))
  */

}

// This method works better for URLs than the default RegEx.escape method
const escape = function(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
}