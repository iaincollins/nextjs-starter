import React from 'react'
import Page from '../../layouts/main'
import 'isomorphic-fetch'

export default class extends React.Component {
  render() {
    return (
      <Page>
        <h2>Check Your Email</h2>
        <p>You have been sent an email with a login link to log in</p>
      </Page>
    )
  }
}
