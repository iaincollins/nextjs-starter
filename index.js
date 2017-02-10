"use strict"

// Load environment variables from .env file if present
require('dotenv').load()

const express = require('express')
const next = require('next')
const auth = require('./routes/auth')
const orm = require("orm")

// Default when run with `npm start` is 'production' and default port is '80'
// `npm run dev` defaults mode to 'development' & port to '3000'
process.env.NODE_ENV = process.env.NODE_ENV || "production"
process.env.PORT = process.env.PORT || 80

// Configure a database to store user profiles and email sign in tokens
// Database connection string for ORM (e.g. MongoDB/Amazon Redshift/SQL DB…)
// By default it uses SQL Lite to create a DB in /tmp/nextjs-starter.db
process.env.DB = process.env.DB || "sqlite:///tmp/nextjs-starter.db"

const app = next({
  dir: '.', 
  dev: (process.env.NODE_ENV === 'development') ? true : false
})

const handle = app.getRequestHandler()
let server

app.prepare()
.then(() => {
  // Get instance of Express server
  server = express()

  // Set it up the database (used to store user info and email sign in tokens)
  return new Promise((resolve, reject) => {
    // Before we can set up authentication routes we need to set up a database
    orm.connect(process.env.DB, function (err, db) {
      if (err) throw err

      // Define user object
      const User = db.define("user", {
        name      : { type: "text" },
        email     : { type: "text", unique: true },
        token     : { type: "text", unique: true },
        verified  : { type: "boolean", defaultValue: false },
        facebook  : { type: "text" },
        google    : { type: "text" },
        twitter   : { type: "text" }
      })

      // Create table
      db.sync(function(err) {
        if (err) throw err
        return resolve(db)
      })
    })
  })
})
.then((db) => {
  // Once DB is available, setup sessions and routes for authentication
  auth.configure(app, server, { db: db })
  
  // A simple example of a custom route
  // Requests to '/route/{anything}' will be handled by 'pages/routing.js'
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