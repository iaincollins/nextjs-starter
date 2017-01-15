import React from 'react'
import Page from '../../layouts/main'
import Session from '../../components/session'

export default class extends React.Component {
  
  // Any page that needs to access a session needs to call it in
  // getInitialProps() and export to any components that use it, like this.
  //
  // Note that the session is cached in the web storage and calling
  // getSession() does not trigger a call to the server every time.
  static async getInitialProps({ req }) {
    const session = new Session(arguments)
    return {
      session: await session.getSession()
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      csrfToken: props.session.csrfToken,
      email: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleEmailChange = this.handleEmailChange.bind(this)
  }

  handleEmailChange(event) {
    this.state.email = event.target.value.trim()
    this.setState(this.state)
  }
  
  async handleSubmit(event) {
    event.preventDefault()

    // @TODO Highlight email field if left blank
    if (this.state.email.trim() == '')
      return false

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
    if (this.props.session.isLoggedIn == false) {
      signinForm = 
        <div>
          <form id="signin" method="post" onSubmit={this.handleSubmit}>
            <input name="_csrf" type="hidden" value={this.state.csrfToken} />
            <h3>Sign in</h3>
            <p>
              <label htmlFor="email">Email address</label><br/>
              <input name="email" type="text" placeholder="j.smith@example.com" id="email" value={this.state.email} onChange={this.handleEmailChange} />
            </p>
            <p>
              <button type="submit">Sign in</button>
            </p>
          </form>
        </div>
    }
  
    return(
      <Page session={this.props.session}>
        <h2>Authentication</h2>
        {signinForm}
        <h3>How it works</h3>
        <p>
          This passwordless, email based authentication system is like the system
          used by sites like Slack. One time use tokens are sent out via email
          and recipients follow the links in the emails to sign in.
        </p>
        <p>
          The login system works client and server side, with and without JavaScript.
          Session identifiers are stored in HTTP Only cookies and client session
          data is cached using the Web Storage API (localStorage rather than 
          sessionStorage so that it's available across tabs). 
          Cross Site Request Forgery protection is added to all POST requests.
        </p>
        <p>
          The session identifier (AKA session ID or session token) is stored in a
          cookie with the "HTTP Only" option set and is accessed only indirectly via
          XMLHttpRequest(). It cannot be read directly via JavaScript, as protection
          against Cross Site Scripting (XSS) attacks being used to hijack a session.
        </p>
        <p>
          All pages in this demo call getSession() in their getInitialProps(), and export
          the session to the layout, where the header and login menu inherit it from. The call
          to getSession() only triggers an request to the server if the local data store is empty.
        </p>
        <p>
          By default, user data is persisted on the server in SQL Lite, but this can be
          easily changed to another database (MongoDB, MySQL, PostgreSQL, Amazon Redshift, etc…)
          by customising the options passed to lib/auth.js.
        </p>
        <p>
        For larger sites, a fully decoupled authentication system (running on a seperate backend) can be easier to scale and maintain,
          but this example shows how you can add authentication to any Next.js 2.0 project.
        </p>
        <p>
          Note: If you aren't receiving emails, try using another email address or
          configuring the mail server option (some email providers block email from
          unverified mail servers).
        </p>
      </Page>
    )
  }
  
}
