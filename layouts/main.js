import React from 'react'
import Header from '../components/header'
import Footer from '../components/footer'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      session: props.session || null
    }
  }
  
  render() {
    return(
      <div>
        <Header session={this.state.session} />
        { this.props.children }
        <Footer />
      </div>
    )
  }
}