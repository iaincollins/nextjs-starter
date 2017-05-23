/* eslint-disable react/no-danger */
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import { Collapse, Navbar, NavbarToggler, NavbarBrand} from 'reactstrap'
import inlineCSS from '../css/main.scss'
import Package from '../package'
import SignIn from './signin'

export default class extends React.Component {

  static propTypes() {
    return {
      session: React.PropTypes.object.isRequired,
      hideSignInBtn: React.PropTypes.boolean.optional
    }
  }

  constructor(props) {
    super(props)
    this.toggle = this.toggle.bind(this)
    this.state = {
      isOpen: false
    }
  }
  
  stylesheet() {
    if (process.env.NODE_ENV === 'production') {
      // In production, serve pre-built CSS file from /assets/{version}/main.css
      let pathToCSS = '/assets/' + Package.version + '/main.css'
      return <link rel="stylesheet" type="text/css" href={pathToCSS}/>
    } else {
      // In development, serve CSS inline (with live reloading) with webpack
      // NB: Not using dangerouslySetInnerHTML will cause problems with some CSS
      return <style dangerouslySetInnerHTML={{__html: inlineCSS}}/>
    }
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  render() {
    return (
     <div>
       <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <script src="https://cdn.polyfill.io/v2/polyfill.min.js"/>
        {this.stylesheet()}
       </Head>
       <Navbar color="inverse" inverse toggleable style={{marginBottom: 10}}>
         <NavbarToggler right onClick={this.toggle} />
         <Link prefetch href="/"><NavbarBrand href="">Next.js Starter Project</NavbarBrand></Link>
         <Collapse isOpen={this.state.isOpen} navbar>
           <SignIn session={this.props.session} hideSignInBtn={this.props.hideSignInBtn || false}/>
         </Collapse>
       </Navbar>
     </div>
    )
  }

}
