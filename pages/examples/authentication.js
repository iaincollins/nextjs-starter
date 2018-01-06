import SyntaxHighlighter from 'react-syntax-highlighter/prism'
import { atomDark as SyntaxHighlighterTheme } from 'react-syntax-highlighter/styles/prism'
import Page from '../../components/page'
import Layout from '../../components/layout'

export default class extends Page {
  render() {
    return (
      <Layout {...this.props}>
        <h1 className="display-2">Authentication</h1>
        <p>
          This project uses the <a href="http://passportjs.org/">Passport</a> authentication
          library - the most commonly used authentication library for Node.js - to provide
          support for signing in with accounts on services like Facebook, Google, Twitter,
          as well as email based sign in.
        </p>
        <h2>Page Component</h2>
        <p>
          Pages in this project extend from the <strong>Page</strong> component 
          in <a href="https://github.com/iaincollins/nextjs-starter/blob/master/components/page.js">components/page.js</a>.
        </p>
        <p>
          The Page component contains some logic in its <strong>getInitialProps()</strong> method
          (which is triggered on page load with Next.js) to populate <strong>this.props.session</strong> with
          the current session object.
        </p>
        <SyntaxHighlighter style={SyntaxHighlighterTheme} language="javascript">
{`
import React from 'react'
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
          When a page is loaded on the client (via JavaScript in 
          a browser) we can fetch the session state using an AJAX call, but when
          running on the server we get the session state directly from the
          Express session middleware.
        </p>
        <p>
          The approach taken in this project as some complexity to the 
          authentication system, but allows it to support sessions with server
          side rendering and with additional security features such as <strong>Cross Site
          Request Forgery</strong> (CSRF) protection.
        </p>
        <h2>Sessions</h2>
        <p>
          This project uses Express Sessions and stores session state in MongoDB
          (or an in-memory database if no DB is configured). 
          It's easy to swap out the session storage system for another database
          by changing the Session Store configuration in <a href="https://github.com/iaincollins/nextjs-starter/blob/master/index.js">index.js</a>.
        </p>
        <p>
          Loading session data on the client is handled by
          the <a href="https://github.com/iaincollins/nextjs-starter/blob/master/components/session.js">Session</a> class.
        </p>
        <p>
          The Session class inherits session data from Express when invoked on
          for server side rendering. When invoked for client side rendering, it
          fetches them using a REST API authenticated with HTTP Only cookies
          (for security, the session token cannot be read from JavaScript)
          and caches the response with localStorage (if available).
        </p>
        <p>
          Supporting both HTTP Only cookies (to protect against session
          hijacking via XSS) and universal rendering adds extra complexity
          to authentication handling. It is much easier to use something
          like <a href="https://github.com/reactivestack/cookies">univeral-cookie</a> to
          read cookies if they are accessible from JavaScript (i.e. not HTTP Only)
          if you are not as concerned about Cross Site Scripting (XSS) exploits.
        </p>
        <h2>Users</h2>
        <p>
          User accounts are created when a user signs in for the first time and
          are stored in a MongoDB (or an in-memory database if no DB is configured).
        </p>
        <p>
          User accounts are more tightly integrated into
          the sign-in system in <a href="https://github.com/iaincollins/nextjs-starter/blob/master/routes/auth.js">routes/auth.js</a> and <a href="https://github.com/iaincollins/nextjs-starter/blob/master/routes/passport-strategies.js">routes/passport-strategies.js</a> so
          changing the type of datastore used for user account sign in is more
          complicated than changing the session store.
        </p>
        <h2>Configuration</h2>
        <p>
          Configuration is handled by creating a <strong>.env</strong> file in the root of the project.
        </p>
        <h3>Example .env</h3>
        <SyntaxHighlighter style={SyntaxHighlighterTheme} language="bash">
{`SERVER_URL=http://localhost:3000
USER_DB_CONNECTION_STRING=mongodb://localhost:27017/my-database
SESSION_DB_CONNECTION_STRING=mongodb://localhost:27017/my-database
SESSION_SECRET=
LOGS_SECRET=
FACEBOOK_ID=
FACEBOOK_SECRET=
GOOGLE_ID=
GOOGLE_SECRET=
TWITTER_KEY=
TWITTER_SECRET=
EMAIL_ADDRESS=example@gmail.com
EMAIL_SERVER=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USERNAME=example@gmail.com
EMAIL_PASSWORD=`}
        </SyntaxHighlighter>
        <p>
          For tips on configuring authentication see <a href="https://github.com/iaincollins/nextjs-starter/blob/master/AUTHENTICATION.md">AUTHENTICATION.md</a>
        </p>
      </Layout>
    )
  }
}