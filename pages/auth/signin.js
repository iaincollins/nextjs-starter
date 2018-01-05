import Router from 'next/router'
import { Row, Col } from 'reactstrap'
import Page from '../../components/page'
import Layout from '../../components/layout'
import Session from '../../components/session'
import Signin from '../../components/signin'
import Cookies from '../../components/cookies'

export default class extends Page {

  static async getInitialProps({req, res, query}) {
    // On the sign in page we always force get the latest session data from the
    // server by passing 'force: true' to getSession to force cache busting.
    const session = await Session.getSession({force: true, req: req})
    
    // If the user is logged in, we redirect them to the /auth/callback
    // page which handles final routing.
    if (session.user) {
      if (req) {
        // Server side redirect
        res.redirect('/auth/callback')
      } else {
        // Client side redirect
        Router.push('/auth/callback')
      }
    }
    
    if (query.redirect) {
      if (res) {
        res.cookie('redirect_url', query.redirect)
      } else {
        Cookies.save('redirect_url', query.redirect)
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
        <h1 className="text-center display-4">Sign up / Sign in</h1>
        <Row className="mb-5">
          <Col lg="8" className="mr-auto ml-auto" style={{marginBottom: 20}}>
            <Signin session={this.state.session}/>
          </Col>
        </Row>
      </Layout>
    )
  }

}
