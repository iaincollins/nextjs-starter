/**
 * This shows how to add CSS styles and head elements to a specific page
 */

import Head from 'next/head'
import css from 'next/css'
import React from 'react'
import Page from '../layouts/main'

export default() => (
  <Page>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>This page has a custom title</title>
    </Head>
    <h2>Page specific CSS and &lt;head&gt; tags</h2>
    <p>This is a mobile-ready page with inline CSS.</p>
    <p className={style}>This text will change colour if you hover over it or resize the window.</p>
  </Page>
)

const style = css({
  color: 'blue',
  ':hover': {
    color: 'red'
  },
  '@media (max-width: 1000px)': {
    color: 'green'
  }
})