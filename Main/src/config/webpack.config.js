const path = require("path");

const config = require("./site.config");
const loaders = require("./webpack.loaders");
const plugins = require("./webpack.plugins");

module.exports = {
  context: path.join(config.root, config.paths.src),
  entry: [
    path.join(config.root, config.paths.src, "js/main.js"),
    path.join(config.root, config.paths.src, "css/style.scss"),
  ],
  output: {
    path: path.join(config.root, config.paths.dist),
    publicPath: "",
    filename: "[name].[hash].js",
  },
  mode: ["production", "development"].includes(config.env)
    ? config.env
    : "development",
  devtool:
    config.env === "production" ? "hidden-source-map" : "cheap-eval-source-map",
  devServer: {
    historyApiFallback: true,
    contentBase: path.join(config.root, config.paths.src),
    watchContentBase: true,
    hot: true,
    open: true,
    host: config.dev_host,
  },
  module: {
    rules: loaders,
  },
  stats: "errors-only",
  plugins,
};

const crypto = require("crypto");
const crypto_orig_createHash = crypto.createHash;
crypto.createHash = (algorithm) =>
  crypto_orig_createHash(algorithm == "md4" ? "sha256" : algorithm);
