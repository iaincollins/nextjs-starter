import Link from 'next/prefetch'
import React from 'react'
import Page from '../../layouts/main'

export default class extends React.Component {
  render() {
    return (
      <Page>
        <h2>Link expired</h2>
        <p>The link you tried to use to sign in is no longer valid.</p>
        <p><Link href="/auth/signin">Request a new one to signin.</Link></p>
      </Page>
    )
  }
}
