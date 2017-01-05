/**
 * The index page uses a layout page that pulls in header and footer components
 */

import Link from 'next/prefetch'
import React from 'react'
import Page from '../layouts/main'

export default() => (
  <Page>
    <p>
      This is a starter <a href="https://zeit.co/blog/next">Next.js 2.0</a> project
      that shows how to put together a simple website with server and client 
      side rendering powered by Next.js, which uses React.
    </p>
    <p>
      Like all Next.js projects it features automatic pre-fetching of templates
      with a ServiceWorker, renders pages both client and server side and live
      reloading in development.
    </p>
    <p>
      This example shows how to use header, footer and layout files, how to
      include CSS and JavaScript on specific pages, how to write code that does 
      asynchronous data fetching (including how to write different routines for
      client and server rendering, if you wish) as well as some more advanced
      usage.
    </p>
    <p>
      It includes new features exclusive to Next.js verion 2.0 like
      integration with the Express framework, which allows you to have custom
      route handling and other endpoints.
    </p>
    <h2>Examples</h2>
    <ul>
      <li><Link href="/helloworld">HelloWorld</Link> - The simplest possible example</li>
      <li><Link href="/css">Page specific styles</Link> - Shows how to include page-specific CSS and JavaScript</li>
      <li><Link href="/async">Async example</Link> - Show how to include data from an API or database</li>
      <li><Link href="/clock">Clock</Link> - A more advanced example from the Zeit wiki </li>
      <li><Link href="/routing/?id=example" as="/route/example">Custom routing</Link> - Custom routing with Express</li>
    </ul>
    <p>
      If you want to see how custom 404, 500 and other HTTP errors are handled take a look at pages/_error.js
    </p>
  </Page>
)