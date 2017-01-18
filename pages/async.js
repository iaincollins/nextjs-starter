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
  
  static async getInitialProps({ req }) {
    let props = await super.getInitialProps({ req })
    props.posts = await AsyncData.getData()
    return props
  }

  render() {
    return (
      <Layout session={this.props.session}>
        <h2>Asynchronous data fetching</h2>
        <p>
          This example illustrates how write a simple class to fetch data
          asynchronously (e.g. from an API or a database).
        </p>
        <p>
          The data below is JSON fetched from <a href="https://jsonplaceholder.typicode.com/">jsonplaceholder.typicode.com</a> and renders both client and server side, using <a href="https://github.com/matthew-andrews/isomorphic-fetch">isomorphic-fetch</a>.
        </p>
        <p>
          Note that this page will not be rendered until the data has been
          fetched. It does not include any advanced error handling.
        </p>
        <hr/>
        {
          this.props.posts.map((post, i) => (
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
