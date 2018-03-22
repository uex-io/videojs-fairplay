const moment = require('moment');
const pkg = require('../package.json');
const webpack = require('webpack');
const path = require('path');

function excludeNodeModulesExcept (modules)
{
    var pathSep = path.sep;
    if (pathSep == '\\') // must be quoted for use in a regexp:
        pathSep = '\\\\';
    var moduleRegExps = modules.map (function (modName) { return new RegExp("node_modules" + pathSep + modName)})

    return function (modulePath) {
        if (/node_modules/.test(modulePath)) {
            for (var i = 0; i < moduleRegExps.length; i ++)
                if (moduleRegExps[i].test(modulePath)) return false;
            return true;
        }
        return false;
    };
}

module.exports = {
  entry: {
    'videojs.fairplay': './src/videojs-fairplay',
  },

  output: {
    filename: '[name].js',
    libraryTarget: 'umd',
    path: 'dist',
  },

  module: {
    preloaders: [{
      exclude: /node_modules/,
      loader: 'eslint',
      test: /\.js$/,
    }],

    loaders: [{
      exclude: excludeNodeModulesExcept(["videojs-fairplay"]),
      loader: 'babel',
      test: /\.js$/,

      query: {
        presets: [
          'es2015',
        ],

        plugins: [
          'transform-object-rest-spread',
          'transform-runtime',
        ],
      },
    }],

    externals: {
      'video.js': 'videojs',
    },
  },

  plugins: [
    new webpack.BannerPlugin([
      '/**',
      ` * ${pkg.name} v${pkg.version}`,
      ' * ',
      ` * @author: ${pkg.author}`,
      ` * @date: ${moment().format('YYYY-MM-DD')}`,
      ' */',
      '',
    ].join('\n'), {
      raw: true,
    }),
  ],
};
