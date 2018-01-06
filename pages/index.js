import Link from 'next/link'
import React from 'react'
import { Container, Row, Col, Jumbotron, ListGroup, ListGroupItem } from 'reactstrap'
import Page from '../components/page'
import Layout from '../components/layout'

export default class extends Page {
  render() {
    return (
      <Layout {...this.props} navmenu={false} container={false}>
        <Jumbotron className="splash text-light rounded-0" style={{
          background: '#EA519C url(/static/images/jumbotron-background.png)',
          backgroundSize: 'cover'
          }}>
          <Container className="mt-5 mb-5">
            <h1 className="display-2 splash-text" style={{fontWeight: 500}}>
              <span className="mr-3">▲</span>
              <br className="v-block d-md-none"/>
              Next.js Starter Project
            </h1>
            <p className="lead splash-text">
              An example React project built with Next.js
            </p>
            <p className="lead splash-text">
              A reference and template for creating new projects.
            </p>
            <style jsx>{`
              .display-2  {
                font-size: 4em;
              }
              .lead {
                font-size: 2em;
              }
              @media (max-width: 767px) {
                .display-2 {
                  font-size: 3em;
                  margin-bottom: 1em;
                }
                .lead {
                  font-size: 1.5em;
                }
              }
            `}</style>
          </Container>
        </Jumbotron>
        <Container className="pb-5">
          <p className="text-muted">
            * This project is not associated with Next.js or Zeit.
          </p>
          <h2 className="text-center display-4 mt-5 mb-2">Included</h2>
          <Row className="pb-5">
            <Col xs="12" sm="4" className="pt-5">
              <h3 className="text-center mb-4">Sessions / Security</h3>
              <ListGroup>
                <ListGroupItem><a className="text-dark" href="https://expressjs.com">Express</a></ListGroupItem>
                <ListGroupItem><a className="text-dark" href="https://www.npmjs.com/package/express-sessions">Express Sessions</a></ListGroupItem>
                <ListGroupItem><a className="text-dark" href="https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)">CSRF Tokens</a></ListGroupItem>
                <ListGroupItem><a className="text-dark" href="https://www.owasp.org/index.php/HttpOnly">HTTP Only Cookies</a></ListGroupItem>
              </ListGroup>
            </Col>
            <Col xs="12" sm="4" className="pt-5">
              <h3 className="text-center mb-4">Authentication</h3>
              <ListGroup>
                <ListGroupItem><a className="text-dark" href="http://www.passportjs.org">Passport</a></ListGroupItem>
                <ListGroupItem><a className="text-dark" href="http://www.mongodb.om">MongoDB</a></ListGroupItem>
                <ListGroupItem><Link href="/examples/authentication"><a className="text-dark">Email Sign in</a></Link></ListGroupItem>
                <ListGroupItem><Link href="/examples/authentication"><a className="text-dark">Facebook, Google, Twitter</a></Link></ListGroupItem>
              </ListGroup>
            </Col>
            <Col xs="12" sm="4" className="pt-5">
              <h4 className="text-center mb-4">CSS / SCSS</h4>
              <ListGroup>
                <ListGroupItem><a className="text-dark" href="https://getbootstrap.com">Bootstrap 4.0</a></ListGroupItem>
                <ListGroupItem><a className="text-dark" href="http://reactstrap.github.io/">Reactstrap</a></ListGroupItem>
                <ListGroupItem><a className="text-dark" href="https://ionicframework.com/docs/ionicons/">Ionicons</a></ListGroupItem>
                <ListGroupItem><a className="text-dark" href="http://sass-lang.com/">SASS for CSS</a></ListGroupItem>
              </ListGroup>
            </Col>
          </Row>
          <h2 className="text-center display-4 mt-2 mb-5">Getting Started</h2>
          <p>
            <a href="https://github.com/zeit/next.js">Next.js</a> from <a href="https://zeit.co">Zeit</a> makes creating
            websites with React easy. 
          </p>
          <p>
            This project shows you how to extend a Next.js
            site with more complex behaviour.
          </p>
          <pre>
{`git clone https://github.com/iaincollins/nextjs-starter.git
npm install
npm run dev`}
          </pre>
          <p>
            The simplest way to deploy it to the cloud is with with 'now', which is from Zeit, the creators of Next.js framework.
          </p>
            <pre>
{`npm install -g now
now`}
            </pre>
          <p>
            For more information on how to build and deploy see <a href="https://github.com/iaincollins/nextjs-starter/blob/master/README.md">README.md</a>
          </p>
          <p>
            For tips on configuring authentication see <a href="https://github.com/iaincollins/nextjs-starter/blob/master/AUTHENTICATION.md">AUTHENTICATION.md</a>
          </p>
        </Container>
      </Layout>
    )
  }
}