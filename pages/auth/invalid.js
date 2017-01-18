import Link from 'next/prefetch'
import React from 'react'
import Page from '../../components/page'
import Layout from '../../components/layout'

export default class extends Page {
  render() {
    return (
      <Layout session={this.props.session}>
        <h2>Link expired</h2>
        <p>The link you tried to use to sign in is no longer valid.</p>
        <p><Link href="/auth/signin">Request a new one to signin.</Link></p>
      </Layout>
    )
  }
}