import Link from 'next/link'
import SyntaxHighlighter from 'react-syntax-highlighter/prism'
import { atomDark as SyntaxHighlighterTheme } from 'react-syntax-highlighter/styles/prism'
import { Card, Button, CardImg, CardTitle, CardText, CardColumns, CardSubtitle, CardBlock } from 'reactstrap'
import Page from '../../components/page'
import Layout from '../../components/layout'
 
export default class extends Page {
  render() {
    return (
      <Layout {...this.props}>
        <h1 className="display-2">Custom Routing</h1>
        <p>
          With Next.js routing is taken care of for you. For example, a request
          for <strong>/about</strong> is automatically handled by the page
          at <a href="https://github.com/iaincollins/nextjs-starter/blob/master/pages/about.js">pages/about.js</a>.
        </p>
        <p>
          This project uses Next.js together with Express to extend or override
          the default behaviour to add custom routes. Both of these routes load the same page, but have different URLs.
        </p>
        <ul>
          <li><Link href="/examples/routing/?id=example-one" as="/custom-route/example-one"><a >Example Route One</a></Link></li>
          <li><Link href="/examples/routing/?id=example-two" as="/custom-route/example-two"><a>Example Route Two</a></Link></li>
        </ul>
        <p>
          We have a rule in <a href="https://github.com/iaincollins/nextjs-starter/blob/master/index.js">index.js</a> that
          tells Express that any requests for <strong>/custom-route/{'{'}anything{'}'}</strong> should
          be handled by the template <a href="https://github.com/iaincollins/nextjs-starter/blob/master/pages/examples/routing.js">pages/examples/routing.js</a>, which is this page.
        </p>
        <SyntaxHighlighter style={SyntaxHighlighterTheme} language="javascript">
{`express.get('/custom-route/:id', (req, res) => {
  return app.render(req, res, '/examples/routing')
})`}</SyntaxHighlighter>
        <p>
         The last route we configure in Express is a fallback that says all
         other routes should be handled by the built in Next.js router by
         default:
        </p>
        <SyntaxHighlighter style={SyntaxHighlighterTheme} language="javascript">
{`express.all('*', (req, res) => {
  let nextRequestHandler = app.getRequestHandler()
  return nextRequestHandler(req, res)
})`}</SyntaxHighlighter>
        <p>
          Take a look at the source of <a href="https://github.com/iaincollins/nextjs-starter/blob/master/pages/examples/routing.js">this page</a> and <a href="https://github.com/iaincollins/nextjs-starter/blob/master/index.js">index.js</a> to see how
          to use &lt;Link&gt; with custom routes.
        </p>
        <h2>Alternative ways of handling routes</h2>
        <p>
          If you just want to use custom routes without the other features offered by a framework like Express, there are a
          number of simpler routing options such as <a href="https://www.npmjs.com/package/next-routes">next-routes</a> designed specifically for use with Next.js.
        </p>
        <h2>Custom error pages</h2>
        <p>
          If you want to see how custom 404, 500 and other HTTP errors are handled take a look at <a href="https://github.com/iaincollins/nextjs-starter/blob/master/pages/_error.js">pages/_error.js</a>.
        </p>
      </Layout>
    )
  }

}