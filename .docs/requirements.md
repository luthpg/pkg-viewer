# 自社OSS状況可視化ダッシュボード 要件定義書

---

## 1. プロジェクト概要

本プロジェクトは、Vite + Tremor を活用し、自社で開発・公開しているオープンソースソフトウェア（OSS）の状況を可視化するダッシュボードを構築することを目的とする。npm、GitHub、Bundlephobia などの複数ソースからデータを統合し、開発者およびステークホルダーがプロジェクトの健全性や人気度をひと目で把握できる状態を目指す。

## 2. 技術スタック (Technology Stack)

モダンな開発体験、高いパフォーマンス、および保守性を重視した選定を行う。

| カテゴリ | 選定技術 | 選定理由・備考 |
| --- | --- | --- |
| **Frontend Framework** | Vite + React + TypeScript | 高速なビルドパフォーマンスと型安全性の確保。 |
| **UI & Styling** | Tremor Raw + Tailwind CSS | ダッシュボード構築に特化。2026年現在の主流であるコンポーネントコピー型の "Tremor Raw" を採用。 |
| **Data Fetching** | TanStack Query (React Query) | 非同期データの取得、キャッシュ管理、ローディング状態のハンドリングのため。 |
| **Icons** | Lucide React | 高品質かつ軽量なアイコンライブラリ。 |
| **Deployment** | Static Hosting (Vercel/S3等) | サーバーレスで運用可能な静的サイト構成。 |

### データソース・利用ライブラリ

* **GitHub**: `@octokit/rest` (スター数、Issue、リリース情報、コミット状況)
* **npm**: `npm-stats` (ダウンロード推移)
* **Bundle Size**: `fetch` API (Bundlephobia APIを直接利用し、軽量性を維持)

## 3. 機能要件 (Functional Requirements)

### 3.1 データ取得・連携機能

* **マルチソース統合**
  * 同一のパッケージ名（キー）に対し、以下の情報を統合して1つのオブジェクトとして扱う。
    * npm: ダウンロード数、人気度
    * Bundlephobia: バンドルサイズ
    * GitHub: リポジトリの健全性（スター、Issue等）
* **API認証・制限管理**
  * GitHub APIの Rate Limit を回避するため、Personal Access Token を利用する。
  * トークンは環境変数（`.env`）にて管理し、コードベースには含めない。
* **時系列データ処理**
  * npm の range API を利用し、過去30日〜1年間のダウンロード数推移データを取得する。

### 3.2 ダッシュボード表示機能

#### A. Overviewパネル (KPIカード)

主要な指標をカード形式で表示する。

* **最新バージョン**: 現在の最新リリースバージョン。
* **累計ダウンロード数**: 総ダウンロード数に加え、前月比の増減（Delta）を表示。
* **Gzipサイズ**: Bundlephobia から取得したサイズ。
  * *仕様*: 予め定めたしきい値を超過した場合、警告色（赤/オレンジ）で強調表示する。
* **GitHub指標**: スター数および未解決（Open）Issue数。

#### B. Health Checkセクション (健全性指標)

プロジェクトのメンテナンス状況を可視化する。

* **最終アクティビティ**: 最終コミット日からの経過日数。
* **未処理PR**: 現在 Open 状態のプルリクエスト数。

#### C. 比較機能 (Optional)

* 自社OSSと競合OSSのパッケージ名を指定し、主要指標を横並びで比較表示する機能を実装する（優先度：低）。

## 4. 非機能要件 (Non-Functional Requirements)

### 4.1 パフォーマンス・UX

* **ブラウザキャッシュ**: TanStack Query のキャッシュ機構を活用し、画面遷移やリロード時の不要なAPIリクエストを抑制する。
* **ローディング表示**: データ取得中はスケルトンローダー等を表示し、UXを損なわないようにする。

### 4.2 運用・インフラ

* **静的デプロイ**: バックエンドサーバーを構築せず、フロントエンドのみで完結させる。
* **ホスティング**: Vercel, GitHub Pages, 社内用 S3/CloudFront 等、静的ホスティング環境での動作を保証する。

## 5. プロジェクト構成案 (Structure)

保守性を高めるため、以下のディレクトリ構成を推奨する。

```text
src/
├── components/       # UIコンポーネント
│   ├── ui/           # Tremor Raw (Card, Chart等の基本部品)
│   └── dashboard/    # ダッシュボード固有の複合コンポーネント
├── hooks/            # カスタムフック
│   └── useOssMetrics.ts  # 各APIを統合してデータを返すロジック
├── services/         # 外部サービス連携
│   └── apiClients.ts     # Octokitインスタンス生成, npm-stats設定
├── types/            # 型定義
│   └── index.ts          # APIレスポンスや統合データの型
└── App.tsx           # メインレイアウト
```

## 6. 初期実装ステップ

開発開始時の手順は以下の通りとする。

1. **プロジェクト作成**
    * コマンド: `npm create vite@latest my-oss-dashboard -- --template react-ts`
2. **スタイリング導入**
    * Tailwind CSS および Tremor のインストール（Tremor公式Viteガイド準拠）。
3. **APIクライアント実装**
    * GitHub Tokenの取得と `.env` 設定。
    * `@octokit/rest` を用いた疎通確認（自社リポジトリ情報の取得）。
4. **UIプロトタイピング**
    * Tremor の `Card` コンポーネントを配置。
    * ハードコードしたダミーデータを用いてグラフ描画を確認する。
