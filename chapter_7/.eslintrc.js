module.exports = {
  // eslintコマンドを実行したディレクトリを起点に、ディレクトリをさかのぼって設定ファイルを探す仕様がESLintにはあります。
  // たとえば、ディレクトリ/a/b/でコマンドを実行した場合、ESLintは次の順で設定ファイルを探します。
  // 1. /a/b/.eslintrc.js
  // 2. /a/.eslintrc.js
  // 3. /.eslintrc.js
  // この探索はルートディレクトリに達するまでさかのぼります。探索中に複数の設定ファイルが見つかった場合は、設定内容がマージされていきます。
  // この仕様は便利な反面、プロジェクト外の設定ファイルまで見にいってしまう危険性もあります。
  // 設定ファイルの探索範囲をしぼるためにも、rootにtrueを設定するのがお勧めです。これがある設定ファイルが見つかると、これ以上ディレクトリをさかのぼらなくなります。
  root: true,

  // parserで設定したパーサーを使って、ESLintはJavaScriptやTypeScriptの構文を解析します。
  // 上の例では、TypeScriptパーサーを指定しています。この指定がないと、ESLintはTypeScriptを解釈できず、エラーが発生します。
  // このパーサーさえ入れておけば、TypeScriptに限らずJavaScriptのこのパーサーひとつで対応できます。
  parser: "@typescript-eslint/parser",
  // ESLintは公式が提供するルールに加えて、第三者が作成したルールを使うこともできます。
  // 第三者が作成したルールはプラグインという形で公開されています。
  // このpluginsフィールドにプラグインを追加すると、ルールが追加できます。
  // 上の例では、TypeScript ESLint独自のルールを追加するために、@typescript-eslintを設定しています。
  // Sharable ConfigはあくまでESLintが用意したルールをまとめたたり、設定しなおしたりしたプリセットって感じ(ルール自体は変わっとらん)
  plugins: ["@typescript-eslint"],

  // envはチェック対象のJavaScript/TypeScriptコードがどの実行環境で使われるかをESLintに伝えるためのオプションです。
  // これを設定すると、ESLintがグローバル変数を認識するようになります。
  // たとえば、browser: trueを設定すると、windowやalertなどのグローバル変数が認識されます。
  // es2021を設定すると、ES2021までに導入されたグローバル変数が認識されます。他にもnodeなどの指定ができます
  env: {
    // browser: true,
    node: true,
    es2021: true,
  },
  // parserOptionsはチェック対象のJavaScriptがどの構文を使っているかをESLintに伝えるためのオプションです。
  parserOptions: {
    // ecmaVersionは、どのバージョンのECMAScriptの構文を使うかを指定します。
    // "latest"を設定すると、最新のECMAScriptの構文を使うという指定になります。デフォルト
    ecmaVersion: "latest",
    // JavaScriptにはスクリプトモードとモジュールモードがあります。
    // sourceTypeはJavaScriptコードがどちらのモードで書かれるかを指定するオプションである。
    // モジュールモードでは、import文やexport文といった追加の構文がサポートされます。
    sourceType: "module",
    // projectとtsconfigRootDirはTypeScript ESLint独自のオプションです。
    // tsconfigRootDirはプロジェクトルートの絶対パスを指定します。
    // projectは、ESLint実行時に使うコンパイラ設定ファイルをtsconfigRootDirからの相対パスで指定します
    project: "./tsconfig.eslint.json",
    tsconfigRootDir: __dirname,
  },
  // ignorePatternsはESLintのチェック対象外にするファイルやディレクトリを指定するオプションです。
  // TypeScriptプロジェクトでは、コンパイルで生成されるJavaScriptは、リントしないのが普通です。
  // なので、distディレクトリをチェック対象外にしておきます。
  ignorePatterns: ["dist"],
  // ESLintには「ルール(rule)」という概念があります。ルールはチェックの最小単位です。たとえば、ルールには次のようなものがあります。
  // no-console: console.logを書いてはならない
  // camelcase: 変数名はキャメルケースにすること
  // semi: 文末セミコロンは省略しない
  // ESLintでは、複数のルールを組み合わせてコーディング規約を組み立てていきます。
  // ルールには、重大度(severity)という重み付けが設定できます。
  // rules: {
  //   // warnは警告するが終了コードに影響しない
  //   "no-console": "warn",
  //   // errorは警告し、終了コードを1にする
  //   // このルール設定では"always"を指定している。これは文末セミコロンを必須にする設定である
  //   semi: ["error", "always"],
  //   // ルールによっては、細かく設定できるものもあります。たとえば、camelcaseとか
  //   // 細かく設定したい場合、ルール名: [重大度, 設定値]のような配列形式で設定することで、細かいルール設定ができます。
  //   // 次の設定例は、プロパティ名に限ってはキャメルケースを強制しない設定です。
  //   camelcase: ["error", { properties: "never" }]
  // }

  // sharable configを導入したいなら、extendsを使う
  // ①は、JavaScript向けのルールです。これを拡張してTypeScript ESLintのルールにも範囲を広げたのが②です。
  // ①と②は上の順番でないと正しく設定されないので注意してください。
  // ③はTypeScript ESLintが提供する推奨ルールセットで、型情報を要するルールを含みます。
  extends: [
    "airbnb-base",
    "airbnb-typescript/base",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    // 最後のルールが一番優先される
    // Prettierと衝突するESLintのルールや不要なESLintのルールは、あらかじめ用意されている設定を使って簡単にオフにすることができる：
    "prettier",
  ],
  rules: {
    // ダブルの時はエラーを出さないって設定
    // quotes: ["error", "double"],
    // TypeScript ESLintで追加されたルールは、@typescript-eslint/が接頭辞になります。
    "no-console": "off",
    "@typescript-eslint/quotes": "off",
    "import/prefer-default-export": "off",
    "@typescript-eslint/lines-between-class-members": "off",
    "@typescript-eslint/no-redeclare": "off",
    "import/extensions": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-redundant-type-constituents": "off",
    "@typescript-eslint/no-shadow": "off",
    "class-methods-use-this": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "no-underscore-dangle": "off",
    "@typescript-eslint/naming-convention": "off",
    "import/no-extraneous-dependencies": "off",
  },
};
