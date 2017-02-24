/**
 * The clock demo shows is an example of using react-redux
 * https://github.com/zeit/next.js/wiki/Redux-example
 *
 * The clock demo is comprised of
 * - pages/clock.js
 * - components/clock.js
 * - components/clock-store.js
 * - next-redux-wrapper
 */
// @FIXME The clock demo works locally, but cannot be deployed to now.sh!
// There is something going wrong while building on now.sh :-(
// I have removed next-redux-wrapper from package.json for now.
// See https://github.com/iaincollins/nextjs-starter/pull/14
/*
import React from 'react'
import withRedux from 'next-redux-wrapper'
import { initStore, startClock } from '../components/clock-store'
import Clock from '../components/clock'

class Counter extends React.Component {

  // propTypes() is checked by 'xo' linter
  static propTypes () {
    return {
      isServer: React.PropTypes.boolean.isRequired
    }
  }

  static getInitialProps ({ store, isServer }) {
    store.dispatch({ type: 'TICK', light: !isServer, ts: Date.now() })
    return { isServer }
  }

  componentDidMount () {
    this.timer = this.props.dispatch(startClock())
  }

  componentWillUnmount () {
    clearInterval(this.timer)
  }

  render () {
    const { lastUpdate, light } = this.props
    return (
      <Clock lastUpdate={lastUpdate} light={light} />
    )
  }

}

export default withRedux(initStore, state => state)(Counter)
*/