import Link from 'next/link'
import React from 'react'
import Page from '../components/page'
import Layout from '../components/layout'
import { Row, Col, Nav, NavItem, NavLink } from 'reactstrap'

export default class extends Page {

  render() {
    return (
      <Layout {...this.props}>
        <h1>Next.js Starter Project</h1>
        <p style={{fontSize: '1.8em', fontWeight: 300}}>
          This project is intended to take some of the pain out of getting
          started creating a full featured React application.
        </p>
        <p className="lead">
          <a href="https://zeit.co/blog/next">Next.js</a> makes creating
          simple React apps easy, this project shows you how to go further and
          extend a Next.js app with components and frameworks found in complex web apps.
        </p>
        <p>
          Included are examples of how to use Next.js with other libraries such as
          the <a href="https://expressjs.com">Express</a> web server framework
          and the <a href="http://www.passportjs.org">Passport</a> framework for 
          authentication via email and oAuth (Facebook, Google, Twitter…).
        </p>
        <p>
          Other features are <a href="https://www.npmjs.com/package/express-sessions">Express Session</a> support
          with <a href="https://www.owasp.org/index.php/HttpOnly">HTTP Only Cookies</a> for XSS protection,
          integration with <a href="https://www.mongodb.com">MongoDB</a> to store
          user accounts, <a href="https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)">Cross Site Request Forgery protection</a> with
          CSRF tokens, <a href="https://getbootstrap.com">Bootstrap v4.0</a>, <a href="http://sass-lang.com/">SASS for CSS</a> and
          an example of how to use configurable layout templates with React pages.
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
          There are many different ways to achieve similar functionality to that included in this 
          project, such as alternative lightweight web frameworks, using encrypted JWT
          cookies for authentication instead of session based authentication,
          CSRF protection that doesn't use sessions (e.g. 'double cookie' method)
          and more sophisticated ways of handling SASS/CSS and templating. 
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