import React from 'react'
import Page from '../components/page'
import Layout from '../components/layout'

export default class extends Page {
  render() {
    return (
      <Layout session={this.props.session}>
        <h1>Authentication</h1>
        <p>
          The most significant feature of this project is the authentication support.
        </p>
        <p>
          This project uses the <a href="http://passportjs.org/">Passport</a> authentication
          library (the most commonly used authentication library for Node.js) to provide
          support for signing in with accounts on services likes Facebook, Google, Twitter (etc).
          You can also sign-in in via email address, though configuring an email
          server to use for this is strongly recommended.
        </p>
        <h2>Session Database</h2>
        <p>
          Sessions are stored in MongoDB (or an in-memory database if no DB is configured). 
          It's easy to swap out the session storage system for another database
          by changing the session store configuration in <strong>index.js</strong>.
        </p>
        <h2>User Database</h2>
        <p>
          User accounts are created when a user signs in for the first time and
          are stored in a MongoDB (or an in-memory database if no DB is configured).
          User accounts are more tightly integrated into
          the sign-in system in <strong>routes/auth.js</strong> and <strong>routes/passport-strategies.js</strong> so
          changing the type of datastore used for user account sign in is more
          complicated than changing the session store.
        </p>
        <h2>Configuration</h2>
        <p>
          Configuration of oAuth providers for signing is handled by creating a <strong>.env</strong> file in the root of the project.
        </p>
        <h3>Example .env</h3>
        <pre>
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
        </pre>
        <p>
          For tips on configuring authentication see <a href="https://github.com/iaincollins/nextjs-starter/blob/master/AUTHENTICATION.md">AUTHENTICATION.md</a>
        </p>
        <h2>Session and Page Components</h2>
        <p>
          Pages in this project extend from the <strong>Page</strong> component in
          "<strong>components/page.js</strong>", rather than directly
          extending from <strong>React.Component</strong> as most React pages do.
        </p>
        <p>
          The Page component contains some logic in its <strong>getInitialProps()</strong> method
          (which is triggered on page load with Next.js) to populate <strong>this.props.session</strong> with
          the current session object - this approach just saves having to add
          that logic to every page.
        </p>
        <p>
          The Page component itself is very simple:
        </p>
        <pre>
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
        </pre>
        <p>
          This project uses this approach because of how <strong>getInitialProps()</strong> works
          in Next.js. The <strong>getInitialProps()</strong> method is called whenever a
          page is loaded by Next.js but it is ONLY called on the actual page being loaded.
          It is not called on components within a page, so any page that wants
          to access server things like session variables when rendering server
          side needs to read from them in getInitialProps().
        </p>
        <p>
          The actual work of fetching the session data is handled by
          the <strong>Session</strong> component.
        </p>
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
      </Layout>
    )
  }
}