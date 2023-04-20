# 追加機能

## ○ repository 検索機能

- repositoryCount を取得してヒット件数を表示
- stargazerCount を取得して表示
- updatedAt を timeago.js で format 化して最新の更新時刻を表示
- word をこちらで提示してそれを押すと検索ボックスに入り、検索できる機能

## ○ issue 閲覧機能

- totalCount を取得して issue の合計を表示
- state,author/login,comments/totalCount を取得して表示
- url を取得してクリックすると対応した github issue のページが外部ページにリンク
- updatedAt を timeago.js で format 化して最新の更新時刻を表示
- repository 検索機能と同様に追加読み込みボタンを配置

## ○ その他

- react-loading で loading 中に loading icon を表示
- input box に clear ボタンを配置
- clear ボタンを押してもスムーズに input に focus が当たる
- inputbox に入力する際、あらかじめ決めたデータから入力候補を出す
- data がない時ある時で文章を場合分け
- CSS Modules,SCSS により少し冗長な記述となるが、名前の衝突を避けつつ、比較的保守性のあるスタイル

## 改善点

- レスポンシブ対応
- repository や issue が表示されている時の input box の suggestion でスタイルが崩れる

## CSS Modules ,SCSS

## ○ CSS modules のいい点・悪い点

- メリット
  - 直感的で分かりやすい
  - コンポーネントレベルでスタイルを適用することができ、名前の衝突なども考える必要がない
  - コード分割した上で minify された複数の`css`ファイルへとコンパイルされ、描画のために読み込む CSS を最小限にしてくれるため、パフォーマンスは最高。
  - Nextjs でも押されていて、一番よく使われている手法
  - 利用者も多い
- デメリット
  - ファイルを分ける必要がある
  - いちいち命名しなくてはならない（今は ChatGPT があるのでクラス名を考える負担は少なくなったかも）

## Getting Started

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

First, run the development server:

```bash
npm install

npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
