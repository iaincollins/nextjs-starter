/**
 * A class to handle signing in and out and caching session data in sessionStore
 *
 * Note: We use XMLHttpRequest() here rather than fetch because fetch() uses
 * Service Workers and they cannot share cookies with the browser session
 * yet (!) so if we tried to get or pass the CSRF token it would mismatch.
 */
export default class Session {

  constructor(props) {
    this._session = {}
    try {
      if (props) {
        // If running on server we can access the server side environment
        this._session = {
         user: props[0].req.session.user || null,
         isLoggedIn: (props[0].req.session.user) ? true : false,
         csrfToken: props[0].req.connection._httpMessage.locals._csrf
        }
      } else {
        // If running on client, attempt to load session from sessionStorage
        this._session = this._getSessionStore()
      }
    } catch (e) {
      // @TODO Handle if error reading from session storage or server state
    }
  }
    
  async getCsrfToken() {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined')
        return reject(Error('This method should only be called on the client'))

      let xhr = new XMLHttpRequest()
      xhr.open("GET", '/auth/csrf', true)
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            const responseJson = JSON.parse(xhr.responseText)
            
            // Save changes to session
            this._session.csrfToken = responseJson.csrfToken
            this._setSessionStore(this._session)

            resolve(this._session.csrfToken)
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
  async getSession(forceUpdate) {
    // If we have a populated session object already AND forceUpdate is not
    // set to true then return the session object we have in memory
    if (this._session && Object.keys(this._session).length !== 0 && forceUpdate != true) {
      return new Promise((resolve) => {
        resolve(this._session)
      })
    } else {
      return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest()
        xhr.open("GET", '/auth/session', true)
        xhr.onreadystatechange = () => {
          if (xhr.readyState == 4) {
            if (xhr.status == 200) {
              // Update session with session info
              this._session = JSON.parse(xhr.responseText)
              
              // Save changes to session
              this._setSessionStore(this._session)
              
              resolve(this._session)
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
  }

  async signin(email) {
    // Sign in to the server
    return new Promise(async (resolve, reject) => {
      if (typeof window === 'undefined')
        return reject(Error('This method should only be called on the client'))
        
      // Make sure we have session in memory
      this._session = await this.getSession()

      // Make sure we have the latest CSRF Token in our session
      await this.getCsrfToken()

      let xhr = new XMLHttpRequest()
      xhr.open("POST", '/auth/signin', true)
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            resolve(true)
          } else {
            reject(Error('XMLHttpRequest error: Error while attempting to signin'))
          }
        }
      }
      xhr.onerror = () => {
        reject(Error('XMLHttpRequest error: Unable to signin'))
      }
      xhr.send("_csrf="+encodeURIComponent(this._session.csrfToken)+"&"
               +"email="+encodeURIComponent(email))

    })
  }
  
  async signout() {
    // Signout from the server
    return new Promise(async (resolve, reject) => {
      if (typeof window === 'undefined')
        return reject(Error('This method should only be called on the client'))

      // Make sure we have session in memory
      this._session = await this.getSession()

      // Set isLoggedIn to false and destory user object
      this._session.csrfToken = await this.getCsrfToken()
      this._session.isLoggedIn = false
      delete this._session.user
        
      // Save changes to session
      this._setSessionStore(this._session)
        
      let xhr = new XMLHttpRequest()
      xhr.open("POST", '/auth/signout', true)
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
          // @TODO We aren't checking for success, just completion
          resolve(true)
        }
      }
      xhr.onerror = () => {
        reject(Error('XMLHttpRequest error: Unable to signout'))
      }
      xhr.send("_csrf="+encodeURIComponent(this._session.csrfToken))
    })
  }
  
  // sessionStorage is widely supported, but not always available (for example
  // it can be restricted in private browsing mode). We handle that by just
  // returning an empty session, forcing getSession() to perform an ajax request
  // to get the session info each time it is called.
    _getSessionStore() {
    try {
      return JSON.parse(sessionStorage.getItem('session'))
    } catch (e) {
      return {}
    }
  }
  
  _setSessionStore(session) {
    try {
      sessionStorage.setItem('session', JSON.stringify(session))
      return true
    } catch (e) {
      return false
    }
  }
  
}