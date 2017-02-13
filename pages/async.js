/* global window */
/**
 * This is a simple example of how to render data fetched asynchronously.
 *
 * It does not illustrate best practice and does not implement caching.
 */
import React from 'react'
import Page from '../components/page'
import Layout from '../components/layout'
import AsyncData from '../components/async-data'

export default class extends Page {

  /* eslint no-undefined: "error" */
  static async getInitialProps({req}) {
    // Inherit standard props from the Page (i.e. with session data)
    let props = await super.getInitialProps({req})

    // If running on server, perform Async call
    if (typeof window === 'undefined') {
      props.posts = await AsyncData.getData()
    }

    return props
  }

  // Set posts on page load (only if prop is populated, i.e. running on server)
  constructor(props) {
    super(props)
    this.state = {
      posts: props.posts || []
    }
  }

  // This is called after rendering, only on the client (not the server)
  // This allows us to render the page on the client without delaying rendering,
  // then load the data fetched via an async call in when we have it.
  async componentDidMount() {
    this.setState({
      posts: await AsyncData.getData()
    })
  }

  render() {
    let loadingMessage
    if (this.state.posts.length === 0) {
      loadingMessage = <p><i>Loading content from jsonplaceholder.typicode.com…</i></p>
    }

    return (
      <Layout session={this.props.session}>
        <h2>Asynchronous data fetching</h2>
        <p>
          This example illustrates how write a simple class to fetch data
          asynchronously (e.g. from an API or a database).
        </p>
        <p>
          The data below is JSON fetched from <a href="https://jsonplaceholder.typicode.com/">jsonplaceholder.typicode.com</a> with <a href="https://github.com/matthew-andrews/isomorphic-fetch">isomorphic-fetch</a>.
        </p>
        <p>
          When rendering on the server, this page will not be rendered until it
          has fetched the remote data. When rendering on the client, it will load
          the page without the remote data then update the page state and re-render when it has it.
        </p>
        <p>
          Note: You could just use the same async call in getInitialProps() on
          both the client and server, but using componentDidMount() when
          rendering on the client means the initial page render is much faster
          when navigating to this page from another link on the site.
        </p>
        <hr/>
        {loadingMessage}
        {
          this.state.posts.map((post, i) => (
            <div key={i}>
              <strong>{post.title}</strong>
              <p><i>{post.body}</i></p>
            </div>
          ))
        }
      </Layout>
    )
  }

}
