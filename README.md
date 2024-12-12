## 概要

VSCodeプラグイン作成方法について調査する際に動作確認のために作ったサンプルプログラム。
このサンプルプログラムでは、以下ができることについて確認している。

- WebViewをReactで実装（Reactを使わないと図を表示したい時などに辛くなると思われる…）
- テキストエディタを監視するプラグイン本体側と、プレビュー表示をするWebView側での双方向通信

## ビルド・実行手順

ビルド方法: 

```
yarn install
yarn compile
```

実行方法:

1. VSCodeで`実行とデバッグ`から`Run Extension`を実行
2. 立ち上がったVSCode上で拡張子`.txt`のファイルを開くと、`Hello World`と書かれたボタンがエディタ右上に現れるのでクリックする
3. エディタの右側にWebViewが現れるのを確認する
4. `.txt`のファイルを開いているテキストエディタをクリックする（まだ初期化部分が上手く出来ていないので、こうしないとWebViewの内容が更新されない）
5. テキストエディタ側とWebView側で表示されているテキストを編集すると、それぞれ最新の内容に更新し合うことを確認する

## このプロジェクトを作成した際の手順

公式の説明の通り、以下のコマンドでテンプレから作成する

```
npm install --global yo generator-code
yo code

? What type of extension do you want to create? New Extension (TypeScript)
? What's the name of your extension? sample-vscode-extension
? What's the identifier of your extension? sample-vscode-extension
? What's the description of your extension?
? Initialize a git repository? Yes
? Which bundler to use? webpack
? Which package manager to use? yarn
```

下記のコードでReactを追加する

```
yarn add react react-dom
yarn add -D @types/react @types/react-dom @types/node
```

あとは、`webpack.config.js`と`tsconfig.json`と`package.json`の内容を調整し、プラグイン本体側とReact側のプログラムを書いて終了。（内容については、このリポジトリのソースコードを参照）

## 実装する上で詰まりやすいところや注意すべきところ

- TypeScriptのビルドが上手く行かない
  - 基本的には`webpack.config.js`や`tsconfig.json`を見直すこと
  - `webpack.config.js`では、プラグイン用とReact用でそれぞれ設定が必要
  - `tsconfig.json`では、`typeRoots`の設定ではまりやすい。`global.d.ts`を書いたうえで、ここでそのパスを設定しないとReact側でvscodeのAPIを呼び出せなかったりする
- メッセージ受信で引数として与えられたものを参照できない
  - メッセージの送受信はJSon形式のObjectで行われるので、単純なデータ形式にして送ることを意識する
- 画面表示の更新が上手く行かない
  - メッセージ送受信のタイミングやVSCode、Reactの癖などで失敗しがち、実際に作り込む際はこの辺りに注意する必要がある
