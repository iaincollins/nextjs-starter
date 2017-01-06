import React from 'react'
import Page from '../../layouts/main'
import 'isomorphic-fetch'

export default class extends React.Component {
  
  static async getInitialProps({ req }) {
    if (typeof window === 'undefined') {
      // Being run on the server
      return { _csrf: req.connection._httpMessage.locals._csrf }
    } else {
      // Being run in a browser
      const res = await fetch('/auth/csrf')
      const data = await res.json()
      return { _csrf: data._csrf }
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
    this.state.email = event.target.value
    this.setState(this.state)
  }
  
  async handleSubmit(event) {
    // Before submitting always make sure we have the latest CSRF token
    const csrfRes = await fetch('/auth/csrf')
    const csrfData = await csrfRes.json()
    this.state._csrf = csrfData._csrf
    this.setState(this.state)
  }

  render() {
    return (
      <Page>
        <form id="signin" method="post" onSubmit={this.handleSubmit}>
          <input name="_csrf" type="hidden" value={this.state._csrf} />
          <h2>Sign In</h2>
          <p>
            <label htmlFor="email">Email address</label><br/>
            <input name="email" type="text" placeholder="j.smith@example.com" id="email" onChange={this.handleChange} />
          </p>
          <p>
            <button type="submit">Sign in</button>
          </p>
        </form>
      </Page>
    )
  }
  
}
