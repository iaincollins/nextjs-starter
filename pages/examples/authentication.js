import SyntaxHighlighter from 'react-syntax-highlighter/prism'
import { atomDark as SyntaxHighlighterTheme } from 'react-syntax-highlighter/styles/prism'
import Page from '../../components/page'
import Layout from '../../components/layout'

export default class extends Page {
  render() {
    return (
      <Layout {...this.props}>
        <h1 className="display-2">Authentication</h1>
        <p className="lead">
          Authentication in this project is handled by the <a href="https://www.npmjs.com/package/next-auth">NextAuth</a> library.
        </p>
        <p>
          The NextAuth library uses Express and <a href="http://passportjs.org/">Passport</a>,
          the most commonly used authentication library for Node.js, to provide
          support for signing in with email and with services like Facebook, Google and Twitter.
        </p>
        <p>
          NextAuth adds Cross Site Request Forgery (CSRF) tokens and HTTP Only cookies,
          supports univeral rendering and does not require client side JavaScript.
        </p>
        <p>          
          It adds session support without using client side accessible session tokens,
          providing protection against Cross Site Scripting (XSS) and session hijacking,
          while leveraging localStorage where available to cache non-critical session state
          for optimal performance in Single Page Apps.
        </p>
        <p>
          The <a href="https://www.npmjs.com/package/next-auth">NextAuthClient</a> for
          NextAuth is designed for React pages powered by Next.js.
        </p>
        <p className="text-muted font-italic">
          * The code for NextAuth was from this project but now
          exists as module to make it easier to use in other projects.
        </p>
        <h2>Configuration</h2>
        <p>
          Basic configuration of this project is handled by creating a <span className="font-weight-bold">.env</span> file in the root of the project.
        </p>
        <h3>Example .env</h3>
        <SyntaxHighlighter style={SyntaxHighlighterTheme} language="bash" className="mb-3">
{`SERVER_URL=http://localhost:3000
MONGO_URI=mongodb://localhost:27017/my-database
FACEBOOK_ID=
FACEBOOK_SECRET=
GOOGLE_ID=
GOOGLE_SECRET=
TWITTER_KEY=
TWITTER_SECRET=
EMAIL_FROM=username@gmail.com
EMAIL_SERVER=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USERNAME=username@gmail.com
EMAIL_PASSWORD=`}
        </SyntaxHighlighter>
        <h3>Configuration Files</h3>
        <p>
          Configuration of NextAuth in this project is split across three files to make it easier to understand and manage.
        </p>
        <ul>
          <li>
            <a href="https://github.com/iaincollins/nextjs-starter/blob/master/next-auth.config.js"><h4>next-auth.config.js</h4></a>
            <p>
              Basic configuration of NextAuth is handled in <span className="font-weight-bold">next-auth.config.js</span>
            </p>
            <p>
              It is where the <span className="font-weight-bold">next-auth.functions.js</span> and <span className="font-weight-bold">next-auth.providers.js</span> files are loaded.
            </p>
          </li>
          <li>
            <a href="https://github.com/iaincollins/nextjs-starter/blob/master/next-auth.functions.js"><h4>next-auth.functions.js</h4></a>
            <p>
              <span className="font-weight-bold">next-auth.functions.js</span> defines functions for user management and sending email.
            </p>
            <h5>find(<span className="text-muted font-italic">{`{ id, email, emailToken, provider: { name, id } }`}</span>)</h5>
            <h5>insert(<span className="text-muted font-italic">user</span>)</h5>
            <h5>update(<span className="text-muted font-italic">user</span>)</h5>
            <h5>remove(<span className="text-muted font-italic">user</span>)</h5>
            <h5>serialize(<span className="text-muted font-italic">user</span>)</h5>
            <h5>deserialize(<span className="text-muted font-italic">id</span>)</h5>
            <h5>sendSignInEmail(<span className="text-muted font-italic">{`{ email, link }`}</span>)</h5>
            <p>
              The example included with this project has methods designed for Mongo DB,
              but you can edit these methods to use it any database (including relational databases using SQL) without having to edit
              any other code in the project.
            </p>
          </li>
          <li>
            <a href="https://github.com/iaincollins/nextjs-starter/blob/master/next-auth.providers.js"><h4>next-auth.providers.js</h4></a>
            <p>
              <span className="font-weight-bold">next-auth.providers.js</span> defines a list of supported oAuth providers.
            </p>
            <p>
              It includes configuration examples for Facebook, Google and Twitter
              oAuth, which can easily be copied and replicated to add support
              for signing in other oAuth providers. For tips on configuring 
              oAuth see <a href="https://github.com/iaincollins/nextjs-starter/blob/master/AUTHENTICATION.md">AUTHENTICATION.md</a>
            </p>
          </li>
        </ul>
        <h2>Using NextAuth in Pages</h2>
        <p>
          Pages in this project extend from the <span className="font-weight-bold">Page</span> component 
          in <a href="https://github.com/iaincollins/nextjs-starter/blob/master/components/page.js">components/page.js</a>.
        </p>
        <p>
          The Page component contains some logic <span className="font-weight-bold">getInitialProps()</span>, which is a special method triggered on page load with Next.js, to populate <span className="font-weight-bold">this.props.session</span> with
          the current session state.
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
          When a page is loaded by client side logic, NextAuth fetches the
          session state using an AJAX call.
        </p>
        <p>
          When a page is Server Side Rendered, NextAuth loads the session state
          from Express Session by parsing the <span className="font-weight-bold">req</span> object.
        </p>
        <p>
          If a user is signed in <span className="font-weight-bold">this.session.user</span> will contain 
          a user object. If they are not logged in, it will not be set.
        </p>
        <p>
          To improve rendering performance, NextAuth will attempt to cache
          the session state (but not the actual session token) in localStorage
          when available, to avoid a render-blocking AJAX call to fetch session
          state every time a page is loaded.
        </p>
        <p>
           This can be disabled by setting <span className="font-weight-bold">sessionRevalidateAge</span> to 0 in <span className="font-weight-bold">next-auth.functions.js</span> (the default value is 60 seconds).
        </p>
      </Layout>
    )
  }
}