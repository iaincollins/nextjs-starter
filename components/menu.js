import Link from 'next/prefetch'
import React from 'react'
import Session from './session'
import Router from 'next/router'

export default class extends React.Component {

  async handleSubmit(event) {
    event.preventDefault()
    const session = new Session()
    await session.signout()
    //Router.push("/")
    // @FIXME Router not working reliably, so reverting back to window.location
    window.location = "/"
  }

  render() {
    const session = this.props.session || null

    let loginMessage = <p></p>
    
    if (session.user) {
      loginMessage =
        <div>
          <form id="signout" method="post" action="/auth/signout" onSubmit={this.handleSubmit}>
            <input name="_csrf" type="hidden" value={session.csrfToken} />
            <span style={{ display: 'inline', marginRight: '10px'  }}>
              <Link href="/"><a><strong>Home</strong></a></Link> | You are logged in as <strong>{session.user.name || session.user.email}</strong>
            </span>
            <button style={{ display: 'inline', padding: '5px 10px' }} type="submit">Logout</button>
          </form>
        </div>
    } else {
      loginMessage = <p><Link href="/"><a><strong>Home</strong></a></Link> | You are not logged in. <Link href="/auth/signin"><a>Sign In</a></Link></p>
    }
    
    return(
      <div>
        {loginMessage}
      </div>
    )
  }
  
}