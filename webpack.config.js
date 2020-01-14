const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const isEnvProduction = false;

module.exports = {
  mode: "none", //'production'
  entry: {
    main: path.resolve(__dirname, "./src/index.js")
  },
  output: {
    // publicPath: './public',
    path: path.resolve(__dirname, "./build/"),
    filename: "static/js/[name].js"
  },
  devServer: {
    port: 3000,
    contentBase: path.join(__dirname, "./public"),
    stats: {
      colors: true,
      hash: false,
      version: false,
      timings: false,
      assets: false,
      chunks: false,
      modules: false,
      reasons: false,
      children: false,
      source: false,
      errors: true,
      errorDetails: false,
      warnings: false,
      publicPath: false
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "static/css/[name].css"
    }),
    new HtmlWebpackPlugin(
      Object.assign(
        {},
        {
          inject: true,
          template: "./public/index.html",
          // chunks: ["popup"],
          filename: "index.html",
          favicon: "./public/favicon.ico"
        },
        isEnvProduction
          ? {
              minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
              }
            }
          : undefined
      )
    )
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          "css-loader"
        ]
      },
      {
        test: [/.(jpg|jpeg|png)$/, /legend\.svg/],
        use: ["file-loader"]
      },
      {
        test: [/nodeIcons\/[a-z-]+\.svg$/, /countries\/[a-z-]+\.svg$/],
        use: require.resolve("raw-loader")
      }
    ]
  }
};
