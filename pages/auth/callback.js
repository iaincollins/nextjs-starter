import React from 'react'
import Router from 'next/router'
import { Row, Col } from 'reactstrap'
import Page from '../../components/page'
import Layout from '../../components/layout'
import Cookies from '../../components/cookies'
import Session from '../../components/session'
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
          .lds-wrapper {
              top: 50%;
              left: 50%;
              position: absolute;
              margin-top: -25px;
              margin-left: -25px;
              height: 50px;
              width: 50px;
          }
          .lds-css {
            width: 50px;
            height: 50px;
            margin: auto;
            transform: scale(1);
          }
          @keyframes lds-ring {
            0% {
              transform: rotate(0)
            }
            100% {
              transform: rotate(360deg)
            }
          }
          .lds-ring > div {
            position: absolute;
            top: 10%;
            left: 10%;
            width: 80%;
            height: 80%;
            border-radius: 50%;
            border: 5px solid #ccc;
            border-color: #ccc transparent transparent transparent;
            animation: lds-ring 1.5s cubic-bezier(0.5,0,0.5,1) infinite;
          }
          .lds-ring > div:nth-child(2) {
            animation-delay: .195s;
          }
          .lds-ring > div:nth-child(3) {
            animation-delay: .39s;
          }
          .lds-ring > div:nth-child(4) {
            animation-delay: .585s;
          }
          a:link,
          a:visited,
          a:hover,
          a:active {
           text-decoration: none;
          }
        `}</style>
        <meta httpEquiv="refresh" content={'1;url='+this.props.redirectTo} />
        <a className="lds-wrapper">
          <div href={this.props.redirectTo} className="lds-css">
            <div className="lds-ring" style={{width: '100%', height: '100%'}}><div></div><div></div><div></div><div></div></div>
          </div>
        </a>
      </React.Fragment>
    )
  }

}