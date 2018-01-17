/**
 * Defines an endpoint that returns a list of users. You must be signed in and
 * have "admin": true set in your profile to be able to call the /admin/users
 * end point.
 **/
'use strict'

exports.configure = ({
     // Express Server
    expressApp = null,
    // MongoDB connection to the user database
    userdb = null
  } = {}) => {

  if (expressApp === null) {
    throw new Error('expressApp option must be an express server instance')
  }

  if (userdb === null) {
    throw new Error('userdb option must be provided')
  }
 
  expressApp.get('/admin/users', (req, res) => {
    // Check user is logged in and has admin access
    if (!req.user || !req.user.admin || req.user.admin !== true)
      return res.status('403').end()
      
    const page = (req.query.page && parseInt(req.query.page) > 0) ? parseInt(req.query.page) : 1
    const sort = (req.query.sort) ? { [req.query.sort]: 1 } : {}
    
    let size = 10
    if (req.query.size 
        && parseInt(req.query.size) > 0
        && parseInt(req.query.size) < 500) {
      size = parseInt(req.query.size)
    }

    const skip = (size*(page-1) > 0) ? size*(page-1) : 0
    
    let response = {
      users: [],
      page: page,
      size: size,
      sort: req.params.sort,
      total: 0
    }
    
    if (req.params.sort) response.sort = req.params.sort

    let result
    return new Promise(function(resolve, reject) {
      result = userdb
      .find()
      .skip(skip)
      .sort(sort)
      .limit(size)
      
      result.toArray((err, users) => {
        if (err) {
          reject(err)
        } else {
          resolve(users)
        }
      })
    })
    .then(users => {
      response.users = users
      return result.count()
    })
    .then(count => {
      response.total = count
      return res.json(response)
    })
    .catch(err => {
      return res.status(500).json(err)
    })
    
  })

}