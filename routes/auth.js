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
    nextApp = null,
    // Express Server
    expressApp = null,
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

  if (nextApp === null) {
    throw new Error('nextApp option must be a next server instance')
  }

  if (expressApp === null) {
    throw new Error('expressApp option must be an express server instance')
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
  expressApp.use(bodyParser.json())
  expressApp.use(bodyParser.urlencoded({extended: true}))

  // Configure sessions
  expressApp.use(session({
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
  expressApp.use(csrf)

  // With sessions connfigured (& before routes) we need to configure Passport
  // and trigger passport.initialize() before we add any routes
  passportStrategies.configure({
    expressApp: expressApp,
    userdb: userdb,
    serverUrl: serverUrl,
    userDbKey: userDbKey
  })

  // Add route to get CSRF token via AJAX
  expressApp.get(path + '/csrf', (req, res) => {
    return res.json({csrfToken: res.locals._csrf})
  })

  // Return session info
  expressApp.get(path + '/session', (req, res) => {
    let session = {
      maxAge: maxAge,
      clientMaxAge: clientMaxAge,
      csrfToken: res.locals._csrf
    }

    // Add user object to session if logged in
    if (req.user) {
      session.user = req.user
      
      // If logged in, export the API access token details to the client
      // Note: This token is valid for the duration of this session only.
      if (req.session && req.session.api) {
        session.api = req.session.api
      }    
    }

    return res.json(session)
  })

  // On post request, redirect to page with instrutions to check email for link
  expressApp.post(path + '/email/signin', (req, res) => {
    const email = req.body.email || null

    if (!email || email.trim() === '') {
      return nextApp.render(req, res, path + '/signin', req.params)
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

    return nextApp.render(req, res, path + '/check-email', req.params)
  })

  expressApp.get(path + '/email/signin/:token', (req, res) => {
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
            // If we end up here, login was successful
            return res.redirect(path + '/callback?action=signin&service=email')
          })
        })
      } else {
        return res.redirect(path + '/error/email')
      }
    })
  })

  expressApp.post(path + '/signout', (req, res) => {
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