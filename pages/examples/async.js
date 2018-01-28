/* global window */
import React from 'react'
import { Row, Col, Nav, NavItem, NavLink } from 'reactstrap'
import Page from '../../components/page'
import Layout from '../../components/layout'
import AsyncData from '../../components/async-data'

export default class extends Page {

  /* eslint no-undefined: "error" */
  static async getInitialProps({req}) {
    // Inherit standard props from the Page (i.e. with session data)
    let props = await super.getInitialProps({req})

    // If running on server, perform Async call
    if (typeof window === 'undefined') {
      try {
        props.posts = await AsyncData.getData()
      } catch (e) {
        props.error = "Unable to fetch AsyncData on server"
      }
    }

    return props
  }

  // Set posts on page load (only if prop is populated, i.e. running on server)
  constructor(props) {
    super(props)
    this.state = {
      posts: props.posts || null,
      error: props.error || null
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
      try {
        this.setState({
          posts: await AsyncData.getData(),
          error: null
        })
      } catch (e) {
        this.setState({
          error: "Unable to fetch AsyncData on client"
        })
      }
    }
  }

  render() {
    return (
      <Layout {...this.props}>
        <h1 className="display-2">Async Data</h1>
        <p>
          This page is an example of how to fetch and load data asynchronously
          so that pages load quickly and with without blocking rendering when
          possible, but in a way that still works in browsers that do not
          support JavaScript.
        </p>
        <Row>
          <Col xs="12" md="6">
            <h3>Server Side Rendering</h3>
            <p>
              When rendering on the server, this page will not be rendered until it
              has fetched the remote data. This ensures web crawlers and browsers that
              do not have JavaScript enabled will still see the full content of the page.
            </p>
          </Col>
          <Col xs="12" md="6">
            <h3>Client Side Rendering</h3>
            <p>
              When the page is rendered by browser that supports JavaScript it will
              load the page immediately, without data, and have the client fetch and
              insert the data while the page is loading.
            </p>
          </Col>
        </Row>
        <p>
          This page calls <a href="https://jsonplaceholder.typicode.com/">jsonplaceholder.typicode.com</a> using <a href="https://github.com/matthew-andrews/isomorphic-fetch">isomorphic-fetch</a>.
        </p>
        <hr/>
        <h2 className="display-4">Data from API</h2>
        <RenderPosts posts={this.state.posts} error={this.state.error}/>
      </Layout>
    )
  }

}

export class RenderPosts extends React.Component {
  render() {
    if (this.props.error) {
      // Display error if posts have fialed to load
      return <p><span className="font-weight-bold">Error loading posts:</span> {this.props.error}</p>
    } else if (!this.props.posts) {
      // Display place holder if posts are still loading (and no error)
      return <p><i>Loading content…</i></p>
    } else {
      // Display posts
      return <React.Fragment>
        {
          this.props.posts.map((post, i) => (
            <div key={i}>
              <span className="font-weight-bold">{post.title}</span>
              <p><i>{post.body}</i></p>
            </div>
          ))
        }
      </React.Fragment>
    }
  }
}