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
          The NextAuth library uses Express and <a href="http://passportjs.org/">Passport</a> library,
          the most commonly used authentication library for Node.js, to provide
          support for signing in with email and with services like Facebook, Google and Twitter.
        </p>
        <p>
          NextAuth adds Cross Site Request Forgery (CSRF) tokens and HTTP Only cookies,
          supports univeral rendering and does not require client side JavaScript.
          It adds session support without using client side accessible session tokens,
          providing protection against Cross Site Scripting (XSS) and session hijacking.
        </p>
        <p>
          The NextAuthClient library for Next Auth is designed to work with
          Next.js React pages to interact with sessions.
        </p>
        <p>
          The code for NextAuth was originally part of this project but now
          exists as seperate module to make it easier to reuse.
        </p>
        <h2>Configuration</h2>
        <p>
          Basic configuration of this project is handled by creating a <strong>.env</strong> file in the root of the project.
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
EMAIL_ADDRESS=username@gmail.com
EMAIL_SERVER=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USERNAME=username@gmail.com
EMAIL_PASSWORD=`}
        </SyntaxHighlighter>
        <h3>Configuration files</h3>
        <p>
          Configuration of NextAuth in this project is split across three files to make it easier to understand and manage.
        </p>
        <ul>
          <li>
            <a href="https://github.com/iaincollins/nextjs-starter/blob/master/next-auth.config.js"><h5>next-auth.config.js</h5></a>
            <p>
              Basic configuration of NextAuth is handled in <strong>next-auth.config.js</strong>
            </p>
            <p>
              It is where the <strong>next-auth.functions.js</strong> and <strong>next-auth.providers.js</strong> files are loaded.
            </p>
          </li>
          <li>
            <a href="https://github.com/iaincollins/nextjs-starter/blob/master/next-auth.functions.js"><h5>next-auth.functions.js</h5></a>
            <p>
              <strong>next-auth.functions.js</strong> defines functions for user management and sending email.
            </p>
            <ul className="mb-3">
              <li>find({`{}`}) <span className="text-muted">{`// Look up a user.`}</span></li>
              <li>insert(user) <span className="text-muted">{`// Create a user.`}</span></li>
              <li>update(user) <span className="text-muted">{`// Update a user.`}</span></li>
              <li>remove(id) <span className="text-muted">{`// Delete a user.`}</span></li>
              <li>serialize(user) <span className="text-muted">{`// Turn a user object into an ID.`}</span></li>
              <li>deserialize(id) <span className="text-muted">{`// Turn an ID into a user object.`}</span></li>
              <li>sendSignInEmail(email, link) <span className="text-muted">{`// Email sign in link to user.`}</span></li>
            </ul>
            <p>
              All database interaction is defined here. The current configuration file has methods designed for a MongoDB database,
              but you can edit these methods to with any database (including relational databases using SQL) without having to edit
              any other code in the project.
            </p>
          </li>
          <li>
            <a href="https://github.com/iaincollins/nextjs-starter/blob/master/next-auth.providers.js"><h5>next-auth.providers.js</h5></a>
            <p>
              <strong>next-auth.providers.js</strong> defines a list of supported oAuth providers.
            </p>
            <p>
              It includes configuration examples for Facebook, Google and Twitter
              oAuth, which can easily be copied and replicated to add support
              for signing in other oAuth providers.
            </p>
            <p>
              For tips on configuring authentication see <a href="https://github.com/iaincollins/nextjs-starter/blob/master/AUTHENTICATION.md">AUTHENTICATION.md</a>
            </p>
          </li>
        </ul>
        <h2>NextAuth in Pages</h2>
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
{`import React from 'react'
import { NextAuth } from 'next-auth-client'

export default class extends React.Component {
  static async getInitialProps({req}) {
    return {
      session: await NextAuth.init({req}) // Populate 'this.props.session'
    }
  }
}`}
        </SyntaxHighlighter>
        <p>
          When a page is loaded on the client - via JavaScript in 
          a browser - NextAuth fetches the session state using an AJAX call, but when
          running on the server it loads the session state directly from
          Express Session using the <strong>req</strong> object.
        </p>
        <p>
          If a user is signed in <strong>this.session.user</strong> will contain 
          a user object. If they are not logged in, it will not be set.
        </p>
      </Layout>
    )
  }
}