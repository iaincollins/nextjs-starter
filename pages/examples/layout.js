import SyntaxHighlighter from 'react-syntax-highlighter/prism'
import { atomDark as SyntaxHighlighterTheme } from 'react-syntax-highlighter/styles/prism'
import Page from '../../components/page'
import Layout from '../../components/layout'

export default class extends Page {
  render() {
    return (
      <Layout {...this.props} title="Layout and Styling">
        <h1 className="display-2">Layout</h1>
        <p className="lead">
         This project uses both a custom Page class and a Layout component.
        </p>
        <h2 className="mt-3">Page Class</h2>
        <p>
          Most Pages in this project extend from the Page class 
          in <a href="https://github.com/iaincollins/nextjs-starter/blob/master/components/page.js">components/page.js</a>,
          which extends from <span className="font-weight-bold">React.Component</span>.
        </p>
        <SyntaxHighlighter style={SyntaxHighlighterTheme} language="javascript">
{`import React from 'react'
import { NextAuth } from 'next-auth/client'

export default class extends React.Component {
  static async getInitialProps({req}) {
    return {
      session: await NextAuth.init({req}) // Populate 'this.props.session'
    }
  }
}`}
        </SyntaxHighlighter>
        <p>
          The Page class contains logic in its <span className="font-weight-bold">getInitialProps()</span> method
          to populate <span className="font-weight-bold">this.props.session</span> with
          the current session info. Extending pages from the Page class
          saves having to add the same logic to every page.
        </p>
        <p>
          The <span className="font-weight-bold">getInitialProps()</span> method is specific to Next.js
          and is only called on the page being loaded. It is not called on
          child components within a page, so if components should render
          correctly with Server Side Rendering, you must fetch the data they
          need in the page they are in and pass data to those components as
          props.
        </p>
        <p>
          <span className="font-weight-bold">getInitialProps()</span> is called
          either client or server side, depending on how the page is being
          rendered. When rendered server side, additional properties such 
          as <span className="font-weight-bold">req</span> and <span className="font-weight-bold">res</span> are
          acessible from it.
        </p>
        <h2 className="mt-2">Layout Component</h2>
        <p>
          Pages in this project inherit common HTML components, such as the 
          top navigation bar, by using the Layout component from  <a href="https://github.com/iaincollins/nextjs-starter/blob/master/components/layout.js">components/layout.js</a> which
          wraps content with common HTML such as the navbar and footer.
        </p>
        <p>
          Props - such as the session object - are passed from the page to
          layout component so the navbar and other elements can be rendered
          correctly, reflecting the current session state (e.g. and render
          a nav bar options, depending on if the user is signed in or not).
        </p>
        <h2 className="mt-2">Example Usage</h2>
        <SyntaxHighlighter style={SyntaxHighlighterTheme} language="javascript">
{`import React from 'react'
import Page from '../components/page'
import Layout from '../components/layout'

export default class extends Page {
  render() {
    return (
      <Layout {...this.props} title="My page title">
        <h1>My page name</h1>
        <p>Some text</p>
      </Layout>
    )
  }
}`}
        </SyntaxHighlighter>
     </Layout>
    )
  }
}