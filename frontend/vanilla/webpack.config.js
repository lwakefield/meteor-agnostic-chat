var webpack = require('webpack')

module.exports = {
    entry: "./app.js",
    output: {
        path: __dirname,
        filename: "dist/app.js"
    },
    module: {
        loaders: [
            { test: /\.scss$/, loader: 'style!css!sass!postcss' },
            { test: /\.js$/, loader: 'babel', exclude: /node_modules/, query: {
                presets: ['es2015']
            }},
        ]
    },
    postcss() {
        return [require('autoprefixer')];
    }
};

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vuejs.github.io/vue-loader/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ])
}
