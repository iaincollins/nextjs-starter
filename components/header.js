/* eslint-disable react/no-danger */
import Head from 'next/head'
import Link from 'next/prefetch'
import React from 'react'
import stylesheet from '../static/css/main.scss'
import Menu from './menu'

export default class extends React.Component {

  static propTypes() {
    return {
      session: React.PropTypes.object.isRequired
    }
  }

  render() {
    return (
      <header>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          {/* Note: Not using dangerouslySetInnerHTML will cause problems with some CSS! */}
          <style dangerouslySetInnerHTML={{__html: stylesheet}}/>
        </Head>
        <Menu session={this.props.session}/>
        <div className="header">
          <h1><Link href="/"><a>Next.js 2.0 Starter Project</a></Link></h1>
        </div>
      </header>
    )
  }

}
