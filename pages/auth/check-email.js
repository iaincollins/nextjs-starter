import React from 'react'
import Page from '../../components/page'
import Layout from '../../components/layout'
import Session from '../../components/session'

export default class extends Page {
  
  static async getInitialProps({req, res}) {
    // Get latest session (forceing cache busting when rending on client)
    const session = await Session.getSession({force: true, req: req})
    
    // If signed in already, instead of displaying message send to callback page
    // which should redirect them to whatever page it normally sends clients to
    if (session.user) {
      if (req) {
        res.redirect('/auth/callback')
      } else {
        Router.push('/auth/callback')
      }
    }
      
    return {
      session: session
    }
  }
  
  render() {
    return (
      <Layout {...this.props} navmenu={false}>
        <div className="text-center pt-5 pb-5">
          <h1 className="display-4">Check your email</h1>
          <p className="lead">Check your email for a sign in link.</p>
        </div>
      </Layout>
    )
  }
}
