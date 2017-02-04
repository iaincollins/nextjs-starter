import Link from 'next/prefetch'
import React from 'react'
import Page from '../../components/page'
import Layout from '../../components/layout'
import Session from '../../components/session'

export default class extends Page {

  render() {
    // Force the client to update session data by passing 'true' to getSession()
    const session = new Session()
    session.getSession(true)

    // @TODO Check for redirect path pass in props and redirect to that path
    this.props.url.push("/")
    
    return(
      <Layout session={this.props.session}>
        <div style={{textAlign: "center"}}>
          <p>You are now signed in.</p>
          <p><Link href="/"><a>Continue</a></Link></p>
        </div>
      </Layout>
    )
  }
  
}