import React from 'react'
import { Row, Col } from 'reactstrap'
import Page from '../../components/page'
import Layout from '../../components/layout'
import Session from '../../components/session'
import Signin from '../../components/signin'

export default class extends Page {

  static async getInitialProps({req}) {
    // On the sign in page we always force get the latest session data from the
    // server by passing 'force: true' to getSession to force cache busting.
    //
    // This page is the destination page after logging or linking/unlinking 
    // accounts which helps avoid any weird edge cases.
    return {
      session: await Session.getSession({force: true, req: req})
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      session: this.props.session
    }
  }

  async componentDidMount() {
    // Get latest session data after rendering on client
    // Any page specified as an oauth/signin callback page should do this
    this.setState({
      session: await Session.getSession({force: true})
    })
  }

  render() {
    let linkWithFacebook = <p><a className="btn btn-secondary btn-facebook" href="/auth/oauth/facebook">Link with Facebook</a></p>
    let linkWithGoogle = <p><a className="btn btn-secondary btn-google" href="/auth/oauth/google">Link with Google</a></p>
    let linkWithTwitter = <p><a className="btn btn-secondary btn-twitter" href="/auth/oauth/twitter">Link with Twitter</a></p>

    if (this.state.session.user) {
      if (this.state.session.user.facebook) {
        linkWithFacebook = <form action="/auth/oauth/facebook/unlink" method="post"><input name="_csrf" type="hidden" value={this.state.session.csrfToken}/><button className="btn btn-danger" type="submit">Unlink from Facebook</button></form>
      }

      if (this.state.session.user.google) {
        linkWithGoogle = <form action="/auth/oauth/google/unlink" method="post"><input name="_csrf" type="hidden" value={this.state.session.csrfToken}/><button className="btn btn-danger" type="submit">Unlink from Google</button></form>
      }

      if (this.state.session.user.twitter) {
        linkWithTwitter = <form action="/auth/oauth/twitter/unlink" method="post"><input name="_csrf" type="hidden" value={this.state.session.csrfToken}/><button className="btn btn-danger" type="submit">Unlink from Twitter</button></form>
      }
    }

    return (
      <Layout session={this.state.session}>
        <h2>Sign up / Sign in</h2>
        {/*
        <h3>You are signed in</h3>
        <p>Name: <strong>{this.state.session.user.name}</strong></p>
        <p>Email address: <strong>{(this.state.session.user.email.match(/.*@localhost\.localdomain$/)) ? 'N/A' : this.state.session.user.email}</strong></p>
        <p>Email verified: <strong>{(this.state.session.user.verified) ? 'Yes' : 'No'}</strong></p>
        <p>You can link your account to your other accounts so you can sign in with them too.</p>
        {linkWithFacebook}
        {linkWithGoogle}
        {linkWithTwitter}
        <p>
          <i>
            Note: When signed in you should be able to change your name and email address and delete your account
            but those features aren&#39;t implemented in this example project. If you sign in with a service that
            doesn&#39;t provide  an email address (like Twitter) you will be assigned a placeholder email address
            (e.g. twitter-15403657@localhost.localdomain) until you supply a real one. Email addresses can be
            verified by signing in with them (the verified status should reset to false if the email address is changed).
          </i>
        </p>
        */}
        <Row>
          <Col lg="8" className="mr-auto ml-auto" style={{marginBottom: 20}}>
            <Signin session={this.state.session}/>
          </Col>
        </Row>
        <h3>About the authentication system</h3>
        <p>
          This project includes a passwordless, email based authentication system, that uses
          one time use tokens sent out as links via email. This is similar to the authentication
          system use by services like <a href="https://www.slack.com">Slack</a>. It ensures people have provided a valid email address and avoids the need to store passwords.
        </p>
        <p>
          This project also uses the <a href="https://www.npmjs.com/package/passport">Passport</a> library to allow people to sign-in using Facebook, Google, Twitter and other sites that support oAuth.
        </p>
        <p>
          Cross Site Request Forgery (CSRF) protection is added to all post requests,
          session data on the server is encrypted and and session tokens are only stored HTTP Only cookies
          on the client as protection against Cross Site Scripting (XSS) attacks.
        </p>
        <h4>Email sign-in</h4>
        <p>
          If you aren&#39;t receiving emails when trying to sign in via email, try using another email address or
          configuring the mail server option - some email providers block email from unverified mail servers.
        </p>
        <h4>oAuth sign-in</h4>
        <p>
          To use the oAuth sign in options, you will need to create your own account with each provider and configure each one for your site.
          This can be a slightly cumbersome process that is hard to debug. See <a href="https://github.com/iaincollins/nextjs-starter/blob/master/AUTHENTICATION.md">AUTHENTICATION.md</a> for a step-by-step guide.
        </p>
        <h4>Database configuration</h4>
        <p>
          By default, both user data and session data is stored in an in-memory database (that is wiped when
          the server is stopped or restarted). You can add MongoDB database URLs to a <strong>.env</strong> file
          in your projects directory if you want user and session data to be persisted in a MongoDB database.
        </p>
        <p>
          <strong>.env</strong>:
        </p>
        <pre>
          USER_DB_CONNECTION_STRING=mongodb://localhost:27017/my-database<br/>
          SESSION_DB_CONNECTION_STRING=mongodb://localhost:27017/my-database
        </pre>
        <p>
          You can install MongoDB locally or get a free sandbox instance that runs in the cloud from <a href="https://mlab.com">mLab</a>.
          User data and session data can be stored in the same database, or in seperate databases.
        </p>
        <h5>Session data</h5>
        <p>
          In this example project it's easy to change the session store by changing the logic in <strong>index.js</strong>.
        </p>
        <h5>User data</h5>
        <p>
          If you want to change the database used to store user data, you would need to
          change <strong>routes/auth.js</strong> and <strong>routes/passport-strategies.js</strong> as
          both files contain code for creating, updating and looking up user accounts. This is considerably more complex than changing the session store.
        </p>
        <h4>Scaling</h4>
        <p>
          This project provides a working, integrated authentication system that can easily be scaled by being deployed in a cluster.
        </p>
        <p>
          For site with heavy traffic, a fully decoupled authentication system, running on a seperate backend,
          may ultimately be easier to scale and maintain - but decoupling authentication comes with it's own challenges,
          particularly with regard to security.
        </p>
      </Layout>
    )
  }

}
