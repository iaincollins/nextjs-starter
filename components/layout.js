import React from 'react'
import Header from './header'
import Footer from './footer'
import Session from './session'

export default class extends React.Component {

  render() {
    return(
      <div>
        <Header session={this.props.session}/>
          { this.props.children }
        <Footer />
      </div>
    )
  }
  
}