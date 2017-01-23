import Link from 'next/prefetch'
import React from 'react'

export default() => (
  <footer>
    <hr/>
    <p><Link href="/">Home</Link> | &copy; {new Date().getYear() + 1900} | <Link href="https://github.com/iaincollins/nextjs-starter">View source on GitHub</Link></p>
  </footer>
)