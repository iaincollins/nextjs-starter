import Link from 'next/link'
import React from 'react'
import Package from '../package'

export default() => (
  <footer>
    <div className="container">
      <hr/>
      <p>
        <Link prefetch href="/"><a><strong>Home</strong></a></Link>
        &nbsp;|&nbsp;
        <Link href="https://github.com/iaincollins/nextjs-starter"><a>nextjs-starter {Package.version}</a></Link>
        &nbsp;|&nbsp;
        <Link href="https://github.com/zeit/next.js"><a>nextjs {Package.dependencies.next}</a></Link>
        &nbsp;| &copy; {new Date().getYear() + 1900}
      </p>
    </div>
  </footer>
)
