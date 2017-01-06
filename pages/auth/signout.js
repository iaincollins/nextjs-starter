import React from 'react'
import Page from '../../layouts/main'
import 'isomorphic-fetch'

export default class extends React.Component {
  render() {
    return (
      <Page>
        <h2>Signed Out</h2>
        <p>You have been signed out.</p>
      </Page>
    )
  }
}