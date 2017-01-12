# Next.js 2.0 Starter Project

This is a starter Next.js 2.0 project that shows how to put together a simple website with server and client side rendering powered by Next.js, which uses React.

Like all Next.js projects it features automatic pre-fetching of templates with a ServiceWorker, renders pages both client and server side and live reloading in development. It also shows how to use features new in Next.js version 2.0 like integration with the Express and custom route handling.

There are practical examples with header, footer and layout files, how to add page-specific CSS and JavaScript and header elements, how to write code that does asynchronous data fetching, how to write different logic for fetching data on the client and server if you need to, as well as some more advanced usage, including an email based authentication (with sessions and CSRF protection).

All examples work client and server site, with and without a JavaScript capable browser.

## Screenshot 

<img width="1018" alt="screen shot 2017-01-08 at 00 43 25" src="https://cloud.githubusercontent.com/assets/595695/21746398/a0fb2a86-d53b-11e6-8502-178828123560.png">

## Running locally in development mode

To get started in development mode, just clone the repository and run:

    npm install
    npm run dev

## Building and deploying in production

If you wanted to run this site in production run:

    npm install
    npm start

NB: In this project 'npm start' is configured in package.json to also trigger 'next build' automatically (to ensure assets are pre-built); the build step can take a few seconds to complete.