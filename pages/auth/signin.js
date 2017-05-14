import React from 'react'
import Page from '../../components/page'
import Layout from '../../components/layout'
import Session from '../../components/session'

export default class extends Page {

  static async getInitialProps({req}) {
    // On the sign in page we always force get the latest session data from the
    // server by passing 'true' to getSession. This page is the destination
    // page after logging or linking/unlinking accounts so avoids any weird
    // edge cases.
    const session = new Session({req})
    return {session: await session.getSession(true)}
  }

  async componentDidMount() {
    // Get latest session data after rendering on client
    // Any page that is specified as the oauth callback should do this
    const session = new Session()
    this.state = {
      email: this.state.email,
      session: await session.getSession(true)
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      session: this.props.session
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleEmailChange = this.handleEmailChange.bind(this)
  }

  handleEmailChange(event) {
    this.setState({
      email: event.target.value.trim(),
      session: this.state.session
    })
  }

  async handleSubmit(event) {
    event.preventDefault()

    const session = new Session()
    session.signin(this.state.email)
    .then(() => {
      this.props.url.push('/auth/check-email')
    })
    .catch(err => {
      // @FIXME Handle error
      console.log(err)
    })
  }

  render() {
    let signinForm = <div/>
    if (this.state.session.user) {
      let linkWithFacebook = <p><a className="button button-oauth button-facebook" href="/auth/oauth/facebook">Link with Facebook</a></p>
      if (this.state.session.user.facebook) {
        linkWithFacebook = <form action="/auth/oauth/facebook/unlink" method="post"><input name="_csrf" type="hidden" value={this.state.session.csrfToken}/><button className="button button-oauth" type="submit">Unlink from Facebook</button></form>
      }

      let linkWithGoogle = <p><a className="button button-oauth button-google" href="/auth/oauth/google">Link with Google</a></p>
      if (this.state.session.user.google) {
        linkWithGoogle = <form action="/auth/oauth/google/unlink" method="post"><input name="_csrf" type="hidden" value={this.state.session.csrfToken}/><button className="button button-oauth" type="submit">Unlink from Google</button></form>
      }

      let linkWithTwitter = <p><a className="button button-oauth button-twitter" href="/auth/oauth/twitter">Link with Twitter</a></p>
      if (this.state.session.user.twitter) {
        linkWithTwitter = <form action="/auth/oauth/twitter/unlink" method="post"><input name="_csrf" type="hidden" value={this.state.session.csrfToken}/><button className="button button-oauth" type="submit">Unlink from Twitter</button></form>
      }

      signinForm = (
        <div>
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
        </div>
      )
    } else {
      signinForm = (
        <div>
          <form id="signin" method="post" action="/auth/email/signin" onSubmit={this.handleSubmit}>
            <input name="_csrf" type="hidden" value={this.state.session.csrfToken}/>
            <h3>Sign in with email</h3>
            <p>
              <label htmlFor="email">Email address</label><br/>
              <input name="email" type="text" placeholder="j.smith@example.com" id="email" value={this.state.email} onChange={this.handleEmailChange}/>
            </p>
            <p>
              <button id="submitButton" type="submit">Sign in</button>
            </p>
          </form>
          <h3>Sign in with oAuth</h3>
          <p>
            <a className="button button-oauth button-facebook" href="/auth/oauth/facebook">Sign in with Facebook</a>
            <a className="button button-oauth button-google" href="/auth/oauth/google">Sign in with Google</a>
            <a className="button button-oauth button-twitter" href="/auth/oauth/twitter">Sign in with Twitter</a>
          </p>
        </div>
      )
    }

    return (
      <Layout session={this.state.session}>
        <h2>Authentication</h2>
        {signinForm}
        <h3>How it works</h3>
        <p>
          This project includes a passwordless, email based authentication system, that uses
          one time use tokens sent out via email. Recipients follow the links in the emails to sign in.
        </p>
        <p>
          Cross Site Request Forgery (CSRF) protection is added to all post requests,
          session data on the server is encrypted and and session tokens are only stored HTTP Only cookies
          on the client as protection against Cross Site Scripting (XSS) attacks.
        </p>
        <p>
          This project also integrates with Passport to allow signing in with Facebook, Google, Twitter and other sites that support oAuth.
        </p>
        <h3>Extending the authentication system</h3>
        <p>
          By default, user data is persisted on the server in SQL Lite as this requires no configuration,
          but this can be easily changed to another database - including MongoDB, MySQL, PostgreSQL, Amazon Redshift and others
          by setting the DB_CONNECTION_STRING environment variable accordingly.
        </p>
        <p>
          For larger sites, a fully decoupled authentication system, running on a seperate backend,
          can be easier to scale and maintain, but this example shows how you can add easily add
          authentication to any Next.js 2.0 project.
        </p>
        <p>
          To use the oAuth sign in options, you will need to create your own account with each provider and configure each one for your site.
          This can be a slightly cumbersome process that is hard to debug. See <a href="https://github.com/iaincollins/nextjs-starter/blob/master/AUTHENTICATION.md">AUTHENTICATION.md</a> for a step-by-step guide.
        </p>
        <p>
          If you aren&#39;t receiving emails when trying to sign in via email, try using another email address or
          configuring the mail server option - some email providers block email from
          unverified mail servers.
        </p>
      </Layout>
    )
  }

}
