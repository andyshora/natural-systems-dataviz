'use strict';

const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: [
    './src/index'
  ],
  output: {
    path: '/dist',
    filename: 'bundle.js',
    publicPath: './dist'
  },
  externals: {
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true
  },
  resolve: {
    modules: [
      __dirname,
      'node_modules',
      path.resolve(__dirname, 'src')
    ],
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: false
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loaders: ['babel-loader']
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
      },
      {
        test: /\.svg$/,
        loaders: ['babel-loader', 'svg-react-loader']
      }
    ]
  }
};
