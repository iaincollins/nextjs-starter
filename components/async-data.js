/**
 * This is a very simple class that returns data asynchronously.
 *
 * This code runs on both the server and in the browser.
 *
 * You could also put the logic to detect if code is being run on
 * the server or in the browser inside the page template.
 */
import fetch from 'isomorphic-fetch'

export default class {

  static async getData() {
    // This version of fetch runs in browsers as well as sever side
    let res = await fetch('//jsonplaceholder.typicode.com/posts')
    let data = await res.json()
    return data
  }

}
