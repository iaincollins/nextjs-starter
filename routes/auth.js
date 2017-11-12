/**
 * Add routes for authentication
 *
 * Also sets up dependencies for authentication:
 * - Adds sessions support to Express (with HTTP only cookies for security)
 * - Configures session store (defaults to a flat file store in /tmp/sessions)
 * - Adds protection for Cross Site Request Forgery attacks to all POST requests
 *
 * Normally some of this logic might be elsewhere (like express.js) but for the
 * purposes of this example all server logic related to authentication is here.
 */
'use strict'

const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const csrf = require('lusca').csrf()
const uuid = require('uuid/v4')
const passportStrategies = require('./passport-strategies')

exports.configure = ({
    // Next.js App
    app = null,
    // Express Server
    express = null,
    // MongoDB connection to the user database
    userdb = null,
    // URL base path for authentication routes
    path = '/auth',
    // Express Session Handler
    session = require('express-session'),
    // Secret used to encrypt session data on the server
    secret = 'change-me',
    // Sessions store for express-session (defaults to /tmp/sessions file store)
    store = null,
    // Max session age in ms (default is 7 days)
    // NB: With 'rolling: true' passed to session() the session expiry time will
    // be reset every time a user visits the site again before it expires.
    maxAge = 60000 * 60 * 24 * 7,
    // How often the client should revalidate the session in ms (default 60s)
    // Does not impact the session life on the server, but causes the client to
    // always refetch session info after N seconds has elapsed since last
    // checked. Sensible values are between 0 (always check the server) and a
    // few minutes.
    clientMaxAge = 60000,
    // URL of the server (e.g. 'http://www.example.com'). Used when sending
    // sign in links in emails. Autodetects to hostname if null.
    serverUrl = null,
    // Mailserver configuration for nodemailer (defaults to localhost if null)
    mailserver = null,
    // User DB Key. This is always '_id' on MongoDB, but configurable as an 
    // option to make it easier to refactor the code below if you are using 
    // another database.
    userDbKey = '_id'
  } = {}) => {

  if (app === null) {
    throw new Error('app option must be a next server instance')
  }

  if (express === null) {
    throw new Error('express option must be an express server instance')
  }

  if (userdb === null) {
    throw new Error('userdb option must be provided')
  }

  if (store === null) {
    // Example of store
    //const FileStore = require('session-file-store')(session)
    //store = new FileStore({path: '/tmp/sessions', secret: secret})
    throw new Error('express session store not provided')
  }

  // Load body parser to handle POST requests
  express.use(bodyParser.json())
  express.use(bodyParser.urlencoded({extended: true}))

  // Configure sessions
  express.use(session({
    secret: secret,
    store: store,
    resave: false,
    rolling: true,
    saveUninitialized: false,
    httpOnly: true,
    cookie: {
      maxAge: maxAge
    }
  }))

  // Add CSRF to all POST requests
  express.use(csrf)

  // With sessions connfigured (& before routes) we need to configure Passport
  // and trigger passport.initialize() before we add any routes
  passportStrategies.configure({
    app: app,
    express: express,
    userdb: userdb,
    serverUrl: serverUrl,
    userDbKey: userDbKey
  })

  // Add route to get CSRF token via AJAX
  express.get(path + '/csrf', (req, res) => {
    return res.json({csrfToken: res.locals._csrf})
  })

  // Return session info
  express.get(path + '/session', (req, res) => {
    let session = {
      maxAge: maxAge,
      clientMaxAge: clientMaxAge,
      csrfToken: res.locals._csrf
    }

    // Add user object to session if logged in
    if (req.user) {
      session.user = {
        name: req.user.name,
        email: req.user.email
      }
      
      // If logged in, export the API access token details to the client
      // Note: This token is valid for the duration of this session only.
      if (req.session && req.session.api) {
        session.api = req.session.api
      }    
    }

    return res.json(session)
  })

  // On post request, redirect to page with instrutions to check email for link
  express.post(path + '/email/signin', (req, res) => {
    const email = req.body.email || null

    if (!email || email.trim() === '') {
      return app.render(req, res, path + '/signin', req.params)
    }

    const token = uuid()
    const verificationUrl = (serverUrl || 'http://' + req.headers.host) + path + '/email/signin/' + token

    // Create verification token save it to database
    // @TODO Improve error handling
    userdb.findOne({email: email}, (err, user) => {
      if (err) {
        throw err
      }
      if (user) {
        user.emailAccessToken = token
        userdb.update({[userDbKey]: user[userDbKey]}, user, {}, (err) => {
          if (err) {
            throw err
          }

          sendVerificationEmail({
            mailserver: mailserver,
            fromEmail: 'noreply@' + req.headers.host.split(':')[0],
            toEmail: email,
            url: verificationUrl
          })
        })
      } else {
        userdb.insert({email: email, emailAccessToken: token}, (err) => {
          if (err) {
            throw err
          }

          sendVerificationEmail({
            mailserver: mailserver,
            fromEmail: 'noreply@' + req.headers.host.split(':')[0],
            toEmail: email,
            url: verificationUrl
          })
        })
      }
    })

    return app.render(req, res, path + '/check-email', req.params)
  })

  express.get(path + '/email/signin/:token', (req, res) => {
    if (!req.params.token) {
      return res.redirect(path + '/signin')
    }

    // Look up user by token
    userdb.findOne({emailAccessToken: req.params.token}, (err, user) => {
      if (err) {
        return res.redirect(path + '/error/email')
      }
      if (user) {
        // Reset token and mark as verified
        user.emailAccessToken = null
        user.emailVerified = true
        userdb.update({[userDbKey]: user[userDbKey]}, user, {}, (err) => {
          // @TODO Improve error handling
          if (err) {
            return res.redirect(path + '/error/email')
          }
          // Having validated to the token, we log the user with Passport
          req.logIn(user, (err) => {
            if (err) {
              return res.redirect(path + '/error/email')
            }
            return res.redirect(path + '/signin?action=signin_email')
          })
        })
      } else {
        return res.redirect(path + '/error/email')
      }
    })
  })

  express.post(path + '/signout', (req, res) => {
    // Log user out by disassociating their account from the session
    req.logout()
    // Ran into issues where passport was not deleting session as it should be
    // destroying the session resolves that issue
    req.session.destroy(() => {
      res.redirect('/')
    })
  })
}

// @TODO Argument validation
function sendVerificationEmail({mailserver, fromEmail, toEmail, url}) {
  nodemailer
  .createTransport(mailserver)
  .sendMail({
    to: toEmail,
    from: fromEmail,
    subject: 'Sign in link',
    text: 'Use the link below to sign in:\n\n' + url + '\n\n'
  }, (err) => {
    // @TODO Handle errors
    if (err) {
      console.log('Error sending email to ' + toEmail, err)
    }
  })
  if (process.env.NODE_ENV === 'development')  {
    console.log('Generated sign in link ' + url + ' for ' + toEmail)
  }
}