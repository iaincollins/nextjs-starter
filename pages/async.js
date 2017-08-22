/* global window */
/**
 * This is a simple example of how to render data fetched asynchronously.
 **/
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
      posts: props.posts || null
    }
  }

  // This is called after rendering, only on the client (not the server)
  // This allows us to render the page on the client without delaying rendering,
  // then load the data fetched via an async call in when we have it.
  async componentDidMount() {
    // Only render posts client side if they are not populate (if the page was 
    // rendered on the server, the state will be inherited from the server 
    // render by the client)
    if (this.state.posts === null) {
      this.setState({
        posts: await AsyncData.getData()
      })
    }
  }

  render() {
    return (
      <Layout session={this.props.session}>
        <h1>Asynchronous Loading</h1>
        <p>
          This page illustrates how write a simple class to fetch data
          asynchronously (e.g. from an API or a database) and create a page that
          avoids blocking rendering when possible but still works in browsers
          that do not support JavaScript.
        </p>
        <p>
          The data below is JSON fetched from <a href="https://jsonplaceholder.typicode.com/">jsonplaceholder.typicode.com</a> with <a href="https://github.com/matthew-andrews/isomorphic-fetch">isomorphic-fetch</a>.
        </p>
        <p>
          When rendering on the server, this page will not be rendered until it
          has fetched the remote data. This ensures web crawlers and browsers that
          do not have JavaScript will still see the full content of the page.
        </p>
        <p>
          When the page is rendered by browser that supports JavaScript it will
          load the page without the remote data and have the client fetch and
          insert the data while the page is loading.
        </p>
        <hr/>
        <RenderPosts posts={this.state.posts}/>
      </Layout>
    )
  }

}

export class RenderPosts extends React.Component {
  render() {
    if (this.props.posts === null) {
      return <p><i>Loading content from jsonplaceholder.typicode.com…</i></p>
    } else {
      return <div>
        {
          this.props.posts.map((post, i) => (
            <div key={i}>
              <strong>{post.title}</strong>
              <p><i>{post.body}</i></p>
            </div>
          ))
        }
      </div>
    }
  }
}