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
        <h2>CSS, SCSS and &lt;head&gt; tags</h2>
        <h3>CSS &amp; SCSS Live Reloading</h3>
        <p>
          SCSS is this project is imported in <strong>components/header.js</strong> with &quot;<i>import stylesheet from &#39;../css/main.scss&#39;</i>&quot;.
        </p>
        <p>
          This behaviour is enabled through the additional webpack configuration in <strong>next.config.js</strong>.
        </p>
        <p>
          For more details see <a href="https://github.com/davibe/next.js-css-global-style-test">https://github.com/davibe/next.js-css-global-style-test</a>.
        </p>
        <h3>Inline CSS</h3>
        <p>This page also has custom elements that are included on on this page as inline CSS.</p>
        <p className="styled-text">This text will change colour if you hover over it or resize the window.</p>
        <p style={{color: 'white', backgroundColor: 'purple'}}>This text is styled using inline styling.</p>
        <p>CSS defined using JSX as in this example <a href="https://github.com/zeit/next.js/#css">scopes the styling to this component</a>.</p>
      </Layout>
    )
  }

}
