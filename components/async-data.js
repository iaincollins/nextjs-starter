/**
 * This is a very simple class that returns data asynchronously.
 *
 * This code runs on both the server and in the browser.
 *
 * You could also put the logic to detect if code is being run on
 * the server or in the browser inside the page template.
 * 
 * We use 'isomorphic-fetch' as it runs both server and client side.
 */
import fetch from 'isomorphic-fetch'

export default class {
  static async getData() {
    const res = await fetch('//jsonplaceholder.typicode.com/posts')
    const data = await res.json()
    return data
  }
}
