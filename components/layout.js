import React from 'react'
import Head from 'next/head'
import Router from 'next/router'
import Link from 'next/link'
import { Container, Nav, NavItem, Button, Form, NavLink, Collapse, Navbar,
        NavbarToggler, NavbarBrand, Modal, ModalHeader, ModalBody, ModalFooter }
  from 'reactstrap'
import Session from './session'
import Package from '../package'
import Styles from '../css/index.scss'

export default class extends React.Component {

  static propTypes() {
    return {
      session: React.PropTypes.object.isRequired,
      children: React.PropTypes.object.isRequired
    }
  }
  
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false,
      modal: false
    }
    this.toggleNavbar = this.toggleNavbar.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
  }

  toggleNavbar() {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  toggleModal() {
    this.setState({
      modal: !this.state.modal
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
       <Navbar toggleable className="navbar navbar-dark bg-dark navbar-expand-md" style={{marginBottom: 10}}>
         <Link prefetch href="/"><NavbarBrand href="">{Package.name}</NavbarBrand></Link>
         <NavbarToggler right onClick={this.toggleNavbar} />
         <Collapse isOpen={this.state.navbarIsOpen} navbar>
           <UserMenu session={this.props.session}/>
         </Collapse>
       </Navbar>
        <Container>
          {this.props.children}
        </Container>
        <div className="container">
          <hr/>
          <p>
            <Link prefetch href="/"><a><strong>Home</strong></a></Link>
            &nbsp;|&nbsp;
            <Link href="https://github.com/iaincollins/nextjs-starter"><a>nextjs-starter {Package.version}</a></Link>
            &nbsp;|&nbsp;
            <Link href="https://github.com/zeit/next.js"><a>nextjs {Package.dependencies.next}</a></Link>
            &nbsp;| &copy; {new Date().getYear() + 1900}
          </p>
        </div>
      </div>
    )
  }

}

export class UserMenu extends React.Component {
  async handleSignoutSubmit(event) {
    event.preventDefault()
    await Session.signout()
    Router.push('/')
  }
  
  render() {
    if (this.props.session && this.props.session.user) {
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


/*
<Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
  <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
  <ModalBody>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  </ModalBody>
  <ModalFooter>
    <Button color="primary" onClick={this.toggle}>Do Something</Button>{' '}
    <Button color="secondary" onClick={this.toggle}>Cancel</Button>
  </ModalFooter>
</Modal>
*/