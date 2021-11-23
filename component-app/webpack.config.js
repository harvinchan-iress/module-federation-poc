const { ModuleFederationPlugin } = require("webpack").container;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const { VanillaExtractPlugin } = require('@vanilla-extract/webpack-plugin');
const ExternalTemplateRemotesPlugin = require("external-remotes-plugin");
const LiveReloadPlugin = require("webpack-livereload-plugin");

module.exports = {
  entry: "./index.js",
  mode: "development",
  devtool: "hidden-source-map",
  output: {
    publicPath: "auto",
    clean: true,
  },
  devServer: {
    hot: false,
    static: path.join(__dirname, "dist"),
    port: 3001,
    historyApiFallback: {
      index: "index.html",
    },
  },
  resolve: {
    extensions: [
      ".jsx",
      ".js",
      ".json",
      ".css",
      ".scss",
      ".jpg",
      "jpeg",
      "png",
    ],
  },
  module: {
    rules: [
      {
        test: /\.(jpg|png|gif|jpeg)$/,
        loader: "url-loader",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-react"],
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "component_app",
      filename: "remoteEntry.js",
      exposes: {
        "./Button": "./src/Button.jsx",
        "./Dialog": "./src/Dialog.jsx",
        "./Logo": "./src/Logo.jsx",
        "./ToolTip": "./src/ToolTip.jsx",
      },
      remotes: {
        "lib-app": "lib_app@http://localhost:3000/remoteEntry.js",
      },
    }),
    new ExternalTemplateRemotesPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new VanillaExtractPlugin(),
    new LiveReloadPlugin({
      port: 35729,
    }),
  ],
};
