'use strict'

const express = require('express')()
const session = require('express-session')
const next = require('next')
const auth = require('./routes/auth')
const smtpTransport = require('nodemailer-smtp-transport')
const directTransport = require('nodemailer-direct-transport')
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
  console.error('Uncaught Exception: ', err)
})

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection: Promise:', p, 'Reason:', reason)
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
let mailserver = directTransport()
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
        userdb = db.collection('users')
        resolve(true)
      })
    } else {
      // If no user db connection string, use in-memory MongoDB work-a-like
      console.warn("Warning: No user database connection string configured (using in-memory database, user data will not be persisted)")
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
      console.warn("Warning: No session database connection string configured (using in-memory session store, session data will not be persisted)")
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
  // Send requests for '/custom-route/{anything}' to 'pages/demos/routing.js'
  express.get('/custom-route/:id', (req, res) => {
    return app.render(req, res, '/demos/routing')
  })
  //
  // Requests to just '/custom-route' will redirect to '/custom-route/example' 
  // (which will trigger the route handling above)
  express.get('/custom-route', (req, res) => {
    return res.redirect('/custom-route/example')
  })

  // Expose a route to return user profile if logged in with a session
  express.get('/account/user', (req, res) => {
    if (req.user) {
      userdb.findOne({'_id': req.user.id}, (err, user) => {
        if (err || !user)
          return res.status(500).json({error: 'Unable to fetch profile'})
        res.json({
          name: user.name,
          email: user.email,
          emailVerified: (user.emailVerified && user.emailVerified === true) ? true : false,
          linkedWithFacebook: (user.facebook && user.facebook.id) ? true : false,
          linkedWithGoogle: (user.google && user.google.id) ? true : false,
          linkedWithTwitter: (user.twitter && user.twitter.id) ? true : false
        })
      })
    } else {
      return res.status(403).json({error: 'Must be signed in to get profile'})
    }
  })
  
  // Expose a route to allow users to update their profiles (name, email)
  express.post('/account/user', (req, res) => {
    if (req.user) {
      userdb.findOne({'_id': req.user.id}, (err, user) => {
        if (err || !user)
          return res.status(500).json({error: 'Unable to fetch profile'})

          if (req.body.name)
          user.name = req.body.name

        if (req.body.email) {
          // Reset email verification field if email address has changed
          if (req.body.email && req.body.email !== user.email)
            user.emailVerified = false
        
          user.email = req.body.email
        }
        userdb.update({'_id': user._id}, user, {}, (err) => {
          if (err)
            return res.status(500).json({error: 'Unable save changes to profile'})
          return res.status(204).redirect('/account')
        })
      })
    } else {
      return res.status(403).json({error: 'Must be signed in to update profile'})
    }
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
