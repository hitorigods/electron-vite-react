# electron-vite-react

## Quick Setup

```sh
# モジュールをインストール
npm install

# 開発
npm run dev
```

## ディレクトリ構造

```tree
├── electron                                 Electron関連
│   ├── main                                 メインプロセス
│   └── preload                              Preload
│
├── release                                  ブルドデータ
│   └── {version}
│       ├── {os}-{os_arch}                   実行可能ファイル
│       └── {app_name}_{version}.{ext}       アプリケーションのインストーラー
│
├── public                                   静的ファイル
└── src                                      レンダラー、Reactアプリケーション
```

## 追加機能

1. electron-updater [see docs](src/components/update/README.md)
1. playwright

## ボイラープレート

[Electron + Vite + React + Sass boilerplate.](https://github.com/electron-vite/electron-vite-react)
