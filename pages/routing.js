/**
 * An example with custom routing
 */

import Link from 'next/prefetch'
import React from 'react'
import Page from '../layouts/main'
import Session from '../components/session'

export default class extends React.Component {
  
  static async getInitialProps({ query }) {
    const session = new Session(arguments)
    return { 
      session: await session.getSession(),
      path: query.id
    }
  }

  render() {
    return (
      <Page session={this.props.session}>
        <h2>Custom routing</h2>
        <p>
          You went to <strong>"/route/{ this.props.path }"</strong>
        </p>
        <p>
          Take a look at the source of pages/routing.js and server.js to see how
          to Link can be used with custom routes.
        </p>
        <ul>
          <li><Link href="/routing/?id=example-one" as="/route/example-one">Example One</Link></li>
          <li><Link href="/routing/?id=example-two" as="/route/example-two">Example Two</Link></li>
        </ul>
      </Page>
    )
  }
}