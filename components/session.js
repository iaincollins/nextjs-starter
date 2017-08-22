/* global window */
/* global localStorage */
/* global XMLHttpRequest */
/**
 * A class to handle signing in and out and caching session data in sessionStore
 *
 * Note: We use XMLHttpRequest() here rather than fetch because fetch() uses
 * Service Workers and they cannot share cookies with the browser session
 * yet (!) so if we tried to get or pass the CSRF token it would mismatch.
 **/

export default class {
  
  /**
   * A simple static method to get the CSRF Token is provided for convenience.
   **/
  static async getCsrfToken() {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        return reject(Error('This method should only be called on the client'))
      }

      let xhr = new XMLHttpRequest()
      xhr.open('GET', '/auth/csrf', true)
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const responseJson = JSON.parse(xhr.responseText)
            resolve(responseJson.csrfToken)
          } else {
            reject(Error('Unexpected response when trying to get CSRF token'))
          }
        }
      }
      xhr.onerror = () => {
        reject(Error('XMLHttpRequest error: Unable to get CSRF token'))
      }
      xhr.send()
    })
  }

  // We can't do async requests in the constructor so access is via asyc method
  // This allows us to use XMLHttpRequest when running on the client to fetch it
  // Note: We use XMLHttpRequest instead of fetch so auth cookies are passed
  static async getSession({
    req = null,
    force = false
  } = {}) {
    let session = {}
    if (req) {
      // If running on the server session data should be in the req object
      session.csrfToken = req.connection._httpMessage.locals._csrf
      session.expires = req.session.cookie._expires
      // If the user is logged in, add the user to the session object
      if (req.user) {
        session.user = req.user
      }
    } else {
      // If running in the browser attempt to load session from sessionStore
      if (force === true) {
        // If force update is set, reset data store
        this._removeLocalStore('session')
      } else {
        session = this._getLocalStore('session')
      }
    }

    // If session data exists, has not expired AND force is not set then
    // return the stored session we already have.
    if (session && Object.keys(session).length > 0 && session.expires && session.expires > Date.now()) {
      return new Promise(resolve => {
        resolve(session)
      })
    }

    // If we don't have session data, or it's expired, or force is set
    // to true then revalidate it by fetching it again from the server.
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest()
      xhr.open('GET', '/auth/session', true)
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            // Update session with session info
            session = JSON.parse(xhr.responseText)

            // Set a value we will use to check this client should silently
            // revalidate based on the value of clientMaxAge set by the server
            session.expires = Date.now() + session.clientMaxAge

            // Save changes to session
            this._saveLocalStore('session', session)

            resolve(session)
          } else {
            reject(Error('XMLHttpRequest failed: Unable to get session'))
          }
        }
      }
      xhr.onerror = () => {
        reject(Error('XMLHttpRequest error: Unable to get session'))
      }
      xhr.send()
    })
  }

  static async signin(email) {
    // Sign in to the server
    return new Promise(async (resolve, reject) => {
      if (typeof window === 'undefined') {
        return reject(Error('This method should only be called on the client'))
      }

      // Make sure we have session in memory
      let session = await this.getSession()

      // Make sure we have the latest CSRF Token in our session
      session.csrfToken = await this.getCsrfToken()

      let xhr = new XMLHttpRequest()
      xhr.open('POST', '/auth/email/signin', true)
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      xhr.onreadystatechange = async () => {
        if (xhr.readyState === 4) {
          if (xhr.status !== 200) {
            return reject(Error('XMLHttpRequest error: Error while attempting to signin'))
          }

          return resolve(true)
        }
      }
      xhr.onerror = () => {
        return reject(Error('XMLHttpRequest error: Unable to signin'))
      }
      xhr.send('_csrf=' + encodeURIComponent(session.csrfToken) + '&' +
                'email=' + encodeURIComponent(email))
    })
  }

  static async signout() {
    // Signout from the server
    return new Promise(async (resolve, reject) => {
      if (typeof window === 'undefined') {
        return reject(Error('This method should only be called on the client'))
      }

      let xhr = new XMLHttpRequest()
      xhr.open('POST', '/auth/signout', true)
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      xhr.onreadystatechange = async () => {
        if (xhr.readyState === 4) {
          // @TODO We aren't checking for success, just comletion
          this._removeLocalStore('session')
          resolve(true)
        }
      }
      xhr.onerror = () => {
        reject(Error('XMLHttpRequest error: Unable to signout'))
      }
      xhr.send('_csrf=' + encodeURIComponent(await this.getCsrfToken()))
    })
  }

  // The Web Storage API is widely supported, but not always available (e.g.
  // it can be restricted in private browsing mode, triggering an exception).
  // We handle that silently by just returning null here.
  static _getLocalStore(name) {
    try {
      return JSON.parse(localStorage.getItem(name))
    } catch (err) {
      return null
    }
  }
  
  static _saveLocalStore(name, data) {
    try {
      localStorage.setItem(name, JSON.stringify(data))
      return true
    } catch (err) {
      return false
    }
  }
  
  static _removeLocalStore(name) {
    try {
      localStorage.removeItem(name)
      return true
    } catch (err) {
      return false
    }
  }

}