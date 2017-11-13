import Link from 'next/link'
import React from 'react'
import Page from '../../../components/page'
import Layout from '../../../components/layout'

export default class extends Page {
  render() {
    return (
      <Layout session={this.props.session} navmenu={false}>
        <h2>Support for this oAuth service is not configured</h2>
        <p>Support for the requested oAuth provider has not been configured.</p>
        <p><Link href="/auth/signin"><a style={{fontWeight: 600}}>Go to the Sign in page.</a></Link></p>
      </Layout>
    )
  }
}
