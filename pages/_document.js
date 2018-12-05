import Document, { Head, Main, NextScript } from 'next/document'

export default class extends Document {
  render() {
    /**
    * Here we use _document.js to add a "lang" propery to the HTML object if
    * one is set on the page.
    **/
    return (
      <html lang={this.props.__NEXT_DATA__.props.pageProps.lang || 'en'}>
        <Head>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}