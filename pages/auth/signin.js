import React from 'react'
import Router from 'next/router'
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
    const session = await Session.getSession({force: true, req: req})
    if (session.user)
      Router.push('/auth/profile')
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
      <Layout session={this.state.session}>
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
