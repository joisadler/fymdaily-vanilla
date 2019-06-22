import path from 'path';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const NODE_ENV = process.env.NODE_ENV || 'development';

const config = {
  entry: {
    main: './src/javascripts/main.js',
    index: './src/javascripts/index.js',
    signup: './src/javascripts/signup.js',
    analytics: './src/javascripts/analytics.js',
    fontloader: './src/javascripts/fontloader.js',
    vhfix: './src/javascripts/vh-fix.js',
    app: './src/javascripts/app.js',
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: '[name].bundle.js',
  },
  watch: NODE_ENV === 'development',
  watchOptions: {
    aggregateTimeout: 100
  },
  devtool: NODE_ENV === 'development' ? 'source-map' : false,

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /\/node_modules\//,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: true,
          }
        }
      },
      {
        test: /\.pug$/,
        use: ['html-loader', 'pug-html-loader']
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              ident: 'postcss',
              plugins: () => [
                autoprefixer('cover 99.5%'),
                cssnano({
                  preset: 'default',
                }),
              ]
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      }, {
        test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 100000,
            },
          },
        ],
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    // new CopyWebpackPlugin([
    //   {
    //     from: './src/images',
    //     to: './images'
    //   }
    // ]),
    new CopyWebpackPlugin([
      {
        from: './src/manifest.json',
        to: './manifest.json'
      }
    ]),
  ],
};

if (NODE_ENV === 'production') {
  config.plugins.push(
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          sequences: true,
          booleans: true,
          loops: true,
          unused: true,
          warnings: false,
          drop_console: true,
          unsafe: true,
          dead_code: true,
          conditionals: true,
          if_return: true,
          join_vars: true,
        },
        mangle: {
        },
        output: {
          comments: true,
          beautify: true,
        },
        toplevel: true,
        nameCache: null,
        ie8: false,
        keep_classnames: false,
        keep_fnames: false,
        safari10: false,
      }
    })
  );
}

export default config;
