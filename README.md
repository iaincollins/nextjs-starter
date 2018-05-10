[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
# Next.js Starter Project

This is a starter project for React that uses Next.js.

It includes the following features:

* Authentication via Email, Facebook, Twitter and Google+ (using Express and Passport).
* Basic account management (update details, link/unlink accounts, delete account).
* Session support with secure HTTP Only cookies.
* CSRF Tokens.
* Bootstrap 4 and Reactstrap (Bootstrap components for React).
* SCSS, with live reloading.
* Comes with Ionicons icon font and shows how to bundle other CSS and fonts.

You can see a live demo at **https://nextjs-starter.now.sh**

## About 

Next.js is a framework that makes it easy to create Universal web apps in React. With Next.js, React pages are automatically rendered on both client and server side, without the hassle of setting up dependancies like webpack or babel and with automatic routing.

This is a starter project that provides an example of how to use Next.js with Express (the popular web server framework for Node.js), with SCSS, Bootstrap, reactstrap (Boostrap 4 for React), the Ionicons icon set, how to include data from remote REST APIs and incorporates an authentication system that supports both oAuth and Email using Passport (a popular authentication framework for Node.js).

This project exists to make it easier to get started with creating universal apps in React. You are invited to use it as a reference or to copy it and use it as a base for your own projects. Contributions to improve this project are welcome.

## Running locally in development mode

To get started, just clone the repository and run `npm install && npm run dev`:

    git clone https://github.com/iaincollins/nextjs-starter.git
    npm install
    npm run dev

Note: If you are running on Windows run install --noptional flag (i.e. `npm install --no-optional`) which will skip installing fsevents.

## Building and deploying in production

If you wanted to run this site in production, you should install modules then build the site with `npm run build` and run it with `npm start`:

    npm install
    npm run build
    npm start

You should run `npm run build` again any time you make changes to the site.

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

## Running tests

Style formatting is enforced with the JavaScript style linter [xo](https://github.com/sindresorhus/xo) which is invoked when running `npm test`.

Reflecting how most examples of Next.js are written, in  `package.json` we have configured 'xo' to tell it this project uses spaces (not tabs) in both JavaScript and JSX and to not use semicolons.

xo needs to be installed globally:

    install -g xo

You can check linting by running `xo` or by running `npm test`.

Note: There are currently no application specific tests, beyond style checking.
