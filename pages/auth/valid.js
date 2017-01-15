import Link from 'next/prefetch'
import React from 'react'
import Page from '../../layouts/main'
import Session from '../../components/session'

export default class extends React.Component {
  
  render() {
    // Force the client to update locally stored session data by passing 'true'
    // to getSession() to update the local storage
    const session = new Session().getSession(true)
    
    // @TODO Check for redirect path pass in props and redirect to that
    this.props.url.push("/")
    
    return(
      <Page session={session}>
        <div style={{textAlign: "center"}}>
          <p>You are now signed in.</p>
          <p><Link href="/">Continue</Link></p>
        </div>
      </Page>
    )
  }
  
}