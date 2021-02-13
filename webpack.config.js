const path = require("path");

module.exports = {
  mode: "production",
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "diseases/static/js"),
    publicPath: "/static/js/",
  },

  entry: {
    main: path.resolve(__dirname, "diseases/static/build-ts/main.js"),
  },
};
