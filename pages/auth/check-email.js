import React from 'react'
import Page from '../../components/page'
import Layout from '../../components/layout'
import Session from '../../components/session'

export default class extends Page {
  
  static async getInitialProps({req, res}) {
    const session = await Session.getSession({force: true, req: req})
    
    // If signed in already, instead of displaying message send to sign in page
    // which should redirect them to whatever page it normally sends clients to
    if (session.user) {
      if (req) {
        res.redirect('/auth/signin')
      } else {
        Router.push('/auth/signin')
      }
    }
      
    return {
      session: session
    }
  }
  
  render() {
    return (
      <Layout session={this.props.session} navmenu={false}>
        <div style={{margin: '2em 0'}} className="text-center">
          <h1 style={{margin: '0.5em 0'}}>Check your email</h1>
          <p className="lead">You have been sent an email with a link you can use to sign in.</p>
        </div>
      </Layout>
    )
  }
}
