[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
# Next.js 2.0 Starter Project

This is a starter [Next.js 2.0](https://zeit.co/blog/next) project that shows how to put together a website with server and client side rendering powered by Next.js, which uses React.

Like all Next.js projects it features automatic pre-fetching of templates with a ServiceWorker, renders pages both client and server side and live reloading in development. It also shows how to use features new in Next.js version 2.0 like integration with Express for custom route handling.

There are practical examples with header, footer and layout files, how to add page-specific CSS and JavaScript and header elements, how to write code that does asynchronous data fetching, how to write different logic for fetching data on the client and server if you need to.

It includes session support (with CSRF and XSS protection), email based sign-in sytem and integrates with Passport to support signing in with Facebook, Google, Twitter and other sites that support oAuth.

All functionality works both client and server side - including without JavaScript support in the browser.

*Important!* Please upgrade to version 2.8 or newer as this resolves all known cross browser compatibility issues, including session behaviour with Internet Explorer.

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

Note: If you are already running a webserver on port 80 (e.g. Macs usually have the Apache webserver running on port 80) you can still start the example in production mode by passing a different port as an Environment Variable when starting (e.g. `PORT=3000 npm start`).

## Deploying to the cloud with now.sh

To deploy on [Zeit's](https://zeit.co) cloud platform `now` just install it, clone this repository and run `now` in the working directory:

    npm install -g now
    now

If you configure a .env file (see [.env.default](https://github.com/iaincollins/nextjs-starter/blob/master/.env.default) for an example of the options supported) `now` will include it when deploying if you use the -E option to deploy:

    now -E

## Debugging

If you configure a .env file with value for *LOGS_SECRET* and deploy with `now -E` you can use [now-logs](https://github.com/berzniz/now-logs) to view logs remotely.

    npm install -g now-logs
    now-logs my-secret-value

## Running tests

Style formatting is enforced with the JavaScript style linter [xo](https://github.com/sindresorhus/xo) which is invoked when running `npm test`.

Reflecting how most examples of Next.js are written, in  `package.json` we have configured 'xo' to tell it this project uses spaces (not tabs) in both JavaScript and JSX and to not use semicolons.

xo needs to be installed globally:

    install -g xo

You can check linting by running `xo` or by running `npm test`.

Note: There are currently no application specific tests, beyond style checking.
