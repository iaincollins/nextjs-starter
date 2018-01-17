import React from 'react'
import Layout from '../components/layout'
import Session from '../models/session'

export default class extends React.Component {
  // Expose session to all pages
  static async getInitialProps({req}) {
    return {
      session: await Session.getSession({req}),
      lang: 'en'
    }
  }
  
  adminAcccessOnly() {
    return (
      <Layout session={this.props.session} navmenu={false}>
        <div className="text-center pt-5 pb-5">
          <h1 className="display-4 mb-5">Access Denied</h1>
          <p className="lead">You must be signed in as an administrator to access this page.</p>
        </div>
      </Layout>
    )
  }

}
