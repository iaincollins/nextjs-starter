/**
 * The clock demo shows is an example of using react-redux
 * https://github.com/zeit/next.js/wiki/Redux-example
 *
 * The clock demo is comprised of
 * - pages/clock.js
 * - components/clock.js
 * - lib/clock-store.js
 */
import React from 'react'
import {Provider} from 'react-redux'
import {reducer, initStore, startClock} from '../components/clock-store'
import Clock from '../components/clock'

export default class Counter extends React.Component {

  // propTypes() is checked by 'xo' linter
  static propTypes() {
    return {
      initialState: React.PropTypes.object.isRequired,
      isServer: React.PropTypes.boolean.isRequired
    }
  }

  static getInitialProps({req}) {
    const isServer = Boolean(req)
    const store = initStore(reducer, null, isServer)
    store.dispatch({type: 'TICK', ts: Date.now()})
    return {initialState: store.getState(), isServer}
  }

  constructor(props) {
    super(props)
    this.store = initStore(reducer, props.initialState, props.isServer)
  }

  componentDidMount() {
    this.timer = this.store.dispatch(startClock())
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  render() {
    return (
      <Provider store={this.store}>
        <Clock/>
      </Provider>
    )
  }

}
