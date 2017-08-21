/* eslint-disable react/no-danger */
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import { Collapse, Navbar, NavbarToggler, NavbarBrand } from 'reactstrap'
import Styles from '../css/index.scss'
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
        <style dangerouslySetInnerHTML={{__html: Styles}}/>
        <script src="https://cdn.polyfill.io/v2/polyfill.min.js"/>
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
