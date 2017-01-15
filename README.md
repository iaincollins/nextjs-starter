# Next.js 2.0 Starter Project

This is a starter [Next.js 2.0](https://zeit.co/blog/next) project that shows how to put together a simple website with server and client side rendering powered by Next.js, which uses React.

Like all Next.js projects it features automatic pre-fetching of templates with a ServiceWorker, renders pages both client and server side and live reloading in development. It also shows how to use features new in Next.js version 2.0 like integration with the Express and custom route handling.

There are practical examples with header, footer and layout files, how to add page-specific CSS and JavaScript and header elements, how to write code that does asynchronous data fetching, how to write different logic for fetching data on the client and server if you need to, as well as some more advanced usage, including email based authentication (with secure sessions and CSRF protection).

All examples work client and server site, with and without a JavaScript capable browser.

## Demo

You can try it out at https://upsum-mmxqbvnbzy.now.sh 

The demo is hosted on Next.js creators [Ziet's](https://zeit.co) cloud platform.

## Screenshot 

<img width="1024" alt="Example screenshot showing what to expect" src="https://cloud.githubusercontent.com/assets/595695/21877741/1058e502-d885-11e6-91e9-51715b5ca1ab.png">

## Running locally in development mode

To get started in development mode, just clone the repository and run:

    npm install
    npm run dev

## Building and deploying in production

If you wanted to run this site in production run:

    npm install
    npm build
    npm start

You should run the the build step again any time you make changes to pages or
components.
