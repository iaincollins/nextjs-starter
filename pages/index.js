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
          <Col md="3" xs="12">
            <h4>Pages</h4>
            <Nav vertical>
              <NavItem>
                <Link prefetch href="/auth/signin"><NavLink href="/auth/signin">Authentication</NavLink></Link>
              </NavItem>
              <NavItem>
                <Link prefetch href="/css"><NavLink href="/css">CSS &amp; SCSS</NavLink></Link>
              </NavItem>
              <NavItem>
                <Link prefetch href="/async"><NavLink href="/async">Asynchronous Loading</NavLink></Link>
              </NavItem>
              <NavItem>
                <Link prefetch href="/routing/?id=example" as="/route/example"><NavLink href="/route/example">Custom Routing</NavLink></Link>
              </NavItem>
            </Nav>
          </Col>
          <Col md="9" xs="12">
            <h1>About this project</h1>
            <p className="lead">
              This is a <a href="https://zeit.co/blog/next">Next.js</a> project
              that uses <a href="https://expressjs.com">Express</a> and <a href="https://reactstrap.github.io/">reactstrap</a> (Bootstrap 4 components for React)
              and includes a sign-up / sign-in system.
            </p>
            <h3>Getting started</h3>
            <p>
             You will need Node.js installed. Some familiarity with JavaScript, Node.js and NPM will be helpful.
            </p>
            <p>
              Once you have <a href="https://github.com/iaincollins/nextjs-starter">cloned the repository</a> (or just <a href="https://github.com/iaincollins/nextjs-starter/archive/master.zip">downloaded the source from GitHub</a>), you can install the required modules and run it with the following commands:
            </p>
              <pre>
{`> npm install
> npm run dev`}
              </pre>
            <p>
              If you want to try deploying your new website to the cloud, the simplest way is to install the the 'now' package (from <a href="https://zeit.co">Zeit</a>, who are also the creators of Next.js).
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
            <h3>Why this project exists</h3>
            <p>
              This project exists to make it easier to get started with creating websites in React with Next.js.
              You are <a href="https://github.com/iaincollins/nextjs-starter">invited to copy this project</a> and
              use it as a base for your own projects, or you may want to just use it as reference.
            </p>
            <p>
              All functionality works both client and server side - including without JavaScript support in the browser.
            </p>
            <p>
              Contributions to improve this project to make it more useful (or simpler) are welcome.
              It is inspired by the <a href="https://github.com/sahat/hackathon-starter">Hackathon Starter Kit</a>, which doesn't use Next.js or React but is an excellent Node.js reference project.
            </p>
          </Col>
        </Row>
      </Layout>
    )
  }

}
