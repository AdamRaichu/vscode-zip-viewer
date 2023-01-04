const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  devtool: "source-map",
  externals: {
    vscode: "commonjs vscode",
  },
  mode: "production",
  optimization: {
    minimize: false,
  },
};
