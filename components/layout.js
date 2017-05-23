import React from 'react'
import Header from './header'
import Footer from './footer'
import { Container } from 'reactstrap'

export default class extends React.Component {

  static propTypes() {
    return {
      session: React.PropTypes.object.isRequired,
      children: React.PropTypes.object.isRequired,
      hideSignInBtn: React.PropTypes.boolean.optional
    }
  }

  render() {
    return (
      <div>
        <Header session={this.props.session} hideSignInBtn={this.props.hideSignInBtn || false}/>
        <Container>{this.props.children}</Container>
        <Footer/>
      </div>
    )
  }

}
