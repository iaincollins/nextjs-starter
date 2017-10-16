[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
# Next.js Starter Project

This is a Next.js project that incorporates Express for Node.js and reactstrap (Boostrap 4 for React) and incorporates account registration and sign-in system.

This project exists to make it easier to get started with creating Universal apps in React. You are invited to copy it and have fun!

Contributions to improve it are welcome.

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

## Configuring

If you configure a .env file (just copy [.env.default](https://github.com/iaincollins/nextjs-starter/blob/master/.env.default) over to '.env' and fill in the options) you can configure a range of options.

See the [AUTHENTICATION.md](https://github.com/iaincollins/nextjs-starter/blob/master/AUTHENTICATION.md) for how to set up oAuth if you want to do that. It suggested you start with Twitter as it's the easiest to get working.

## Deploying to the cloud with now.sh

To deploy on [Zeit's](https://zeit.co) cloud platform `now` just install it, clone this repository and run `now` in the working directory:

    npm install -g now
    now

If you configure a .env file `now` will include it when deploying if you use the -E option to deploy:

    now -E

If you want to have your local `.env` file contain variables for local development and have a different sent of varaibles you use in production or staging, you can create additional .env files and tell `now` to use a specific 
file when deploying.

For example:

    now -E production.env

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
