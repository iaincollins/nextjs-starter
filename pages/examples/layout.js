import SyntaxHighlighter from 'react-syntax-highlighter/prism'
import { atomDark as SyntaxHighlighterTheme } from 'react-syntax-highlighter/styles/prism'
import Page from '../../components/page'
import Layout from '../../components/layout'

export default class extends Page {
  render() {
    return (
      <Layout {...this.props} title="Layout and Styling">
        <h1 className="display-2">Layout</h1>
        <p>
         This project uses both a custom Page class (extended from <strong>React.Component</strong>) and layout component.
        </p>
        <SyntaxHighlighter style={SyntaxHighlighterTheme} language="javascript">
{`import React from 'react'
import Page from 'components/page'
import Layout from 'components/layout'

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
        <h2 className="mt-5">Page Component</h2>
        <p>
          Most Pages in this project extend from the Page component 
          in <a href="https://github.com/iaincollins/nextjs-starter/blob/master/components/page.js">components/page.js</a>,
          which extends from the <strong>React.Component</strong> class.
        </p>
        <SyntaxHighlighter style={SyntaxHighlighterTheme} language="javascript">
{`import React from 'react'
  import Session from './session'

  export default class extends React.Component {
    // Expose session to all pages
    static async getInitialProps({req}) {
      return {
        session: await Session.getSession({req: req})
      }
    }
}`}
        </SyntaxHighlighter>
        <p>
          The Page component contains logic in its <strong>getInitialProps()</strong> method
          to populate <strong>this.props.session</strong> with
          the current session object. Extending pages from the Page component
          saves having to add the same logic to every page.
        </p>
        <p>
          The <strong>getInitialProps()</strong> method is specific to Next.js
          and is only called on the page being loaded. It is not called on
          child components within a page. It is called either client or server side, 
          depending on where the page is being rendered. 
        </p>
        <h2 className="mt-5">Layout Component</h2>
        <p>
          Pages in this project inherit common HTML components, such as the 
          top navigation bar, by using the Layout component from  <a href="https://github.com/iaincollins/nextjs-starter/blob/master/components/layout.js">components/layout.js</a> which
          wraps content with common HTML such as the navbar and footer.
        </p>
        <p>
          Page props - including session object - is passed from the page to
          layout component so the navbar and other elements can be rendered
          correctly, reflecting the current session state (i.e. depending on if
          the user is logged in or not).
        </p>
     </Layout>
    )
  }
}