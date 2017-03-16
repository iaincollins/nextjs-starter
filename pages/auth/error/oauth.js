import Link from 'next/link'
import React from 'react'
import Page from '../../../components/page'
import Layout from '../../../components/layout'

export default class extends Page {
  render() {
    return (
      <Layout session={this.props.session}>
        <h2>Unable to sign in</h2>
        <p>If you have already signed in with your email address or previously signed in using a different service, use that method to sign in.</p>
        <p><Link href="/auth/signin"><a>Try signing in with your email address or another service.</a></Link></p>
        <h3>Why can&#39;t I sign in?</h3>
        <p>You can&#39;t sign in with an account if you have previously signed in using your email address or another service that also tied to your email address.
          This is a security measure to prevent someone from hijacking your account by signing up for another service using your email address.
        </p>
        <p>
          Once you have signed in and been authenticated, you can link your accounts so you can use any of them to sign in next time.
        </p>
      </Layout>
    )
  }
}
