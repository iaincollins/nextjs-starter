import React from 'react'
import Head from 'next/head'
import Router from 'next/router'
import Link from 'next/link'
import { Container, Row, Col, Nav, NavItem, Button, Form, NavLink, Collapse,
         Navbar, NavbarToggler, NavbarBrand, Modal, ModalHeader, ModalBody,
         ModalFooter } from 'reactstrap'
import Signin from './signin'
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

  toggleModal(e) {
    if (e) e.preventDefault()
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
        <Navbar toggleable className="navbar navbar-dark bg-dark navbar-expand-md sticky-top " style={{marginBottom: 10}}>
          <Link prefetch href="/"><NavbarBrand href="/">{Package.name}</NavbarBrand></Link>
          <NavbarToggler right onClick={this.toggleNavbar}/>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav navbar>
              <NavItem>
                <Link prefetch href="/"><NavLink className="text-light" href="/">Home</NavLink></Link>
              </NavItem>
            </Nav>
            <UserMenu session={this.props.session} toggleModal={this.toggleModal}/>
          </Collapse>
        </Navbar>
        <MainBody navmenu={this.props.navmenu}>
          {this.props.children}
        </MainBody>
        <Container>
          <hr/>
          <p>
            <Link prefetch href="/"><a><strong>Home</strong></a></Link>
            &nbsp;|&nbsp;
            <Link href="https://github.com/iaincollins/nextjs-starter"><a>nextjs-starter {Package.version}</a></Link>
            &nbsp;|&nbsp;
            <Link href="https://github.com/zeit/next.js"><a>nextjs {Package.dependencies.next}</a></Link>
            &nbsp;| &copy; {new Date().getYear() + 1900}
          </p>
        </Container>
        <SigninModal modal={this.state.modal} toggleModal={this.toggleModal} session={this.props.session}/>
      </div>
    )
  }
}

export class MainBody extends React.Component {
  render() {
    if (this.props.navmenu === false) {
      return (
        <Container style={{marginTop: '2em'}}>
          {this.props.children}
        </Container>
      )
    } else {
      return (
        <Container style={{marginTop: '2em'}}>
          <Row>
            <Col md="3" xs="12">
              <h5 className="text-muted">PAGES</h5>
              <Nav vertical>
                <NavItem>
                  <Link prefetch href="/"><NavLink href="/">About</NavLink></Link>
                </NavItem>
                <NavItem>
                  <Link prefetch href="/layout-and-styling"><NavLink href="/styling-and-layout">Layout and Styling</NavLink></Link>
                </NavItem>
                <NavItem>
                  <Link prefetch href="/async"><NavLink href="/async">Asynchronous Loading</NavLink></Link>
                </NavItem>
                <NavItem>
                  <Link prefetch href="/routing/?id=example" as="/route/example"><NavLink href="/route/example">Custom Routing</NavLink></Link>
                </NavItem>
                <NavItem>
                  <Link prefetch href="/authentication"><NavLink href="/authentication">Authentication</NavLink></Link>
                </NavItem>
              </Nav>
            </Col>
            <Col md="9" xs="12">
              {this.props.children}
            </Col>
          </Row>
        </Container>
      )
    }
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
            <Link prefetch href="/auth/profile"><NavLink className="text-light" style={{padding: '0.4em 0.6em 0.4em 0'}} href="/auth/profile">Signed in as <strong>{session.user.name || session.user.email}</strong></NavLink></Link>
          </NavItem>
          <NavItem>
            <Form id="signout" method="post" action="/auth/signout" onSubmit={this.handleSignoutSubmit}>
              <input name="_csrf" type="hidden" value={session.csrfToken}/>
              <Button type="submit" color="secondary">Sign out</Button>
            </Form>
          </NavItem>
        </Nav>
      )
    } else {
      return (
        <Nav className="ml-auto" navbar>
          <NavItem>
          {/*<Link prefetch href="/auth/signin"><a className="btn btn-primary">Sign up / Sign in</a></Link>*/}
          <a href="/auth/signin" className="btn btn-primary" onClick={this.props.toggleModal}>Sign up / Sign in</a>
          </NavItem>
        </Nav>
      )
    }
  }
}

export class SigninModal extends React.Component {
  render() {
    return (
      <Modal isOpen={this.props.modal} toggle={this.props.toggleModal} style={{maxWidth: 600}}>
        <ModalBody>
          <Signin session={this.props.session}/>
        </ModalBody>
      </Modal>
    )
  }
}