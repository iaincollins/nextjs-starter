import Link from 'next/prefetch'
import React from 'react'
import Page from '../../components/page'
import Layout from '../../components/layout'
import Session from '../../components/session'

export default class extends Page {

  async componentDidMount() {
    const session = new Session()
    await session.getSession(true)
    this.props.url.push("/")
  }
  
  render() {
    return(
      <Layout session={this.props.session}>
        <div style={{textAlign: "center"}}>
          <p>You are now signed in.</p>
          <p><Link href="/"><a>Continue</a></Link></p>
        </div>
      </Layout>
    )
  }
  
}