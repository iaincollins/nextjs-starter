/**
 * The index page uses a layout page that pulls in header and footer components
 */

import React from 'react'
import Page from '../layouts/main'
import Link from 'next/link'

export default() => (
  <Page>
    <p>
      This is a starter <a href="https://zeit.co/blog/next">Next.js</a> project
      that shows how to put together a simple website with server and client 
      side rendering powered by Next.js, which uses React.
    </p>
    <p>
      It provides an example with header, footer and layout files, shows how to
      include CSS and JavaScript on specific pages, how to write code that does 
      asynchronous data fetching (including how to write different routines for
      client and server rendering, if you wish) as well as some more advanced
      usage.
    </p>
    <p>
      Like all Next.js projects it features automatic pre-fetching of templates
      with a ServiceWorker, renders pages both client and server side and live
      reloading in development.
    </p>
    <h3>Examples</h3>
    <ul>
      <li><Link href="/helloworld">HelloWorld</Link> - The simplest possible example</li>
      <li><Link href="/css">Page specific styles</Link> - Shows how to include page-specific CSS and JavaScript</li>
      <li><Link href="/async">Async example</Link> - Show how to include data from an API or database</li>
      <li><Link href="/clock">Clock</Link> - A more advanced example from the Zeit wiki </li>
    </ul>
    <p>
      If you want to see how custom 404, 500 and other HTTP errors are handled check out _error.js
    </p>
  </Page>
)