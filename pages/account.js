import React from 'react'
import Link from 'next/link'
import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap'
import Page from '../components/page'
import Layout from '../components/layout'
import Session from '../components/session'

export default class extends Page {

  static async getInitialProps({req}) {
    let props = await super.getInitialProps({req})
    props.isSignedIn = (props.session.user) ? true : false
    return props
  }

  constructor(props) {
    super(props)
    this.state = {
      user: props.session.user || {},
      linkedWithFacebook: null,
      linkedWithGoogle: null,
      linkedWithTwitter: null
    }
  }

  async componentDidMount() {
    // @TODO Get user profile
    this.setState({
      linkedWithFacebook: false,
      linkedWithGoogle: false,
      linkedWithTwitter: false
    })
  }

  render() {
    if (this.props.isSignedIn === true) {
      return (
        <Layout session={this.props.session}>
          <h2>Your profile</h2>
          <Row>
            <Col xs="12" md="8" lg="9">
              <Form>
                <Input name="_csrf" type="hidden" value={this.props.session.csrfToken}/>
                <FormGroup>
                  <Label>Name:</Label>
                  <Input name="name" value={this.state.user.name}/>
                </FormGroup>
                <FormGroup>
                  <Label>Email address:</Label>
                  <Input name="email" value={(this.state.user.email.match(/.*@localhost\.localdomain$/)) ? '' : this.state.user.email}/>
                </FormGroup>
                <p className="text-right">
                  <Button color="primary" type="submit">Save changes</Button>
                </p>
              </Form>
            </Col>
            <Col xs="12" md="4" lg="3">
              <h3>Link accounts</h3>
              <p>You can link your profile to other accounts so you can sign in with them too.</p>
              <LinkAccount provider="Facebook" session={this.props.session} linked={this.state.linkedWithFacebook}/>
              <LinkAccount provider="Google" session={this.props.session} linked={this.state.linkedWithGoogle}/>
              <LinkAccount provider="Twitter" session={this.props.session} linked={this.state.linkedWithTwitter}/>
            </Col>
          </Row>
        </Layout>
      )
    } else {
      return (
        <Layout session={this.props.session}>
          <p>
            You are not signed in.
          </p>
        </Layout>
      )
    }
  }
}

export class LinkAccount extends React.Component {
  render() {
    if (this.props.linked === true) {
      return (
        <Form action={`/auth/oauth/${this.props.provider.toLowerCase()}/unlink`} method="post">
          <Input name="_csrf" type="hidden" value={this.props.session.csrfToken}/>
          <Button block color="danger" type="submit">Unlink from {this.props.provider}</Button>
        </Form>
      )
    } else if (this.props.linked === false) {
      return (
        <p>
          <Link href={`/auth/oauth/${this.props.provider.toLowerCase()}`}><Button block color="secondary">Link with {this.props.provider}</Button></Link>
        </p>
      )
    } else {
      // Still fetching data
      return (<p/>)
    }
  }
}