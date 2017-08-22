/**
 * An example with custom routing
 **/
import Link from 'next/link'
import React from 'react'
import Page from '../components/page'
import Layout from '../components/layout'
import { Card, Button, CardImg, CardTitle, CardText, CardColumns, CardSubtitle, CardBlock } from 'reactstrap'
 
export default class extends Page {

  static async getInitialProps({req, query}) {
    let props = await super.getInitialProps({req})
    props.path = '/route/' + query.id
    return props
  }

  render() {
    return (
      <Layout session={this.props.session}>
        <h1>Custom Routing</h1>
        <p className="lead">
          The current route is <strong>&quot;{ this.props.path }&quot;</strong>
        </p>
        <ul>
          <li><Link href="/routing/?id=example-one" as="/route/example-one"><a>Example Route One</a></Link></li>
          <li><Link href="/routing/?id=example-two" as="/route/example-two"><a>Example Route Two</a></Link></li>
        </ul>
        <h3>Next.js with Express</h3>
        <p>
          With Next.js routing is taken care of for you - requests for '/about' are automatically handled by 'pages/about.js' - 
          but this site uses Next.js together with Express, which is one way you can extend or override the default behaviour with custom routing.
        </p>
        <p>
          Using Next.js with Express also means you can easily take advantage of existing libraries written for Express 
          to add functionality to your site.
        </p>
        <p>
          In this project, we have a rule in "<strong>index.js</strong>" that tells Express that any requests for '/route/{'{'}anything{'}'}'
          should be handled by the template 'pages/routing.js' (which is this page):
        </p>
        <pre>{`express.get('/route/:id', (req, res) => {
  return app.render(req, res, '/routing', req.params)
})`}</pre>
        <p>
          The last route we have configured with Express is a fall back that says all other routes should be handled by Next.js:
        </p>
        <pre>{`express.all('*', (req, res) => {
  return handle(req, res)
})`}</pre>
        <p>
          Take a look at the source of pages/routing.js and index.js to see how
          to use &lt;Link&gt; with custom routes.
        </p>
        <p>
          If you want custom routing but don't need the other features offered by a framework like Express there are a
          number of simpler routing options available designed especially for use with Next.js.
        </p>
        <h4>Custom Error Pages</h4>
        <p>
          If you want to see how custom 404, 500 and other HTTP errors are handled, take a look at 'pages/_error.js'.
        </p>
      </Layout>
    )
  }

}