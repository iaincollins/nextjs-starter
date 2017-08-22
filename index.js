'use strict'

const express = require('express')()
const next = require('next')
const orm = require('orm')
const sass = require('node-sass')
const auth = require('./routes/auth')
const smtpTransport = require('nodemailer-smtp-transport')

// Load environment variables from .env file if present
require('dotenv').load()

// now-logs allows remote debugging if deploying to now.sh
if (process.env.LOGS_SECRET) {
  require('now-logs')(process.env.LOGS_SECRET)
}

process.on('uncaughtException', function(err) {
  console.log('Uncaught Exception: ' + err)
})

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection: Promise:', p, 'Reason:', reason)
})

// Default when run with `npm start` is 'production' and default port is '80'
// `npm run dev` defaults mode to 'development' & port to '3000'
process.env.NODE_ENV = process.env.NODE_ENV || 'production'
process.env.PORT = process.env.PORT || 80

// Configure a database to store user profiles and email sign in tokens
// Database connection string for ORM (e.g. MongoDB/Amazon Redshift/SQL DB…)
// By default it uses SQL Lite to create a DB in /tmp/nextjs-starter.db
process.env.DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING || 'sqlite:///tmp/nextjs-starter.db'

// Secret used to encrypt session data stored on the express
process.env.SESSION_SECRET = process.env.SESSION_SECRET || 'change-me'

// If EMAIL_USERNAME and EMAIL_PASSWORD are configured use them to send email.
// e.g. For a Google Mail account (@gmail.com) set EMAIL_SERVICE to 'gmail'
// See nodemailer documentation for other values for EMAIL_SERVICE.
let mailserver = null
if (process.env.EMAIL_SERVER && process.env.EMAIL_USERNAME && process.env.EMAIL_PASSWORD) {
  mailserver = smtpTransport({
    host: process.env.EMAIL_SERVER,
    port: process.env.EMAIL_PORT || 25,
    secure: (process.env.EMAIL_SECURE && process.env.EMAIL_SECURE.match(/true/i)) ? true : false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  })
}

const app = next({
  dir: '.',
  dev: (process.env.NODE_ENV === 'development')
})

const handle = app.getRequestHandler()

app.prepare()
.then(() => {

  // Set it up the database (used to store user info and email sign in tokens)
  return new Promise((resolve, reject) => {
    // Before we can set up authentication routes we need to set up a database
    orm.connect(process.env.DB_CONNECTION_STRING, function (err, db) {
      if (err) {
        return reject(err)
      }

      // Define our user object
      // * If adding a new oauth provider, add a field to store account id
      // * Tokens are single use but don't expire & we don't save verified date
      db.define('user', {
        name: {type: 'text'},
        email: {type: 'text', unique: true},
        token: {type: 'text', unique: true},
        verified: {type: 'boolean', defaultValue: false},
        facebook: {type: 'text'},
        google: {type: 'text'},
        twitter: {type: 'text'}
      })

      // Creates require tables/collections on DB
      // Note: If you add fields to am object this won't do that for you, it
      // only creates tables/collections if they are not there - you still need
      // to handle database schema changes yourself.
      db.sync(function (err) {
        if (err) {
          return reject(err)
        }
        return resolve(db)
      })
    })
  })
})
.then(db => {
  // Once DB is available, setup sessions and routes for authentication
  auth.configure({
    app: app,
    express: express,
    user: db.models.user,
    secret: process.env.SESSION_SECRET,
    mailserver: mailserver,
    fromEmail: process.env.EMAIL_ADDRESS || null
  })

  // A simple example of a custom route
  // Requests to '/route/{anything}' will be handled by 'pages/routing.js'
  // and the {anything} part will be pased to the page in parameters.
  express.get('/route/:id', (req, res) => {
    return app.render(req, res, '/routing', req.params)
  })
  // Requests to just '/route' will be redirected to '/route/example'
  express.get('/route', (req, res) => {
    return res.redirect('/route/example')
  })
  
  // Default catch-all handler to allow Next.js to handle all other routes
  express.all('*', (req, res) => {
    return handle(req, res)
  })

  // Set vary header (good practice)
  // Note: This overrides any existing 'Vary' header but is okay in this app
  express.use(function (req, res, next) {
    res.setHeader('Vary', 'Accept-Encoding')
    next()
  })

  express.listen(process.env.PORT, err => {
    if (err) {
      throw err
    }
    console.log('> Ready on http://localhost:' + process.env.PORT + ' [' + process.env.NODE_ENV + ']')
  })
})
.catch(err => {
  console.log('An error occurred, unable to start the express')
  console.log(err)
})
