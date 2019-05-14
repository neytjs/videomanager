/*
webpack.config.js is a configuration file used by webpack that designates the desired webpack
functionality, stating which loaders to include (e.g. for css, json, etc). It also sets the entry
of the app being bundled and where the output (i.e. the bundled javascript file) should be placed.
https://webpack.js.org/configuration/
*/

var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: ["babel-polyfill", './src/app.js'],
  output: {path: './dist', filename: 'bundle.js' },

  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'es2017', 'react']
        }
      },
      {
        test: /.css?$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },

  node: {
    fs: 'empty'
  }
};
