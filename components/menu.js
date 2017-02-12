/* global window */
import Link from 'next/prefetch'
import React from 'react'
import Session from './session'

export default class extends React.Component {

  static propTypes() {
    return {
      session: React.PropTypes.object.isRequired
    }
  }

  async handleSubmit(event) {
    event.preventDefault()

    const session = new Session()
    await session.signout()

    // @FIXME next/router not working reliably  so using window.location
    window.location = '/'
  }

  render() {
    const session = this.props.session || null

    let loginMessage = <p><Link href="/"><a><strong>Home</strong></a></Link> | You are not logged in. <Link href="/auth/signin"><a>Sign In</a></Link></p>

    if (session.user) {
      loginMessage = (
        <div>
          <form id="signout" method="post" action="/auth/signout" onSubmit={this.handleSubmit}>
            <input name="_csrf" type="hidden" value={session.csrfToken}/>
            <span style={{display: 'inline', marginRight: '10px'}}>
              <Link href="/"><a><strong>Home</strong></a></Link> | You are logged in as <strong>{session.user.name || session.user.email}</strong>
            </span>
            <button style={{display: 'inline', padding: '5px 10px'}} type="submit">Logout</button>
          </form>
        </div>
      )
    }

    return (
      <div>
        {loginMessage}
      </div>
    )
  }

}
