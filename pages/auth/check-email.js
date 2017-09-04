import React from 'react'
import Page from '../../components/page'
import Layout from '../../components/layout'

export default class extends Page {
  render() {
    return (
      <Layout session={this.props.session}>
        <div style={{margin: '2em 0'}} className="text-center">
          <h1 style={{margin: '0.5em 0'}}>Check your email</h1>
          <p className="lead">You have been sent an email with a link you can use to sign in.</p>
        </div>
      </Layout>
    )
  }
}
