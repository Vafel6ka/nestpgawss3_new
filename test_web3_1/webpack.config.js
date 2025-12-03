const path = require("path");
const dotenv = require("dotenv");
const webpack = require("webpack"); // <- додано
const HtmlWebpackPlugin = require("html-webpack-plugin");

dotenv.config();

module.exports = {
  // Вхідний файл
  entry: "./src/main.tsx",

  // Вихідний файл
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/",
  },

  mode: "development",

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },

  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    fallback: {
      "@react-native-async-storage/async-storage": false,
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),

    // ---- DefinePlugin для .env змінних ----
    new webpack.DefinePlugin({
      "process.env.REACT_PROJECT_ID": JSON.stringify(
        process.env.REACT_PROJECT_ID
      ),
      "process.env.ALCHEMY_API_KEY": JSON.stringify(
        process.env.ALCHEMY_API_KEY
      ),
      "process.env.REACT_APP_BASE_URL": JSON.stringify(
        process.env.REACT_APP_BASE_URL
      ),
    }),
  ],

  devServer: {
    static: {
      directory: path.join(__dirname, "."),
    },
    compress: true,
    port: 3000,
    hot: true,
    historyApiFallback: true,
  },
};
