import path from 'path';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
// import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ImageminPlugin from 'imagemin-webpack';

const NODE_ENV = process.env.NODE_ENV || 'development';

const config = {
  entry: {
    index: './src/javascripts/index.js',
    signup: './src/javascripts/signup.js',
    // analytics: './src/javascripts/analytics.js',
    app: './src/javascripts/app.js',
    // load styles
    homepage: './src/javascripts/styles/homepage.js',
    'add-food': './src/javascripts/styles/add-food.js',
    'create-food': './src/javascripts/styles/create-food.js',
    'custom-foods': './src/javascripts/styles/custom-foods.js',
    'eaten-foods': './src/javascripts/styles/eaten-foods.js',
    'edit-food': './src/javascripts/styles/edit-food.js',
    'user-info': './src/javascripts/styles/user-info.js',
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: '[name].js',
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
        loader: 'pug-loader'
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
                autoprefixer(),
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
              limit: 8000, // Convert images < 8kb to base64 strings
              name: 'images/[hash]-[name].[ext]',
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
    new CopyWebpackPlugin([
      {
        from: './src/images/favicons',
        to: './images/favicons'
      },
      {
        from: './src/images/facebook',
        to: './images/facebook'
      }
    ]),
    new ImageminPlugin({
      bail: false, // Ignore errors on corrupted images
      cache: true,
      imageminOptions: {
        // Lossless optimization with custom option
        // Feel free to experiment with options for better result for you
        plugins: [
          ['gifsicle', { interlaced: true }],
          ['jpegtran', { progressive: true }],
          ['optipng', { optimizationLevel: 5 }],
          [
            'svgo',
            {
              plugins: [
                {
                  removeViewBox: false
                }
              ]
            }
          ]
        ]
      }
    }),
    new CopyWebpackPlugin([
      {
        from: './src/manifest.json',
        to: './manifest.json'
      }
    ]),
  ],
};

// if (NODE_ENV === 'production') {
//   config.plugins.push(
//     new UglifyJsPlugin({
//       uglifyOptions: {
//         warnings: false,
//         compress: {
//           sequences: true,
//           booleans: true,
//           loops: true,
//           unused: true,
//           drop_console: true,
//           unsafe: true,
//           dead_code: true,
//           conditionals: true,
//           if_return: true,
//           join_vars: true,
//         },
//         mangle: {
//         },
//         output: {
//           comments: true,
//           beautify: true,
//         },
//         toplevel: true,
//         nameCache: null,
//         ie8: false,
//         keep_classnames: false,
//         keep_fnames: false,
//         safari10: false,
//       }
//     })
//   );
// }

export default config;
