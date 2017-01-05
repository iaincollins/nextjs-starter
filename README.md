# Next.js Starter

This is a starter Next.js 2.0 project that shows how to put together a simple website with server and client side rendering powered by Next.js, which uses React.

Like all Next.js projects it features automatic pre-fetching of templates with a ServiceWorker, renders pages both client and server side and live reloading in development.

This example shows how to use header, footer and layout files, how to include CSS and JavaScript on specific pages, how to write code that does  asynchronous data fetching (including how to write different routines for client and server rendering, if you wish) as well as some more advanced usage.

It includes new features exclusive to Next.js verion 2.0 like integration with the Express framework, which allows you to have custom route handling and other endpoints.

## Running locally

To get started in development mode, just clone the repository and run:

    npm install
    npm run dev

## Building and deploying

If you wanted to run this site in production, you should build and run it:

    npm install
    npm run build
    npm start

Be sure to run `npm run build` each time you deploy changes in production.