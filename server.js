"use strict"

const express = require('express')
const next = require('next')
const auth = require('./lib/auth')

// Default when run with `npm start` is 'production' and default port is '80'
// `npm run dev` defaults mode to 'development' & port to '3000'
process.env.NODE_ENV = process.env.NODE_ENV || "production"
process.env.PORT = process.env.PORT || 80

const app = next({
  dir: '.', 
  dev: (process.env.NODE_ENV === 'development') ? true : false
})

const handle = app.getRequestHandler()
let server

app.prepare()
.then(() => {
  server = express()

  // 'auth' configures auth routes for express + datastores for users & sessions
  // NB: It returns a promise as we have to wait for datastores to be setup 
  // and available before we can call listen()
  return auth(app, server, {})
})
.then(() => {
  // Requests to '/route/{anything}' ared handled by the 'routing' page
  server.get('/route/:id', (req, res) => {
    return app.render(req, res, '/routing', req.params)
  })

  // Default catch-all handler
  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(process.env.PORT, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:'+process.env.PORT+" ["+process.env.NODE_ENV+"]")
  })
})