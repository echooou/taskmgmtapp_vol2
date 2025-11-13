# タスク管理アプリ (Power Apps Code App)

React + TypeScript + Viteで構築され、Power Apps Code Appsとしてデプロイされるタスク管理アプリケーションです。

## 機能

### 1. タスク新規登録
- タスク名、顧客、カテゴリ、開始日、終了予定日、ステータス、工数、関連タスク(複数選択可能)、メモを入力可能
- バリデーション機能
- 直感的なフォームUI

### 2. タスク一覧
- 登録したタスクを横長カード形式で一覧表示
- ドラッグ&ドロップで優先順位を変更可能
- タスククリックで右サイドバーに詳細表示
- タスクの編集・削除機能

### 3. カレンダー
- 月次カレンダービューでタスクを確認
- 特定の日付をクリックすると、その日に行うべきタスクが優先順位順に表示
- タスクの期間を視覚的に表示

### 4. 設定
- カテゴリのカスタマイズ機能
- カテゴリの追加・削除

## 技術スタック

- **フレームワーク**: React 18
- **言語**: TypeScript
- **ビルドツール**: Vite
- **Power Apps**: @microsoft/power-apps SDK 0.3.21
- **スタイリング**: TailwindCSS 3.3.6
- **UIコンポーネント**: shadcn/ui
- **ルーティング**: React Router v6 (HashRouter)
- **状態管理**: Zustand 4.4.7 with persist
- **ドラッグ&ドロップ**: @dnd-kit
- **日付処理**: date-fns 3.0.0
- **アイコン**: Lucide React

## セットアップ

### 前提条件
- Node.js 18以上
- npm または yarn
- Power Platform CLI
- Power Apps環境へのアクセス権

### インストール

```bash
# 依存関係のインストール
npm install

# Power Platform認証
pac auth create

# Power Apps環境選択
pac env select --environment <環境URL>

# Power Apps Code App初期化
pac code init --displayName "My task app"

# 開発サーバーの起動 (Power Apps SDK + Vite)
npm run dev

# ビルド
npm run build

# Power Appsへデプロイ
pac code push
```

## Power Apps Code Apps 設定

### vite.config.ts
```typescript
export default defineConfig({
  base: './',  // Power Apps デプロイ必須設定
  server: {
    host: '::',
    port: 3000,  // Power SDK requires port 3000
  },
  // ...
});
```

### PowerProvider
Power Apps SDKの初期化を管理するプロバイダーコンポーネント:
- `src/PowerProvider.tsx`: Microsoft公式パターンに準拠
- エラーハンドリングとローディング状態の管理

## Dataverse統合 (準備中)

### 接続設定
- テーブル: `cr19f_task`
- 接続ID: 設定済み
- スキーマ: `DATAVERSE_SETUP.md`参照

### カスタムフック
- `src/hooks/useDataverseTasks.ts`: Dataverse CRUD操作用フック(実装予定)

## プロジェクト構造

```
taskmgmtapp/
├── src/
│   ├── components/          # 共通コンポーネント
│   │   ├── ui/             # UIコンポーネント
│   │   └── Layout.tsx      # レイアウトコンポーネント
│   ├── pages/              # ページコンポーネント
│   │   ├── TaskNew.tsx     # タスク新規登録
│   │   ├── TaskList.tsx    # タスク一覧
│   │   └── Calendar.tsx    # カレンダー
│   ├── store/              # 状態管理
│   │   └── taskStore.ts    # タスク状態管理
│   ├── types/              # 型定義
│   │   └── task.ts         # タスク型定義
│   ├── lib/                # ユーティリティ
│   │   └── utils.ts        # ヘルパー関数
│   ├── App.tsx             # アプリケーションルート
│   ├── main.tsx            # エントリーポイント
│   └── index.css           # グローバルスタイル
├── public/                 # 静的ファイル
├── index.html             # HTMLテンプレート
├── package.json           # パッケージ情報
├── tsconfig.json          # TypeScript設定
├── vite.config.ts         # Vite設定
└── tailwind.config.js     # TailwindCSS設定
```

## 使い方

1. **タスクの作成**
   - 「新規登録」タブをクリック
   - 必要な情報を入力して「登録」ボタンをクリック

2. **タスクの管理**
   - 「タスク一覧」タブで全タスクを確認
   - ドラッグ&ドロップで優先順位を変更
   - タスクをクリックして詳細を表示・削除

3. **カレンダー表示**
   - 「カレンダー」タブでタスクの期間を視覚的に確認
   - 日付をクリックしてその日のタスク一覧を表示

## ライセンス

MIT
