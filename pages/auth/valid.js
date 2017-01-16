import Link from 'next/prefetch'
import React from 'react'
import Page from '../../layouts/main'
import Session from '../../components/session'

export default class extends React.Component {

  static async getInitialProps({ req }) {
    const session = new Session(arguments)
    // Force the client to update locally stored session data by passing 'true'
    // to getSession() to update the local storage
    return {
      session: await session.getSession(true)
    }
  }


  render() {
    
    // Save session (synchronously) so localStorage on client is updated
    const session = new Session()
    session.setSession(this.props.session)

    // @TODO Check for redirect path pass in props and redirect to that
    this.props.url.push("/")
    
    return(
      <Page session={this.props.session}>
        <div style={{textAlign: "center"}}>
          <p>You are now signed in.</p>
          <p><Link href="/">Continue</Link></p>
        </div>
      </Page>
    )
  }
  
}