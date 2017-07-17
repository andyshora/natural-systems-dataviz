'use strict';

const webpack = require('webpack');
const path = require('path');

module.exports = {
  devServer: {
    contentBase: '.',
    inline: true
  },
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './src/index'
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
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
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loaders: ['babel-loader']
      },
      {
          test: /\.css$/,
          loaders: [
            'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: function () {
                  return [
                    require('stylelint'),
                    // require('postcss-map')({
                    //   basePath: 'src/styles/themes',
                    //   maps: ['palette.yml']
                    // }),
                    require('postcss-foreach'),
                    require('precss'),
                    require('postcss-cssnext')
                  ];
                }
              }
            }
          ]
        },
      {
        test: /\.svg$/,
        loaders: ['babel-loader', 'svg-react-loader']
      }
    ]
  }
};
