"use strict"

const bodyParser = require('body-parser')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const nodemailer = require('nodemailer')
const csrf = require('lusca').csrf()
const orm = require("orm")
const uuid = require('uuid/v4')

module.exports = function(app, server, options) {
  return new Promise((resolve, reject) => {
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
          verified  : { type: "boolean", defaultValue: false }
      })

      // Create table
      db.sync(function(err) {
        if (err) throw err
        // Once DB is connected continue setup of Express
        init(app, server, options, { User: User }, resolve, reject)
      })
    
    })
  })
}

function init(app, server, options, db, resolve, reject) {
  const User = db.User
  
  // Base path for auth URLs
  const path = (options.path) ? options.path : '/auth'
  
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
    resave: false,
    rolling: true,
    saveUninitialized: true,
    httpOnly: true,
    cookie: {
      maxAge: maxAge
    }
  }))
  
  // Add CSRF to all POST requests
  // (If you want to add exceptions to paths you can do that here)
  server.use((req, res, next) => {
    csrf(req, res, next)
  })
  
  // Add route to get CSRF token via AJAX
  server.get(path+'/csrf', (req, res) => {
    return res.json({ csrfToken: res.locals._csrf })
  })

  // Return session info
  server.get(path+'/session', (req, res) => {
    return res.json({ 
      user: req.session.user || null,
      isLoggedIn: (req.session.user) ? true : false,
      csrfToken: res.locals._csrf
    })
  })
  
  // On post request, redirect to page with instrutions to check email for link
  server.post(path+'/signin', (req, res) => {
    const email = req.body.email || null

    if (!email || email.trim() == '')
      return app.render(req, res, pages+'/signin', req.params)
      
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
    if (!req.params.token)
      return res.redirect(path+'/signin')
      
    User.one({ token: req.params.token }, function(err, user) {
      if (user) {
        // Reset token and mark as verified
        user.token = null
        user.verified = true
        user.save(function(err) {
          // if (err) throw err
          req.session.user = user
          res.redirect(req.params.redirect || '/')
        })
      } else {
         res.redirect(path+'/invalid')
      }
    })
  })

  server.post(path+'/signout', (req, res) => {
    // Log the user out by setting isLoggedIn to false and removing user object
    // from the session
    req.session.isLoggedIn = false
    if (req.session.user)
      delete req.session.user
    res.redirect('/')
  })

  resolve(true)
}

// This method works better for URLs than the default RegEx.escape method
const escape = function(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
}