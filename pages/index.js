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
        <h1>Next.js Starter Project</h1>
        <p className="lead">
          This is a <a href="https://zeit.co/blog/next">Next.js</a> project
          that uses <a href="https://expressjs.com">Express</a> and <a href="https://reactstrap.github.io/">reactstrap</a> (Bootstrap 4 for React)
        </p>
        <p>
          This starter project includes an authentication system that
          supports email and oAuth sign-in (Facebook, Google, Twitter, etc),
          isomorphic rendering of React pages (aka 'universal rendering' - 
          rendering React pages server side and in the browser) and shows how to
          do things like add Cross Site Request Forgery, use HTTP Only Cookies
          for sessions, leverage SASS for CSS and use layout templates with React.
        </p>
        <p>
          This project is intended to take some of the pain out of getting
          started with a functional React application. While Next.js makes creating
          simple React apps easy, this project shows you how to go further and
          do some fo the things you might want have when creating a more complex web app.
        </p>
        <h2>Getting Started</h2>
        <p>
         You will need Node.js installed. Existing familiarity with JavaScript, Node.js and NPM will be helpful, but many people find using a starter project is also a great way to get familiar with programming languages.
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
        <h2>More Information</h2>
        <p>
          <strong>This is a community project and is not associated with Zeit or Next.js</strong>.
        </p>
        <p>
          Thanks to all the contributors on GitHub, on the Zeit Community Slack and developers at Zeit.
        </p>  
        <p>
          This project exists to make it easier to get started with creating websites in React with Next.js.
          You are <a href="https://github.com/iaincollins/nextjs-starter">invited to copy this project</a> and
          use it as a base for your own projects or just to use it as reference.
        </p>
        <p>
          Contributions to improve this project to make it more useful (or simpler) are welcome.
          It is inspired by the <a href="https://github.com/sahat/hackathon-starter">Hackathon Starter Kit</a>, which doesn't use Next.js or React but is an excellent Node.js reference project, 
          with examples of how to use many common APIs with Node.js.
        </p>
        <p>
          Note: This project currently uses Next.js 3.x because the recently release of Next.js 4.x uses React 16 and is incompatible with React 15, which is used by Reactstrap.
          This will be resolved in a future update.
        </p>
        <p>
          Further documentation and examples with some tips on security and performance are planned.
        </p>
      </Layout>
    )
  }

}