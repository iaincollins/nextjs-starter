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
          .component-scoped-css {
            border: 2px solid red;
            padding: 5px;
          }
        `}</style>
        <h2>CSS &amp; SCSS</h2>
        <p>
          Custom webpack configuration in <a href="https://github.com/iaincollins/nextjs-starter/blob/master/next.config.js">"<strong>next.config.js</strong>"</a> handles loading CSS/SASS from <a href="https://github.com/iaincollins/nextjs-starter/blob/master/css/index.scss">"<strong>css/index.scss</strong>"</a>.
        </p>
        <p>
          The <a href="https://github.com/iaincollins/nextjs-starter/blob/master/css/index.scss">"<strong>index.scss</strong>"</a> file is added to
          the page in <a href="https://github.com/iaincollins/nextjs-starter/blob/master/components/header.js">"<strong>components/header.js</strong>"</a> and imports Boostrap.
        </p>
        <pre>@import "../node_modules/bootstrap/scss/bootstrap.scss";</pre>
        <p>
          Live reloading is supported, meaning any changes saved to CSS are be reflected without a page reload being required.
        </p>
        <p>
          You can also apply inline styles to elements, or use JSX to add component-scoped CSS:
        </p>
        <h4>Inline Style</h4>
        <p style={{border: '2px solid blue', padding: 5}}>
          Example of an inline style.
        </p>
        <h4>Scoped CSS</h4>
        <p>
          Styles defined with JSX in a component only impact elements in the component.
        </p>
        <pre>
{`<style jsx>{\`
  .component-scoped-css {
    border: 2px solid red;
    padding: 5px;
  }
\`}</style>`}
        </pre>
        <p className="component-scoped-css">
          Example of scoped CSS.
        </p>
     </Layout>
    )
  }
}