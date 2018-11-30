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
      }
    ]
  },

  node: {
    fs: 'empty'
  }
};
