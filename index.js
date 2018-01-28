'use strict'

const express = require('express')
const session = require('express-session')
const next = require('next')
const nextAuth = require('next-auth')
const nextAuthConfig = require('./next-auth.config')
const routes = {
  admin:  require('./routes/admin'),
  account:  require('./routes/account')  
}

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

const expressApp = express()

// Initialize Next.js
const nextApp = next({
  dir: '.',
  dev: (process.env.NODE_ENV === 'development')
})

// Add next-auth to next app
nextApp
.prepare()
.then(() => {
  // Load configuration and return config object
  return nextAuthConfig()
})
.then(nextAuthOptions => {

  nextAuthOptions.expressApp = expressApp
  
  // Pass Next.js App instance and NextAuth options to NextAuth
  nextAuth(nextApp, nextAuthOptions)  

  // Add admin routes
  routes.admin(expressApp)
  
  // Add account management route
  routes.account(expressApp, nextAuthOptions.functions)
  
  // Serve fonts from ionicon npm module
  expressApp.use('/fonts/ionicons', express.static('./node_modules/ionicons/dist/fonts'))
  
  // A simple example of custom routing
  // Send requests for '/custom-route/{anything}' to 'pages/examples/routing.js'
  expressApp.get('/custom-route/:slug', (req, res) => {
    return nextApp.render(req, res, '/examples/routing', req.params)
  })
  
  // Default catch-all handler to allow Next.js to handle all other routes
  expressApp.all('*', (req, res) => {
    let nextRequestHandler = nextApp.getRequestHandler()
    return nextRequestHandler(req, res)
  })

  expressApp.listen(process.env.PORT, err => {
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
