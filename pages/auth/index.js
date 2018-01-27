import React from 'react'
import Head from 'next/head'
import Router from 'next/router'
import Link from 'next/link'
import { Row, Col } from 'reactstrap'
import Cookies from 'universal-cookie'
import { NextAuth } from 'next-auth-client'
import Page from '../../components/page'
import Layout from '../../components/layout'
import SignIn from '../../components/signin'

export default class extends Page {
  
  static async getInitialProps({req, res, query}) {
    const session = await NextAuth.init({force: true, req: req})
    const providers = await NextAuth.providers({req})

    // If signed in already, redirect to account management page.
    if (session.user) {
      if (req) {
        res.redirect('/account')
      } else {
        Router.push('/account')
      }
    }

    // If passed a redirect parameter, save it as a cookie
    if (query.redirect) {
      const cookies = new Cookies((req && req.headers.cookie) ? req.headers.cookie : null)
      cookies.set('redirect_url', query.redirect, { path: '/' })
    }
    
    return {
      session: session,
      providers: providers,
      providers: await NextAuth.providers({req})
    }
  }
  
  render() {
    if (this.props.session.user) {
      return (
        <Layout {...this.props} navmenu={false}>
          <h1 className="text-center display-4">Sign up / Sign in</h1>
        </Layout>
      )
    } else {
      return (
        <Layout {...this.props} navmenu={false}>
          <h1 className="text-center display-4">Sign up / Sign in</h1>
          <Row className="mb-5">
            <Col lg="8" className="mr-auto ml-auto" style={{marginBottom: 20}}>
              <SignIn session={this.props.session} providers={this.props.providers}/>
            </Col>
          </Row>
        </Layout>
      )
    }
  }
}