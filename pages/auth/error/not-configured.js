import Link from 'next/link'
import React from 'react'
import Page from '../../../components/page'
import Layout from '../../../components/layout'

export default class extends Page {
  render() {
    return (
      <Layout session={this.props.session} navmenu={false}>
        <div className="text-center pt-5 pb-5">
          <h1 className="display-4 mb-5">Service not configured</h1>
          <p className="lead">Support for the requested oAuth service has not been configured.</p>
          <p className="lead"><Link href="/auth/signin"><a>Use another method to sign in.</a></Link></p>
        </div>
      </Layout>
    )
  }
}
