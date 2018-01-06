import Document, { Head, Main, NextScript } from 'next/document'
import flush from 'styled-jsx/server'

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const { html, head, errorHtml, chunks } = renderPage()
    const styles = flush()
    return { html, head, errorHtml, chunks, styles }
  }

  render() {
    /**
    * Here we use _document.js to add a "lang" propery to the HTML object if
    * one is set on the page.
    **/
    return (
      <html lang={this.props.__NEXT_DATA__.props.lang || 'en'}>
        <Head>
        </Head>
        <body>
          {this.props.customValue}
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}