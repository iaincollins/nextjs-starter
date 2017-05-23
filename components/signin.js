import Link from 'next/link'
import React from 'react'
import { Nav, NavItem, Button, Form, NavLink} from 'reactstrap'
import Session from './session'

export default class extends React.Component {

  static propTypes() {
    return {
      session: React.PropTypes.object.isRequired,
      hideSignInBtn: React.PropTypes.boolean.optional
    }
  }

  async handleSubmit(event) {
    event.preventDefault()
    const session = new Session()
    await session.signout()
    // @FIXME Using window.location as next/router wasn't working reliably here
    window.location = '/'
  }
  
  render() {
    if (this.props.session.user) {
      const session = this.props.session
      return (
        <Nav className="ml-auto" navbar>
          <NavItem>
            <Link prefetch href="/auth/signin"><NavLink style={{padding: '0.4em'}} href="">Signed in as <strong>{session.user.name || session.user.email}</strong></NavLink></Link>
          </NavItem>
          <NavItem>
            <Form id="signout" method="post" action="/auth/signout" onSubmit={this.handleSubmit}>
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

}
