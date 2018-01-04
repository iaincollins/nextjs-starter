import Head from 'next/head'
import React from 'react'
import Page from '../../components/page'
import Layout from '../../components/layout'

export default class extends Page {
  render() {
    return (
      <Layout {...this.props}>
        <Head>
          <title>Layout and Styling</title>
        </Head>
        <h1>Layout and Styling</h1>
        <h2>Pages and Layout</h2>
        <h3>Page Component</h3>
        <p>
          Pages in this project extend from the Page component in
          <strong>./components/page.js</strong>, rather than directly
          extending from <strong>React.Component</strong> as most React pages do.
        </p>
        <p>
          The Page component contains some logic in its <strong>getInitialProps()</strong> method
          (which is triggered on page load with Next.js) to populate <strong>this.props.session</strong> with
          the current session object - this approach just saves having to add
          that logic to every page.
        </p>
        <h3>Layout Component</h3>
        <p>
          Pages in this project inherit common HTML components, such as the 
          top navigation bar, by using the Layout component from 
          <strong>./components/layout.js</strong>, which wraps content with
          common header and footer HTML.
        </p>
        <p>
          The session object (<strong>this.props.session</strong>) is passed
          from the page to the Layout component so the top navigation bar and
          other elements can be rendered correctly, reflecting the current
          session state (i.e. depending on if the user is logged in or not).
        </p>
        <h4>Example page</h4>
        <p>
          An example of a page using the custom page and layout components:
        </p>
        <pre>
{`import React from 'react'
import Page from 'components/page'
import Layout from 'components/layout'

export default class extends Page {
  render() {
    return (
      <Layout session={this.props.session}>
        <h1>My page title</h1>
        <p>Some text</p>
      </Layout>
    )
  }
}`}
        </pre>
        <p>
          A more complex project might call for multiple different layouts or
          to allow options to be passed to the layout component (e.g. 
          <strong>{'<Layout navmenu={false} …>'}</strong> to hide the
          navigation menu).
        </p>
        <h2>Styling with CSS/SCSS</h2>
        <style jsx>{`
          .component-scoped-css {
            border: 2px solid red;
            padding: 5px;
          }
        `}</style>
        <p>
          The file <a href="https://github.com/iaincollins/nextjs-starter/blob/master/css/index.scss"><strong>index.scss</strong></a> imports Bootstrap and is added to
          the page in <a href="https://github.com/iaincollins/nextjs-starter/blob/master/components/header.js"><strong>components/header.js</strong></a>.
        </p>
        <p>
          Webpack configuration directives in <a href="https://github.com/iaincollins/nextjs-starter/blob/master/next.config.js"><strong>next.config.js</strong></a> handle
          loading it as CSS/SASS, meaning you can use variables and other features of SASS.
        </p>
        <p>
          In development mode, changs to CSS are live reloaded, meaning any changes are applied without a page reload being required.
        </p>

        <h3>Inline Styling and Scoped CSS with JSX</h3>
        <p>
          You can also apply inline styles to elements, or use JSX to add component-scoped CSS.
        </p>
        <h4>Inline Style</h4>
        <p>
          Inline styles are styles applied directly to an element. They can even reference JavaScript variables.
        </p>
        <pre>
{`<p style={{border: '2px solid blue', padding: 5}}>
  Example of an inline style.
</p>`}
        </pre>
        <p style={{border: '2px solid blue', padding: 5}}>
          Example of an inline style.
        </p>
        <h4>Scoped CSS</h4>
        <p>
          Styles defined with JSX in a component only impact elements in the component, meaning any CSS/SCSS rules will not impact how components on the same page appear.
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