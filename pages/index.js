/**
 * The index page uses a layout page that pulls in header and footer components
 */
import Link from 'next/link'
import React from 'react'
import Page from '../components/page'
import Layout from '../components/layout'
import { Row, Col, Nav, NavItem, NavLink } from 'reactstrap'

export default class extends Page {

  render() {
    return (
      <Layout session={this.props.session}>
        <Row>
          <Col md="9" xs="12">
            <h1>About This Project</h1>
            <p className="lead">
              This is a <a href="https://zeit.co/blog/next">Next.js 2.0</a> project
              that incorporates <a href="https://expressjs.com">Express</a> for Node.js and <a href="https://reactstrap.github.io/">reactstrap</a> (Boostrap 4 components for React) and incorporates account registration and sign-in system.
            </p>
            <p>
              <strong>This project exists to make it easier to get started with creating Universal websites in React.</strong>
            </p>
            <p>
              You are <a href="https://github.com/iaincollins/nextjs-starter">invited to copy it</a> and use it as a base for your own projects or on hackdays.
            </p>
            <p>
              Contributions to improve it, including to add useful examples or to simplify things are very welcome.
              It is inspired by the <a href="https://github.com/sahat/hackathon-starter">Hackathon Starter Kit</a>, which doesn't use React but is an excellent reference project.
            </p>
            <h3>Quick Start</h3>
            <p className="lead">
              Some familiarity with JavaScript, Node.js and NPM is assumed.
            </p>
            <p>
              Once you have <a href="https://github.com/iaincollins/nextjs-starter">cloned the repository</a> (or just <a href="https://github.com/iaincollins/nextjs-starter/archive/master.zip">downloaded the source from GitHub</a>), you can install the required modules and run it with the following commands:
            </p>
              <pre>
{`> npm install
> npm run dev`}
              </pre>
            <p>
              If you want to try deploying your new website to the cloud, the simplest way is to install the the 'now' package (from <a href="https://zeit.co">Zeit</a>, who are also the creators of Next.js). It's free for open source projects:
            </p>
              <pre>
{`> npm install -g now
> now`}
              </pre>
            <p>
              For more information on how to build and deploy see <a href="https://github.com/iaincollins/nextjs-starter/blob/master/README.md">README.md</a>
            </p>
            <p>
              For tips on configuring authentication see <a href="https://github.com/iaincollins/nextjs-starter/blob/master/AUTHENTICATION.md">AUTHENTICATION.md</a>
            </p>
            <h3>More Details</h3>
            <p>
              Like all Next.js projects it features automatic pre-fetching of templates, renders pages both client and server side, and supports live reloading of JavaScript, CSS and JSX templates in development mode.
            </p>
            <p>
              There are seperate header, footer and layout files,
              examples of page-specific CSS and JavaScript and header elements,
              example code that does asynchronous data fetching that runs on both client and server.
            </p>
            <p>
              There is session support (with CSRF and XSS protection), email
              based sign-in and integrates with Passport to support signing in
              with Facebook, Google, Twitter and other sites that support oAuth.
            </p>
            <p>
              All functionality works both client and server side - including
              without JavaScript support in the browser.
            </p>
          </Col>
          <Col md="3" xs="12">
            <h4>Pages</h4>
            <Nav vertical>
              <NavItem>
                <Link prefetch href="/auth/signin"><NavLink href="/auth/signin">Authentication</NavLink></Link>
              </NavItem>
              <NavItem>
                <Link prefetch  href="/routing/?id=example" as="/route/example"><NavLink href="/routing/?id=example">Route Handling</NavLink></Link>
              </NavItem>
              <NavItem>
                <Link prefetch href="/css"><NavLink href="/css">CSS &amp; SCSS</NavLink></Link>
              </NavItem>
              <NavItem>
                <Link prefetch href="/async"><NavLink href="/async">Fetching Data Asynchronously</NavLink></Link>
              </NavItem>
            </Nav>
          </Col>
        </Row>
      </Layout>
    )
  }

}
