import React from 'react'
import fetch from 'unfetch'
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
      session: props.session,
      name: '',
      email: '',
      emailVerified: false,
      linkedWithFacebook: false,
      linkedWithGoogle: false,
      linkedWithTwitter: false
    }
    if (props.session.user) {
      this.state.name = props.session.user.name
      this.state.email = props.session.user.email
    }
    this.handleChange = this.handleChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }
  
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  async onSubmit(e) {
    // Submits the URL encoded form without causing a page reload
    e.preventDefault()
    
    const formData = {
      _csrf: await Session.getCsrfToken(),
      name: this.state.name,
      email: this.state.email
    }
    
    const encodedForm = Object.keys(formData).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(formData[key])
    }).join('&')

    fetch('/account/user', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: encodedForm
    })
    .then(async res => {
      await Session.getSession({force: true})
      this.forceUpdate()
    })
  }

  async componentDidMount() {
    fetch('/account/user', {
      credentials: 'include'
    })
    .then(r => r.json())
    .then(user => {
      // @TODO Error handling
      this.setState({
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        linkedWithFacebook: user.linkedWithFacebook,
        linkedWithGoogle: user.linkedWithGoogle,
        linkedWithTwitter: user.linkedWithTwitter
      })
    })
  }

  render() {
    if (this.props.isSignedIn === true) {
      return (
        <Layout session={this.state.session}>
          <h2>Your profile</h2>
          <Row>
            <Col xs="12" md="8" lg="9">
              <Form method="post" action="/account/user" onSubmit={this.onSubmit}>
                <Input name="_csrf" type="hidden" value={this.props.session.csrfToken} onChange={()=>{}}/>
                <FormGroup row>
                  <Label sm={2}>Name:</Label>
                  <Col sm={10}>
                    <Input name="name" value={this.state.name} onChange={this.handleChange}/>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={2}>Email:</Label>
                  <Col sm={10}>
                    <Input name="email" value={(this.state.email.match(/.*@localhost\.localdomain$/)) ? '' : this.state.email} onChange={this.handleChange}/>
                  </Col>
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
          <p>
            <Button block color="danger" type="submit">Unlink from {this.props.provider}</Button>
          </p>
        </Form>
      )
    } else if (this.props.linked === false) {
      return (
        <p>
          <a className="btn btn-block btn-secondary" href={`/auth/oauth/${this.props.provider.toLowerCase()}`}>Link with {this.props.provider}</a>
        </p>
      )
    } else {
      // Still fetching data
      return (<p/>)
    }
  }
}