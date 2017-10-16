const webpack = require('webpack')

require('dotenv').config()

module.exports = {
  webpack: (config, { dev }) => {
    config.module.rules.push(
      {
        test: /\.(css|scss)/,
        loader: 'emit-file-loader',
        options: {
          name: 'dist/[path][name].[ext]'
        }
      },
      {
        test: /\.css$/,
        loader: 'babel-loader!raw-loader'
      },
      {
        test: /\.scss$/,
        loader: 'babel-loader!raw-loader!sass-loader'
      }
    )
    config.plugins.push(
      // If you want to export an environent variable from the server to the
      // client (so that you can write isomorphoic code), this is how you can 
      // do that with webpack. Note we use dotenv module to import environment 
      // variables configured in .env. This can be useful for setting options
      // for things like API URL hostnames.
      new webpack.DefinePlugin({
        'process.env.MY_ENV_VAR': JSON.stringify(process.env.MY_ENV_VAR)
      })
    )
    return config
  }
}