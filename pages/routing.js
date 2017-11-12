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
        <h2>Example Custom Routes</h2>
        <p>
          Both of these routes load the same page, but have different URLs.
        </p>
        <ul>
          <li><Link href="/routing/?id=example-one" as="/route/example-one"><a >Example Route One</a></Link></li>
          <li><Link href="/routing/?id=example-two" as="/route/example-two"><a>Example Route Two</a></Link></li>
        </ul>
        <p>
          The current route is <strong>&quot;{ this.props.path }&quot;</strong>.
        </p>
        <h2>Using Next.js with Express</h2>
        <p>
          With Next.js routing is taken care of for you. For example, a request
          for "<strong>/about</strong>" would be automatically handled by a page
          in your project called "<strong>pages/about.js</strong>".
        </p>
        <p>
          This project uses Next.js together with Express to extend or override
          the default behaviour and allow for addtional custom routing. You can
          also use other middleware to handle custom routes.
        </p>
        <p>
          Using Next.js with Express also means you can easily take advantage of
          existing libraries written for Express to add functionality to your
          site.
        </p>
        <p>
          In this project, we have a rule in "<strong>index.js</strong>" that
          tells Express that any requests for "<strong>/route/{'{'}anything{'}'}</strong>"
          should be handled by the template "<strong>pages/routing.js</strong>"
          (which is this page):
        </p>
        <pre>{`express.get('/route/:id', (req, res) => {
  return app.render(req, res, '/routing', req.params)
})`}</pre>
        <p>
          The last route we have configured with Express is a fall back that
          says all other routes should be handled by the built in Next.js router:
        </p>
        <pre>{`express.all('*', (req, res) => {
  return handle(req, res)
})`}</pre>
        <p>
          Take a look at the source of "<strong>pages/routing.js</strong>" and "<strong>index.js</strong>" to see how
          to use &lt;Link&gt; with custom routes.
        </p>
        <p>
          If you just want to use custom routes without the other features offered by a framework like Express there are a
          number of simpler routing options available designed especially for use with Next.js.
        </p>
        <h2>Custom Error Pages</h2>
        <p>
          If you want to see how custom 404, 500 and other HTTP errors are handled take a look at "<strong>pages/_error.js</strong>".
        </p>
      </Layout>
    )
  }

}