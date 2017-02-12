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

    let loginMessage = <p><Link href="/"><a className="home">Home</a></Link> You are not logged in. <Link href="/auth/signin"><a>Sign in</a></Link></p>

    if (session.user) {
      loginMessage = (
        <form id="signout" method="post" action="/auth/signout" onSubmit={this.handleSubmit}>
          <input name="_csrf" type="hidden" value={session.csrfToken}/>
          <p>
            <Link href="/"><a className="home">Home</a></Link>Logged in as <strong>{session.user.name || session.user.email}</strong>
            <button type="submit">Sign out</button>
          </p>
        </form>
      )
    }

    return (
      <div className="menubar">
        {loginMessage}
      </div>
    )
  }

}
