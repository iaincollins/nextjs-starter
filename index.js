'use strict'

const express = require('express')()
const session = require('express-session')
const next = require('next')
const sass = require('node-sass')
const auth = require('./routes/auth')
const smtpTransport = require('nodemailer-smtp-transport')

// nedb provides a MonogoDB work-a-like if Mongo DB is not configured
const Datastore = require('nedb')

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

// Configure a store for session data
let sessionStore
if (process.env.SESSION_DB_CONNECTION_STRING) {
  /**
   * Example of how to configure a session store (in this case, for MongoDB)
   * 
   * const MongoStore = require('connect-mongo')(session)
   * sessionStore = new MongoStore({
   *   url: process.env.SESSION_DB_CONNECTION_STRING,
   *   autoRemove: 'interval',
   *   autoRemoveInterval: 10, // Removes expired sessions every 10 minutes
   *   collection: 'sessions',
   *   stringify: false
   * })
   **/
} else {
  // If no SESSION_DB_CONNECTION_STRING specified, just use /tmp/sessions
  const FileStore = require('session-file-store')(session)
  sessionStore = new FileStore({path: '/tmp/sessions', secret: process.env.SESSION_SECRET})
}

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

const handle = app.getRequestHandler()

app.prepare()
.then(() => {
  // Set it up the database (used to store user info and email sign in tokens)
  return new Promise((resolve, reject) => {
    if (process.env.USER_DB_CONNECTION_STRING) {
  
    } else {
      const db = new Datastore()
      resolve(db)
    }
  })
})
.then(db => {
  // Once DB is available, setup sessions and routes for authentication
  auth.configure({
    app: app,
    express: express,
    userdb: db,
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    session: session,
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
    return handle(req, res)
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
