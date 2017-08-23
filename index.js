'use strict'

const express = require('express')()
const session = require('express-session')
const next = require('next')
const sass = require('node-sass')
const auth = require('./routes/auth')
const smtpTransport = require('nodemailer-smtp-transport')
const MongoClient = require('mongodb').MongoClient
const MongoStore = require('connect-mongo')(session)
const NeDB = require('nedb') // Use MongoDB work-a-like if no user db configured

// Load environment variables from .env file if present
require('dotenv').load()

// now-logs allows remote debugging if deploying to now.sh
if (process.env.LOGS_SECRET) {
  require('now-logs')(process.env.LOGS_SECRET)
}

process.on('uncaughtException', function(err) {
  console.log('Uncaught Exception: ', err)
})

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection: Promise:', p, 'Reason:', reason)
})

// Default when run with `npm start` is 'production' and default port is '80'
// `npm run dev` defaults mode to 'development' & port to '3000'
process.env.NODE_ENV = process.env.NODE_ENV || 'production'
process.env.PORT = process.env.PORT || 80

// Define the session secret (should be unique to your site)
process.env.SESSION_SECRET = process.env.SESSION_SECRET || 'change-me'

// If EMAIL_USERNAME and EMAIL_PASSWORD are configured use them to send email.
// If you don't specify an email server then email will be sent from localhost 
// which is less reliable than using a configured mail server.
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

let userdb, sessionStore

app.prepare()
.then(() => {
  // Connect to the user database
  return new Promise((resolve, reject) => {
    if (process.env.USER_DB_CONNECTION_STRING) {
      // Example connection string: mongodb://localhost:27017/my-user-db
      MongoClient.connect(process.env.USER_DB_CONNECTION_STRING, (err, db) => {
        // Return collection called 'users
        userdb = db.collection('users')
        resolve(true)
      })
    } else {
      // If no user db connection string, use in-memory MongoDB work-a-like
      console.warn("Warn: No user database connection string configured (using temporary in-memory database)")
      userdb = new NeDB({ autoload: true })
      userdb.loadDatabase((err) => {
        if (err) return reject(err)
        resolve(true)
      })
    }
  })
})
.then(() => {
  // Configure a session store and connect it to the session database
  return new Promise((resolve, reject) => {
    if (process.env.SESSION_DB_CONNECTION_STRING) {
      sessionStore = new MongoStore({
         url: process.env.SESSION_DB_CONNECTION_STRING,
         autoRemove: 'interval',
         autoRemoveInterval: 10, // Removes expired sessions every 10 minutes
         collection: 'sessions',
         stringify: false
      })
      resolve(true)
    } else {
      // If no session db connection string, use in-memory MongoDB work-a-like
      console.warn("Warn: No session database connection string configured (using in-memory session store)")
      sessionStore = new session.MemoryStore()
      resolve(true)
    }
  })
})
.then(() => {
  // Once DB connections are available, can configure authentication routes
  auth.configure({
    app: app,
    express: express,
    userdb: userdb,
    session: session,
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    mailserver: mailserver,
    fromEmail: process.env.EMAIL_ADDRESS || null,
    serverUrl: process.env.SERVER_URL || null
  })

  // A simple example of custom routing
  //
  // Requests to '/route/{anything}' will be handled by 'pages/routing.js'
  // and the {anything} part will be pased to the page in parameters.
  express.get('/route/:id', (req, res) => {
    return app.render(req, res, '/routing', req.params)
  })
  //
  // Requests to just '/route' will be redirected to '/route/example'
  express.get('/route', (req, res) => {
    return res.redirect('/route/example')
  })
  
  // Default catch-all handler to allow Next.js to handle all other routes
  express.all('*', (req, res) => {
    let nextRequestHandler = app.getRequestHandler()
    return nextRequestHandler(req, res)
  })

  express.listen(process.env.PORT, err => {
    if (err) {
      throw err
    }
    console.log('> Ready on http://localhost:' + process.env.PORT + ' [' + process.env.NODE_ENV + ']')
  })
})
.catch(err => {
  console.log('An error occurred, unable to start the server')
  console.log(err)
})
