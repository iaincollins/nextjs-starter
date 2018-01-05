import SyntaxHighlighter from 'react-syntax-highlighter/prism'
import { atomDark as SyntaxHighlighterTheme } from 'react-syntax-highlighter/styles/prism'
import Page from '../../components/page'
import Layout from '../../components/layout'

export default class extends Page {
  render() {
    return (
      <Layout {...this.props} title="Layout and Styling">
        <h1 className="display-2">Layout</h1>
        <h2 className="display-4">Page Component</h2>
        <p>
          Most Pages in this project extend from the Page component 
          in <strong>./components/page.js</strong>, which extends
          from <strong>React.Component</strong>.
        </p>
        <p>
          The Page component contains logic in its <strong>getInitialProps()</strong> method
          to populate <strong>this.props.session</strong> with
          the current session object. Extending pages from the Page component
          saves having to add the same logic to every page.
        </p>
        <p>
          The <strong>getInitialProps()</strong> method is specific to Next.js
          and is only called on the page being loaded. It is not called on
          components within a page. It is called either client or server side, 
          depending on where the page is being rendered. 
        </p>
        <h2 className="display-4">Layout Component</h2>
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
        <h2 className="display-4">Example page</h2>
        <p>
          An example of a page using the custom page and layout components:
        </p>
        <SyntaxHighlighter style={SyntaxHighlighterTheme} language="javascript">
{`import React from 'react'
import Page from 'components/page'
import Layout from 'components/layout'

export default class extends Page {
  render() {
    return (
      <Layout {...this.props}>
        <h1>My page title</h1>
        <p>Some text</p>
      </Layout>
    )
  }
}`}
        </SyntaxHighlighter>
        <p>
          A more complex project might call for multiple different layouts or
          to allow options to be passed to the layout component.
        </p>
     </Layout>
    )
  }
}