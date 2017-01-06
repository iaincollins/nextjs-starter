"use strict"

const bodyParser = require('body-parser')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const TwitterStrategy = require('passport-twitter').Strategy
const nodemailer = require('nodemailer')
const csrf = require('lusca').csrf()
const orm = require("orm")
const uuid = require('uuid/v4')

module.exports = function(app, server, options, callback) {
  if (!options) options = {}

  // Database connection string for ORM (e.g. MongoDB/Amazon Redshift/SQL DB…)
  // Default is to create an SQL Lite DB in /tmp/website.db to store user info
  const connectionString = (options.connectionString) ? options.connectionString : "sqlite:///tmp/website.db"

  orm.connect(connectionString, function (err, db) {
    if (err) throw err

    // Define user object
    const User = db.define("user", {
        name      : { type: "text" },
        email     : { type: "text", unique: true },
        token     : { type: "text" },
        verified  : { type: "boolean", defaultValue: false },
        facebook  : { type: "text" },
        google    : { type: "text" },
        twitter   : { type: "text" }
    })

    // Create table
    db.sync(function(err) {
      if (err) throw err
      // Once DB is connected continue setup of Express
      init(app, server, options, { User: User }, callback)
    })
    
  })
}

function init(app, server, options, db, callback) {
  const User = db.User
  
  // Base path for auth URLs
  const path = (options.path) ? options.path : '/auth'

  const credentials = (options.credentials) ? options.credentials : {
    facebook: {
      clientID: process.env.FACEBOOK_ID || '',
      clientSecret: process.env.FACEBOOK_SECRET || '',
      callbackURL: path+'/facebook/callback',
      passReqToCallback: true
    },
    google: {
      clientID: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || '',
      callbackURL: path+'/google/callback',
      passReqToCallback: true
    },
    twitter: {
      consumerKey: process.env.TWITTER_ID || process.env.TWITTER_KEY || '',
      consumerSecret: process.env.TWITTER_SECRET  || '',
      callbackURL: path+'/twitter/callback',
      passReqToCallback: true
    }
  }
  
  // Directory for auth pages
  const pages = (options.pages) ? options.pages : 'auth'

  // The secret is used to encrypt/decrypt sessions (you should pass your own!)
  const secret = (options.secret) ? options.secret : 'AAAA-BBBB-CCCC-DDDD'
   
  // Configure session store (defaults to using file system)
  const store = (options.store) ? options.store : new FileStore({ path: '/tmp/sessions', secret: secret })

  // Max cookie age (default is 4 weeks)
  const maxAge = (options.maxAge) ? options.maxAge : 3600000 * 24 * 7 * 4

  // URL of the server (e.g. "http://www.example.com"), autodetects if null
  const serverUrl = (options.serverUrl) ? options.mailserver : null

  // Mailserver (defaults to sending from localhost)
  const mailserver = (options.mailserver) ? options.mailserver : null
  
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
  
  server.use(function(req, res, next) {
    // Add Cross Site Request Forgery Protection 
    if (new RegExp(escape(path+'/')).test(req.path)) {
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
    const email = req.body.email

    const token = uuid()
    const verificationUrl = (serverUrl || "http://"+req.headers.host)+'/auth/signin/'+token

    // Create verification token save it to database
    // @TODO Error handling (i.e. don't send email unless it worked)
    User.one({ email: email }, function(err, user) {
      if (user) {
        user.token = token
        user.save(function(err) {
          // if (err) throw err
        })
      } else {
        User.create({ email: email, token: token }, function(err) {
          // if (err) throw err
        })
      }
    })
  
    nodemailer
    .createTransport(mailserver)
    .sendMail({
      to: email,
      from: "noreply@"+req.headers.host.split(":")[0],
      subject: 'Sign in link',
      text: 'Use the link below to sign in:\n\n'+
             verificationUrl+'\n\n'
    }, function(err) {
      // @TODO Handle errors
      if (err) console.log("Error sending email", err)
      return app.render(req, res, pages+'/check-email', req.params)
    })
    
  })

  server.get(path+'/signin/:token', (req, res) => {
    // @TODO Improve error handling
    
    if (!req.params.token)
      return res.redirect(path+'/signin')
      
    User.one({ token: req.params.token }, function(err, user) {
      if (user) {
        // Reset token and mark as verified
        user.token = null
        user.verified = true
        user.save(function(err) {
          // if (err) throw err

        })
        res.redirect(req.params.redirect || '/')
      } else {
        return res.redirect(path+'/signin')
      }
    })
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

  server.get(path+'/google', passport.authenticate('google', { scope: 'profile email' }))
  server.get(path+'/google/callback', passport.authenticate('google', { failureRedirect: path+'/signin' }), function(req, res) {
    res.redirect(req.session.returnTo || '/')
  })

  server.get(path+'/twitter', passport.authenticate('twitter'))
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

  callback(true)
}

// This method works better for URLs than the default RegEx.escape method
const escape = function(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
}