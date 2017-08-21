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
        <h3>Live reloading in development</h3>
        <p>
          In development mode, CSS is imported in <a href="https://github.com/iaincollins/nextjs-starter/blob/master/components/header.js">components/header.js</a> with "<strong>import stylesheet from &#39;../css/main.scss&#39;</strong>".
        </p>
        <p>
          This behaviour is enabled through the webpack configuration in <a href="https://github.com/iaincollins/nextjs-starter/blob/master/next.config.js">next.config.js</a> (by <a href="https://github.com/davibe/next.js-css-global-style-test">Davide Bertola</a>).
        </p>
        <h3>CSS caching in production</h3>
        <p>
          When running in production mode, SCSS is pre-parsed and compressed by 'node-sass' at startup then cached in memory and served via a route at
          "<strong>/assets/{'{version}'}/main.css</strong>", which is defined in <a href="https://github.com/iaincollins/nextjs-starter/blob/master/index.js">index.js</a>.
        </p>
        <p>The version string is derived from the version value in <a href="https://github.com/iaincollins/nextjs-starter/blob/master/package.json">package.json</a>,
          which should be incremented when deploying CSS changes to production. Ideally this might be automatically derived from the Next.js BUILD_ID but it's not accessible at run time.
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
