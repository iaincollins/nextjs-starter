import React from 'react'
import Page from '../../layouts/main'

export default class extends React.Component {
  
  static async getInitialProps({ req }) {
    if (typeof window === 'undefined') {
      // Being run on the server
      return { _csrf: req.connection._httpMessage.locals._csrf }
    } else {
      // Being run in the browser (will get CSRF token before submitting)
      return { _csrf: '' }
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      _csrf: props._csrf,
      email: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleEmailChange = this.handleEmailChange.bind(this)
  }

  handleEmailChange(event) {
    this.state.email = event.target.value.trim()
    this.setState(this.state)
  }
  
  handleSubmit(event) {
    event.preventDefault()

    // @TODO Highlight email field if left blank
    if (this.state.email.trim() == '')
      return false

    const _this = this

    // Note: We use XMLHttpRequest here rather than fetch because fetch uses
    // Service Workers and they cannot share cookies with the browser session
    // yet (!) so if we tried to get or pass the CSRF token it would mismatch.

    // Check we have the latest CSRF token before submitting the form
    var xhr = new XMLHttpRequest()
    xhr.open("GET", '/auth/csrf')
    xhr.onreadystatechange = function() {
      
      if (xhr.readyState == 4 && xhr.status == 200) {
        const jsonResponse = JSON.parse(xhr.responseText);

        _this.state._csrf = jsonResponse._csrf
        _this.setState(_this.state)
  
        // Submit the form
        xhr = new XMLHttpRequest()
        xhr.open("POST", '/auth/signin', true)
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4 && xhr.status == 200)
            _this.props.url.push("/auth/check-email")
        }
        xhr.send("_csrf="+encodeURIComponent(_this.state._csrf)+"&"
                 +"email="+encodeURIComponent(_this.state.email))
      }
    
    }
    xhr.send()
  }

  render() {
    return (
      <Page>
        <form id="signin" method="post" onSubmit={this.handleSubmit}>
          <input name="_csrf" type="hidden" value={this.state._csrf} />
          <h2>Sign In</h2>
          <p>
            <label htmlFor="email">Email address</label><br/>
            <input name="email" type="text" placeholder="j.smith@example.com" id="email" value={this.state.email} onChange={this.handleEmailChange} />
          </p>
          <p>
            <button type="submit">Sign in</button>
          </p>
        </form>
      </Page>
    )
  }
  
}