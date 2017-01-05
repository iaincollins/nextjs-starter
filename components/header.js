import Head from 'next/head'
import Link from 'next/prefetch'
import React from 'react'

export default() => (
  <header>
    <Head>
      <style>{`
        body {
          margin: 10px 40px;
          font-family: sans-serif;
          color: #444;
          background-color: #eee;
          max-width: 950px;
        }
        hr {
          border: 0;
          height: 1px;
          background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));
          margin: 20px 0;
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
        ul {
          list-style: square;
        }
      `}</style>
    </Head>
    <h1><Link href="/">Next.js 2.0 Starter Project</Link></h1>
  </header>
)