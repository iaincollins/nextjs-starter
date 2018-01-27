import React from 'react'
import Layout from '../components/layout'
import { NextAuth } from 'next-auth-client'

export default class extends React.Component {
  // Expose session to all pages
  static async getInitialProps({req}) {
    // Export this.props.session to all pages
    const session = await NextAuth.init({req})
    
    // If the user is not already signed in, get currently configured providers.
    // This project uses them in the sign in dialog, which is embedded on all
    // pages when browsing the site but not signed in.
    //
    // NB: As an improvement, this could alternatively be called on modal load.
    const providers = (!session.user) ? await NextAuth.providers({req}) : {}
    
    return {
      session: session,
      providers: providers,
      lang: 'en' // Sets a lang property for accessibility
    }
  }
  
  adminAcccessOnly() {
    return (
      <Layout {...this.props} navmenu={false}>
        <div className="text-center pt-5 pb-5">
          <h1 className="display-4 mb-5">Access Denied</h1>
          <p className="lead">You must be signed in as an administrator to access this page.</p>
        </div>
      </Layout>
    )
  }

}
