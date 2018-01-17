import React from 'react'
import Router from 'next/router'
import { Row, Col } from 'reactstrap'
import Page from '../../components/page'
import Layout from '../../components/layout'
import Cookies from '../../components/cookies'
import Session from '../../models/session'
import Loader from '../../components/loader'
import Signin from '../../components/signin'

export default class extends Page {

  static async getInitialProps({req}) {
    const session = await Session.getSession({force: true, req: req})

    // If the user is signed in, we look for a redirect URL cookie and send 
    // them to that page (so people signing in end up back on the page they
    // were on before signing in / signing up).
    //
    // If you want to redirect users to some page other than '/' by default
    // then change the logic here.
    let redirectTo = '/'
    if (session.user) {
      if (req) {
        // Read cookie redirect path - if one is set
        if (req.cookies && req.cookies && req.cookies['redirect_url'] && typeof req.cookies['redirect_url'] !== 'undefined') {
          redirectTo = req.cookies['redirect_url']
        }
      } else {
        // Read cookie redirect path and remove cookie on client - if one is set
        redirectTo = Cookies.read('redirect_url') || redirectTo
      }
      
      // Allow relative paths only - strip protocol/host/port if they exist
      redirectTo = redirectTo.replace( /^[a-zA-Z]{3,5}\:\/{2}[a-zA-Z0-9_.:-]+\//, '')
    }
    
    return {
      session: session,
      redirectTo: redirectTo
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      session: this.props.session
    }
  }

  async componentDidMount() {
    const session = await Session.getSession({force: true})
    
    // Get latest session data after rendering on client
    //
    // Any page specified as a callback page should do this to force session 
    // cache busting on clients.
    this.setState({
      session: session
    })
    
    if (session.user)
      Router.push(this.props.redirectTo)
  }

  render() {
    // Use a meta refresh to redirect clients without JavaScript as a fallback
    // - also provides a regular link in case the meta refresh doesn't work.
    return (
      <React.Fragment>
        <style jsx global>{`
          a:link,
          a:visited,
          a:hover,
          a:active {
           text-decoration: none;
          }
        `}</style>
        <meta httpEquiv="refresh" content={'1;url='+this.props.redirectTo} />
        <a href={this.props.redirectTo}>
          <Loader fullscreen={true}/>
        </a>
      </React.Fragment>
    )
  }

}