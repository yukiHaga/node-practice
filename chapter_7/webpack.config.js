// Generated using webpack-cli https://github.com/webpack/webpack-cli
import path from "path";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

const config = {
  mode: "development",
  // targetは、どの環境向けにコンパイルするかを指定するプロパティ。
  // 指定しなかった場合、デフォルトでweb(ブラウザ環境向けにコンパイル)になっている
  // node.jsの環境で動くように、コンパイルする
  target: "node",
  entry: "./src/index.ts",
  experiments: {
    outputModule: true,
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    // これでバンドル結果がESモジュール形式のコードになる
    module: true,
    chunkFormat: "module",
  },
  devServer: {
    open: true,
    host: "localhost",
  },
  plugins: [
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    // pluginsオプションは、webpackのビルドプロセスを様々な方法でカスタマイズするために使用します。
    // new NodePolyfillPlugin()
  ],
  // module.rulesとresolve.extensionsの違いは、module.rulesは決められたルールにマッチするファイルに対してローダーを適用することを目的としている
  // resolve.extensionsはエントリーファイルからモジュールを読み込む際に、どの拡張子のモジュールを読み込むかを指定するためのオプション
  module: {
    // module.rulesは、Webpackがモジュールをどのように処理するかを指定するためのセクション
    // testでは、モジュールを処理する際に使用する正規表現パターンを指定します。この正規表現にマッチするファイルにルールが適用されます
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  resolve: {
    // Webpackは、エントリーファイルから開始して他のモジュールを読み込む際に、resolve オプションに指定されたルールに基づいてモジュールの解決を行います。
    // extensions: モジュールの解決時に自動的に解決されるファイル拡張子の配列を指定します。
    // これにより、import文やrequire文でファイルの拡張子を省略できます。例えば、extensions: ['.js', '.jsx', '.json'] と指定すると、
    // .js、.jsx、.json ファイルの拡張子が省略された場合にも自動的に解決されます。
    extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
    plugins: [new TsconfigPathsPlugin()],
  },
};

export default config;
