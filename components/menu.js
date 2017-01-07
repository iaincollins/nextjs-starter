import Link from 'next/prefetch'
import React from 'react'
import Session from './session'

export default class extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      session: props.session || null
    }
  }

  async handleSubmit(event) {
    event.preventDefault()
    const session = new Session()
    await session.signout()
    // Redirect to homepage as we can't access the page's props.url from here
    // NB: You could export it to this component from the page as the session is
    window.location = "/"
  }

  render() {
    const session = this.state.session || null
    
    let loginMessage = <p></p>
    
    if (session !== null) {
      if (session.isLoggedIn === true) {
        loginMessage = <div>
            <form id="signout" method="post" action="/auth/signout" onSubmit={this.handleSubmit}>
              <input name="_csrf" type="hidden" value={this.state.session.csrfToken} />
              <span style={{ display: 'inline', marginRight: '10px'  }}>
                You are logged in as <strong>{session.user.name || session.user.email}</strong>
              </span>
              <button style={{ display: 'inline', padding: '5px 10px' }} type="submit">Logout</button>
            </form>
          </div>
      } else if (session.isLoggedIn === false) {
        loginMessage = <p>You are not logged in | <Link href="/auth/signin">Sign In</Link></p>
      }
    }
    
    return(
      <div>
        {loginMessage}
      </div>
    )
  }
}