/* eslint-disable react/no-danger */
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import { Nav, NavItem, Button, Form, NavLink, Collapse, Navbar, NavbarToggler, NavbarBrand } from 'reactstrap'
import Session from './session'
import Package from '../package'
import Styles from '../css/index.scss'

export default class extends React.Component {

  static propTypes() {
    return {
      session: React.PropTypes.object.isRequired,
      hideSignInBtn: React.PropTypes.boolean.optional
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      navbarIsOpen: false
    }
    this.toggleNavbar = this.toggleNavbar.bind(this)
  }

  toggleNavbar() {
    this.setState({
      navbarIsOpen: !this.state.navbarIsOpen
    })
  }
  
  async handleSignoutSubmit(event) {
    event.preventDefault()
    const session = new Session()
    await session.signout()
    // @FIXME Using window.location as next/router wasn't working reliably here
    window.location = '/'
  }
  
    
  userMenu() {
    if (this.props.session.user) {
      const session = this.props.session
      return (
        <Nav className="ml-auto" navbar>
          <NavItem>
            <Link prefetch href="/auth/signin"><NavLink style={{padding: '0.4em'}} href="">Signed in as <strong>{session.user.name || session.user.email}</strong></NavLink></Link>
          </NavItem>
          <NavItem>
            <Form id="signout" method="post" action="/auth/signout" onSubmit={this.handleSignoutSubmit}>
              <input name="_csrf" type="hidden" value={session.csrfToken}/>
              <Button type="submit" color="primary">Sign out</Button>
            </Form>
          </NavItem>
        </Nav>
      )
    } else {
      if (this.props.hideSignInBtn === true) {
        return (<Nav className="ml-auto" navbar></Nav>)
      } else {
        return (
          <Nav className="ml-auto" navbar>
            <NavItem>
              <Link prefetch href="/auth/signin"><a className="btn btn-primary">Sign up / Sign in</a></Link>
            </NavItem>
          </Nav>
        )
      }
    }
  }  

  render() {
    return (
     <div>
       <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style dangerouslySetInnerHTML={{__html: Styles}}/>
        <script src="https://cdn.polyfill.io/v2/polyfill.min.js"/>
       </Head>
       <Navbar toggleable className="navbar navbar-dark bg-dark navbar-expand-md" style={{marginBottom: 10}}>
         <Link prefetch href="/"><NavbarBrand href="">{Package.name}</NavbarBrand></Link>
         <NavbarToggler right onClick={this.toggleNavbar} />
         <Collapse isOpen={this.state.navbarIsOpen} navbar>
          {this.userMenu()}
         </Collapse>
       </Navbar>
     </div>
    )
  }

}
