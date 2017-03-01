/**
 * An example with custom routing
 */

import Link from 'next/link'
import React from 'react'
import Page from '../components/page'
import Layout from '../components/layout'

export default class extends Page {

  static async getInitialProps({req, query}) {
    let props = await super.getInitialProps({req})
    props.path = '/route/' + query.id
    return props
  }

  render() {
    return (
      <Layout session={this.props.session}>
        <h2>Custom routing</h2>
        <p>
          You went to <strong>&quot;{ this.props.path }&quot;</strong>
        </p>
        <p>
          Take a look at the source of pages/routing.js and server.js to see how
          to Link can be used with custom routes.
        </p>
        <ul>
          <li><Link href="/routing/?id=example-one" as="/route/example-one"><a>Example One</a></Link></li>
          <li><Link href="/routing/?id=example-two" as="/route/example-two"><a>Example Two</a></Link></li>
        </ul>
      </Layout>
    )
  }

}
