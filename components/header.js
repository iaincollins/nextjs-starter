import Head from 'next/head'
import Link from 'next/prefetch'
import React from 'react'
import Menu from './menu'

export default class extends React.Component {

  render() {
    return(
      <header>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>{`
            body {
              margin: 20px 40px;
              font-family: sans-serif;
              color: #444;
              background-color: #eee;
              max-width: 950px;
              font-size: 16px;
              line-height: 22px;
            }
            hr {
              border: 0;
              height: 1px;
              background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));
              margin: 30px 0;
            }
            h1 {
              font-size: 48px;
              line-height: 52px;
              font-weight: 300;
              margin-bottom: 30px;
            }
            h1 a {
              color: #444;
              text-decoration: none;
            }
            h2 {
              font-size: 38px;
              line-height: 42px;
              font-weight: 300
            }
            h3 {
              font-size: 28px;
              line-height: 32px;
              font-weight: 300
            }
            ul {
              list-style: square;
            }
            input {
              font-size: 16px;
              line-height: 18px;
              border: 1px solid #222;
              background: #fff;
              padding: 10px 15px;
            }
            button {
              font-size: 16px;
              line-height: 18px;
              border: 2px solid #444;
              background-color: #444;
              color: #fff;
              padding: 10px 15px;
              cursor: pointer;
            }
            button:disabled {
              background-color: #666;
              color: #ccc;
              cursor: default;
            }
            .button {
              font-size: 16px;
              line-height: 18px;
              border: 2px solid #444;
              background-color: #fff;
              color: #444;
              padding: 10px 15px;
              text-decoration: none;
            }
            .button-oauth {
              display: block;
              width: 100%;
              max-width: 300px;
              margin-bottom: 10px;
              text-align: center;
            }
            .button-facebook {
              border-color: #3B5998;
              background-color: #3B5998;
              color: #fff;
            }
            .button-google {
              border-color: #d34836;
              background-color: #d34836;
              color: #fff;
            }
            .button-twitter {
              border-color: #00aced;
              background-color: #00aced;
              color: #fff;
            }
          `}</style>
        </Head>
        <h1><Link href="/"><a>Next.js 2.0 Starter Project</a></Link></h1>
        <Menu session={this.props.session}/>
        <hr/>
      </header>
    )
  }
  
}