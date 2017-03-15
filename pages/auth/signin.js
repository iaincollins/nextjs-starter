import React from 'react'
import Page from '../../components/page'
import Layout from '../../components/layout'
import Session from '../../components/session'

export default class extends Page {

  constructor(props) {
    super(props)
    this.state = {
      email: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleEmailChange = this.handleEmailChange.bind(this)
  }

  handleEmailChange(event) {
    this.setState({email: event.target.value.trim()})
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
    if (this.props.session.user) {
      let linkWithFacebook = <a className="button button-oauth button-facebook" href="/auth/oauth/facebook">Link with Facebook</a>
      if (this.props.session.user.facebook) {
        linkWithFacebook = <p>✔ <strong>Linked with Facebook</strong></p>
      }

      let linkWithGoogle = <a className="button button-oauth button-google" href="/auth/oauth/google">Link with Google</a>
      if (this.props.session.user.google) {
        linkWithGoogle = <p>✔ <strong>Linked with Google</strong></p>
      }

      let linkWithTwitter = <a className="button button-oauth button-twitter" href="/auth/oauth/twitter">Link with Twitter</a>
      if (this.props.session.user.twitter) {
        linkWithTwitter = <p>✔ <strong>Linked with Twitter</strong></p>
      }

      // Twitter is a special case as it hasn't historically exposed users
      // email addresses (though this is a new option Twitter are rolling out).
      // So we assign them a temporary faux email address '{username}@twitter'
      // until they are signed in and can add their real email address.
      let signedInAs = <p>You are signed in as <strong>{this.props.session.user.email}</strong>.</p>
      if (this.props.session.user.email.match(/.*@twitter$/)) {
        signedInAs = <p>You are signed in with <strong>Twitter</strong>.</p>
      }

      signinForm = (
        <div>
          <h3>You are signed in</h3>
          {signedInAs}
          <p>You can link your account to your other accounts so you can sign in with them too.</p>
          <p>
            {linkWithFacebook}
            {linkWithGoogle}
            {linkWithTwitter}
          </p>
          <p>
            <i>
              Note: When signed in, you should able unlink accounts and to change your name and email address,
              but those features aren&#39;t implemented in this project. Unlinking an account is as simple
              as just deleting the oauth key from the user in your database.
            </i>
          </p>
        </div>
      )
    } else {
      signinForm = (
        <div>
          <form id="signin" method="post" action="/auth/email/signin" onSubmit={this.handleSubmit}>
            <input name="_csrf" type="hidden" value={this.props.session.csrfToken}/>
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
      <Layout session={this.props.session}>
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
        <h3>Exending the authentication system</h3>
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
