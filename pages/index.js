/**
 * The index page uses a layout page that pulls in header and footer components
 */

import Link from 'next/prefetch'
import React from 'react'
import Page from '../layouts/main'
import Session from '../components/session'

export default class extends React.Component {
  
  static async getInitialProps({ req }) {
    const session = new Session(arguments)
    return {
      session: await session.getSession()
    }
  }

  constructor(props) {
    super(props)
    this.state = props
  }
  
  render() {
    return(
      <Page session={this.props.session}>
        <h2>About this project</h2>
        <p>
          This is a starter <a href="https://zeit.co/blog/next">Next.js 2.0</a> project
          that shows how to put together a simple website with server and client 
          side rendering powered by Next.js, which uses React.
        </p>
        <p>
          Like all Next.js projects it features automatic pre-fetching of templates
          with a ServiceWorker, renders pages both client and server side and live
          reloading in development. It also shows how to use features new in 
          Next.js version 2.0 like integration with the Express and custom route handling.
        </p>
        <p>
          There are practical examples with header, footer and layout files,
          how to add page-specific CSS and JavaScript and header elements,
          how to write code that does asynchronous data fetching (including how
          to write different logic for client and server rendering, as well
          as some more advanced usage, including email based authentication.
        </p>
        <h2>Examples</h2>
        <ul>
          <li><Link href="/helloworld">HelloWorld</Link> - The simplest possible example</li>
          <li><Link href="/page-specific">Page specific styles</Link> - Page specific CSS and &lt;head&gt; tags</li>
          <li><Link href="/async">Async example</Link> - Show how to include data from an API or database</li>
          <li><Link href="/routing/?id=example" as="/route/example">Custom routing</Link> - Custom routing with Express</li>
          <li><Link href="/auth/signin">Authentication</Link> - An email based authentication example</li>
          <li><Link href="/clock">Clock</Link> - A more advanced example from the Zeit wiki </li>
        </ul>
        <p>
          If you want to see how custom 404, 500 and other HTTP errors are handled take a look at pages/_error.js
        </p>
      </Page>
    )
  }
}
