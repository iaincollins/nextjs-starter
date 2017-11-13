import React from 'react'
import Router from 'next/router'
import { Row, Col } from 'reactstrap'
import Page from '../../components/page'
import Layout from '../../components/layout'
import Session from '../../components/session'
import Signin from '../../components/signin'

export default class extends Page {

  static async getInitialProps({req, res, query}) {
    // This page is the destination page after logging or linking/unlinking 
    // accounts which helps avoid any weird edge cases by forcing cache busting 
    // so the session status is always correct.
    const session = await Session.getSession({force: true, req: req})
    
    // If you want to redirect users to some page other than '/' then change
    // the logic here.
    if (session.user) {
      let redirectTo = '/'
      if (req) {
        res.redirect(redirectTo)
      } else {
        Router.push(redirectTo)
      }
    }

    return {
      session: session
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
    return (
      <Layout session={this.state.session} navmenu={false}>
        <h1 className="text-center">Sign up / Sign in</h1>
        <Row>
          <Col lg="8" className="mr-auto ml-auto" style={{marginBottom: 20}}>
            <Signin session={this.state.session}/>
          </Col>
        </Row>
      </Layout>
    )
  }

}
