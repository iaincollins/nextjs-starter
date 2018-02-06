import React from 'react'
import Router from 'next/router'
import { Row, Col, Form, Input, Label, Button } from 'reactstrap'
import Cookies from 'universal-cookie'
import { NextAuth } from 'next-auth/client'

export default class extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      session: this.props.session,
      providers: this.props.providers
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleEmailChange = this.handleEmailChange.bind(this)
    
  }
  
  handleEmailChange(event) {
    this.setState({
      email: event.target.value.trim()
    })
  }

  handleSubmit(event) {
    event.preventDefault()
    
    if (!this.state.email) return

    // Save current URL so user is redirected back here after signing in
    const cookies = new Cookies()
    cookies.set('redirect_url', window.location.pathname, { path: '/' })

    NextAuth.signin(this.state.email)
    .then(() => {
      Router.push(`/auth/check-email?email=${this.state.email}`)
    })
    .catch(err => {
      Router.push(`/auth/error?action=signin&type=email&email=${this.state.email}`)
    })
  }
  
  render() {
    if (this.props.session.user) {
      return(<div/>)
    } else {
      return (
        <React.Fragment>
          <p className="text-center" style={{marginTop: 10, marginBottom: 30}}>{`If you don't have an account, one will be created when you sign in.`}</p>
          <Row>
            <Col xs={12} md={6}>
              <SignInButtons providers={this.props.providers}/>
            </Col>
            <Col xs={12} md={6}>
              <Form id="signin" method="post" action="/auth/email/signin" onSubmit={this.handleSubmit}>
                <Input name="_csrf" type="hidden" value={this.state.session.csrfToken}/>
                <p>
                  <Label htmlFor="email">Email address</Label><br/>
                  <Input name="email" type="text" placeholder="j.smith@example.com" id="email" className="form-control" value={this.state.email} onChange={this.handleEmailChange}/>
                </p>
                <p className="text-right">
                  <Button id="submitButton" outline color="dark" type="submit">Sign in with email</Button>
                </p>
              </Form>
            </Col>
          </Row>
        </React.Fragment>
      )
    }
  }
}

export class SignInButtons extends React.Component {
  render() {
    return (
      <React.Fragment>
        {
          Object.keys(this.props.providers).map((provider, i) => {
            if (!this.props.providers[provider].signin) return null

            return (
              <p key={i}>
                <a className="btn btn-block btn-outline-secondary" href={this.props.providers[provider].signin}>
                  Sign in with {provider}
                </a>
              </p>
              )              
          })
        }
      </React.Fragment>
    )
  }
}