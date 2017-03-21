var path = require('path')

module.exports = {
  entry: './lib/custom-element-test.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'es2015']
          }
        }
      }
    ]
  },
  output: {
    filename: 'custom-element-test.js',
    path: path.resolve(__dirname, 'dist')
  }
}
