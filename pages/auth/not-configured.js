import Link from 'next/link'
import React from 'react'
import Page from '../../components/page'
import Layout from '../../components/layout'

export default class extends Page {
  render() {
    return (
      <Layout session={this.props.session}>
        <h2>Not configured</h2>
        <p>This oAuth provider has not been configured.</p>
        <p><Link href="/auth/signin"><a>Sign in via email</a></Link></p>
      </Layout>
    )
  }
}
