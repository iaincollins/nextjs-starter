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
    this.setState({ email: event.target.value.trim() })
  }
  
  async handleSubmit(event) {
    event.preventDefault()
    
    const session = new Session()
    session.signin(this.state.email)
    .then(() => {
      this.props.url.push("/auth/check-email")
    })
    .catch((err) => {
      // @TODO Handle error
    })
  }

  render() {
    let signinForm = <div></div>
    if (!this.props.session.user) {
      signinForm = 
        <div>
          <h2>Sign in</h2>
          <form id="signin" method="post" action="/auth/email/signin" onSubmit={this.handleSubmit}>
            <input name="_csrf" type="hidden" value={this.props.session.csrfToken} />
            <h3>Sign in with email</h3>
            <p>
              <label htmlFor="email">Email address</label><br/>
              <input name="email" type="text" placeholder="j.smith@example.com" id="email" value={this.state.email} onChange={this.handleEmailChange} />
            </p>
            <p>
              <button id="submitButton" type="submit">Sign in</button>
            </p>
          </form>
          <h3>Sign in with oAuth</h3>
          <p>
            <a className="button" href="/auth/oauth/facebook">Sign in with Facebook</a>
            &nbsp;
            <a className="button" href="/auth/oauth/google">Sign in with Google</a>
            &nbsp;
            <a className="button" href="/auth/oauth/twitter">Sign in with Twitter</a>
          </p>
        </div>
    }
  
    return(
      <Layout session={this.props.session}>
        {signinForm}
        <h2>How it works</h2>
        <p>
          This passwordless, email based authentication system implmented is similar 
           to the one used by sites like Slack. One time use tokens are sent out via email
          and recipients follow the links in the emails to sign in.
        </p>
        <p>
          The project includes Cross Site Request Forgery (CSRF) protection on all post 
          requests, and only stores session tokes in HTTP Only cookies as protection 
          against Cross Site Scripting (XSS) attacks.
        </p>
        <p>
        This project also uses Passport so you can sign in with Facebook, Google, Twitter (or other oAuth providers).
        </p>
        <h3>More information</h3>
        <p>
          By default, user data is persisted on the server in SQL Lite, but this can be
          easily changed to another database (MongoDB, MySQL, PostgreSQL, Amazon Redshift, etc…)
          by customising the options passed to lib/auth.js.
        </p>
        <p>
          For larger sites, a fully decoupled authentication system, running on a seperate backend,
          can be easier to scale and maintain, but this example shows how you can add easily add
          authentication to any Next.js 2.0 project.
        </p>
        <p>
          To use the oAuth sign in options, you will need to create your own account with each provider and configure each one for your site. See <a href="https://github.com/iaincollins/nextjs-starter/blob/master/AUTHENTICATION.md">AUTHENTICATION.md</a> for a step-by-step guide.
        </p>
        <p>
          If you aren't receiving emails, try using another email address or
          configuring the mail server option - some email providers block email from
          unverified mail servers.
        </p>
      </Layout>
    )
  }
  
}