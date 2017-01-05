import Link from 'next/prefetch'
import React from 'react'

export default() => (
  <footer>
    <hr/>
    <p><Link href="/">Home</Link> | &copy; {new Date().getYear() + 1900}</p>
  </footer>
)