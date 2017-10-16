import Link from 'next/link'
import React from 'react'
import Page from '../../../components/page'
import Layout from '../../../components/layout'

export default class extends Page {
  render() {
    return (
      <Layout session={this.props.session} navmenu={false}>
        <h1>Unable to sign in</h1>
        <p className="lead">If you have signed up using a different service, use that method to sign in, or sign in with email.</p>
        <p><Link href="/auth/signin"><a className="lead" style={{fontWeight: 'bold'}}>Try signing in with your email address or another service.</a></Link></p>
        <h3 style={{marginTop: '1em', marginBottom: '0.5em'}}>Why can't I sign in?</h3>
        <p>
          An account associated with your email address has already been created. Sign in via email or with the same service you used to create the account.
        </p>
        <p>
          This is a security measure to prevent someone from hijacking your account by signing up for another service using your email address.
        </p>
        <p>
          Once you have signed in and been authenticated, you can link your accounts so you can use any of them to sign in next time.
        </p>
      </Layout>
    )
  }
}
