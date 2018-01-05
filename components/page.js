import React from 'react'
import Session from './session'

export default class extends React.Component {
  // Expose session to all pages
  static async getInitialProps({req}) {
    return {
      session: await Session.getSession({req})
    }
  }
}
