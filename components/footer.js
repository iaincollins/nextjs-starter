import React from 'react'
import Link from 'next/link'

export default() => (
  <footer>
    <hr/>
    <p><Link href="/">Home</Link> | &copy; {new Date().getYear() + 1900}</p>
  </footer>
)