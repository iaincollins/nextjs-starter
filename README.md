# Next.js 2.0 Starter Project

This is a starter [Next.js 2.0](https://zeit.co/blog/next) project that shows how to put together a website with server and client side rendering powered by Next.js, which uses React.

Like all Next.js projects it features automatic pre-fetching of templates with a ServiceWorker, renders pages both client and server side and live reloading in development. It also shows how to use features new in Next.js version 2.0 like integration with Express for custom route handling.

There are practical examples with header, footer and layout files, how to add page-specific CSS and JavaScript and header elements, how to write code that does asynchronous data fetching, how to write different logic for fetching data on the client and server if you need to.

It includes session support (with CSRF and XSS protection), email based sign-in sytem and integrates with Passport to support signing in with Facebook, Google, Twitter and other sites that support oAuth.

All functionality works both client and server site - including without JavaScript support in the browser.

## Demo

You can try it out at https://nextjs-starter.now.sh

The demo is hosted on Next.js creators [Zeit's](https://zeit.co) cloud platform.

## Running locally in development mode

To get started in development mode, just clone the repository and run:

    npm install
    npm run dev

## Building and deploying in production

If you wanted to run this site in production run:

    npm install
    npm run build
    npm start

You should run the the build step again any time you make changes to pages or
components.

## Deploying to the cloud

To deploy on [Zeit's](https://zeit.co) cloud platform `now` just install it, clone this repository and run `now` in the working directory:

    npm install -g now
    now

If you configure a .env file (see [.env.default](https://github.com/iaincollins/nextjs-starter/blob/master/.env.default) for an example of the options supported) `now` will include it when deploying if you use the -E option to deploy:

    now -E
