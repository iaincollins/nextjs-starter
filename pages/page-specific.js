/**
 * This shows how to add CSS styles and head elements to a specific page
 */
import Head from 'next/head'
import React from 'react'
import Page from '../components/page'
import Layout from '../components/layout'

export default class extends Page {

  render() {
    return (
      <Layout session={this.props.session}>
        <Head>
          <title>This page has a custom title</title>
        </Head>
        <style jsx>{`
          .styled-text {
            background-color: green;
            color: white;
          }
          .styled-text:hover {
            background-color: red;
            color: white;
          }
          @media (min-width: 900px) {
            .styled-text {
              background-color: blue;
              color: white;
            }
          }
        `}</style>
        <h2>Page specific CSS and &lt;head&gt; tags</h2>
        <p>This page has custom elements that are included on on this page and inline CSS.</p>
        <p className="styled-text">This text will change colour if you hover over it or resize the window.</p>
        <p style={{color: 'white', backgroundColor: 'purple'}}>This text is styled using inline styling.</p>
        <p>CSS defined using JSX as in this example <a href="https://github.com/zeit/next.js/#css">scopes the styling to this component</a>.</p>
      </Layout>
    )
  }

}
