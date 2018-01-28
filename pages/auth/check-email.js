import React from 'react'
import Router from 'next/router'
import Page from '../../components/page'
import Layout from '../../components/layout'
import { NextAuth } from 'next-auth-client'

export default class extends Page {

  static async getInitialProps({req, res, query}) {
    let props = await super.getInitialProps({req})
    props.session = await NextAuth.init({force: true, req: req})
    
    // If signed in already, instead of displaying message send to callback page
    // which should redirect them to whatever page it normally sends clients to
    if (props.session.user) {
      if (req) {
        res.redirect('/auth/callback')
      } else {
        Router.push('/auth/callback')
      }
    }
      
    props.email = query.email
    
    return props
  }
  
  render() {
    return (
      <Layout {...this.props} navmenu={false} signinBtn={false}>
        <div className="text-center pt-5 pb-5">
          <h1 className="display-4">Check your email</h1>
          <p className="lead">
            A sign in link has been sent to { (this.props.email) ? <span className="font-weight-bold">{this.props.email}</span> : <span>your inbox</span> }.
          </p>
        </div>
      </Layout>
    )
  }
}
