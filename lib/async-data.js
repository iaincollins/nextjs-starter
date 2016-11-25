/**
 * This is a very simple class that returns data asynchronously.
 *
 * This code runs on both the client and server.
 * 
 * You could alternativly put the logic to detect if code is being run on the 
 * server or on the client inside the page template.
 */

import 'isomorphic-fetch'
export default class AsyncData {
  
  async getData() {
    
    if (typeof window === 'undefined') {
      // Being run on the server
    } else {
      // Being run in a browser
    }

    let res = await fetch('https://jsonplaceholder.typicode.com/posts')
    let data = await res.json()
    return data;
  }
  
}
