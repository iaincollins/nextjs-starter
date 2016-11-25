import React from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default() => (
  <header>
    <Head>
      <style>{`
        body {
          margin: 10px 20px;
          font-family: sans-serif;
          color: #444;
          background-color: #eee;
        }
        hr {
          border: 0;
          height: 1px;
          background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));
        }
        h1 {
          margin-bottom: 30px;
        }
        .home {
          position: relative;
          top: -5px;
          border-radius: 50px;
          padding: 0px 12px 8px 12px;
          color: #eee;
          background: #444;
          text-decoration: none;
        }
        @-moz-document url-prefix() {
          .home { 
            padding: 6px 12px 8px 12px;
          }
        }
      `}</style>
    </Head>
    <h1><a href="/" className="home">&#8962;</a> Next.js Starter Project</h1>
  </header>
)