# GOWENET Block Explorer

ローカルAvalanche Subnet「GOWENET」専用のブロックエクスプローラー

## 概要

GOWENETは独自L1 Subnetのブロックチェーンデータを可視化するWebアプリケーションです。
リアルタイムでブロック、トランザクション、アドレス情報を閲覧できます。

## 主な機能

### ダッシュボード
- 最新のブロックとトランザクションをリアルタイム表示
- ネットワークの主要統計情報

### ブロック管理
- **ブロック一覧**: ブロック番号、ハッシュ、Gas情報、トランザクション数
- **ブロック詳細**: 完全なブロック情報とトランザクション一覧

### トランザクション管理
- **トランザクション一覧**: From/To、Value、Gas、Status（成功/失敗）
- **トランザクション詳細**: 入出金情報、ガス使用状況、詳細なレシート情報

### アドレス検索
- 残高、トランザクション履歴、コントラクト判定

### Network ページ
- **リアルタイムネットワーク統計**
  - 接続ピア数（6ノード表示）
  - アクティブなバリデータ数（4バリデータ表示）
  - ノードブートストラップ状態
  - ガス使用率
  - 平均ブロック時間
  - Last 100 Blocks のトランザクション数

- **ピア情報詳細**
  - Node ID、Public IP、Version
  - Last Sent/Received タイムスタンプ
  - 接続状態監視

- **バリデータ情報詳細**
  - Node ID、Weight、Stake %（自動計算）
  - Validation ID、Status
  - ネットワーク分散度の可視化

- **ネットワーク設定**
  - Network Name、Chain ID、Currency
  - Blockchain ID、Subnet ID
  - RPC/WebSocket エンドポイント

### その他
- **検索機能**: ブロック番号、トランザクションハッシュ、アドレスで検索
- **レスポンシブデザイン**: モバイル、タブレット、デスクトップ対応
- **自動更新**: ダッシュボード・Network ページは 5 秒ごとに更新

## 技術スタック

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: ethers.js v6
- **Network**: Avalanche GOWENET Subnet
- **API**: RESTful API (Next.js Route Handlers)

## ネットワーク情報

```
Chain ID: 1337
Network ID: 1337
Blockchain ID: 2tGwFCjwr3w6fW774ytz982h5Th9eiALrKFanmBKZjxQSqTBxW
Subnet ID: 2W9boARgCWL25z6pMFNtkCfNA5v28VGg9PmBgUJfuKndEdhrvw
Currency: GOWE
RPC Endpoint: http://192.168.3.86:9654/ext/bc/2tGwFCjwr3w6fW774ytz982h5Th9eiALrKFanmBKZjxQSqTBxW/rpc
WebSocket Endpoint: ws://192.168.3.86:9654/ext/bc/2tGwFCjwr3w6fW774ytz982h5Th9eiALrKFanmBKZjxQSqTBxW/ws
```

## 必要要件

- **Node.js**: v20.9.0 以上（現在: v20.19.5）
- **npm**: v9.0.0 以上
- **GOWENET ノード**: ローカルネットワークで稼働中であること

## クイックスタート

### 起動

```bash
cd /home/hirofj/gowenet-explorer
./start-explorer.sh start
```

このコマンドで以下を自動的に実行：
- ✅ Node.jsバージョンチェック
- ✅ GOWENETノード接続確認
- ✅ バックグラウンドで開発サーバー起動
- ✅ アクセスURL表示

### 停止

```bash
./start-explorer.sh stop
```

### 再起動

```bash
./start-explorer.sh restart
```

### 状態確認

```bash
./start-explorer.sh status
```

### ログ確認

```bash
# リアルタイムでログを表示
tail -f explorer.log

# ログ全体を表示
cat explorer.log
```

## アクセス方法

**このマシン（Ubuntu）から:**
```
http://localhost:3000
```

**LAN内のMacやスマホから:**
```
http://192.168.3.86:3000
```

## ページ構成

### ルート
- `/` - ダッシュボード（最新ブロック・トランザクション・統計情報）
- `/blocks` - ブロック一覧
- `/block/[id]` - ブロック詳細
- `/transactions` - トランザクション一覧
- `/tx/[hash]` - トランザクション詳細
- `/address/[addr]` - アドレス詳細
- `/network` - 🆕 ネットワーク統計・ピア・バリデータ情報

### API エンドポイント
- `/api/network/stats` - ネットワーク統計データ
- `/api/network/peers` - 接続ピア情報
- `/api/network/validators` - バリデータ情報

## 環境変数設定

`.env.local` ファイルで設定：

```env
NEXT_PUBLIC_RPC_URL=http://192.168.3.86:9654/ext/bc/2tGwFCjwr3w6fW774ytz982h5Th9eiALrKFanmBKZjxQSqTBxW/rpc
NEXT_PUBLIC_WS_URL=ws://192.168.3.86:9654/ext/bc/2tGwFCjwr3w6fW774ytz982h5Th9eiALrKFanmBKZjxQSqTBxW/ws
NEXT_PUBLIC_CHAIN_ID=1337
NEXT_PUBLIC_BLOCKCHAIN_ID=2tGwFCjwr3w6fW774ytz982h5Th9eiALrKFanmBKZjxQSqTBxW
NEXT_PUBLIC_SUBNET_ID=2W9boARgCWL25z6pMFNtkCfNA5v28VGg9PmBgUJfuKndEdhrvw
NEXT_PUBLIC_NETWORK_NAME=GOWENET
NEXT_PUBLIC_CURRENCY_SYMBOL=GOWE
```

## ビルド・本番運用

### 開発環境での実行

```bash
npm run dev
```

### ビルド

```bash
npm run build
```

### 本番環境での実行

```bash
npm start
```

### ポート指定

```bash
PORT=8080 npm run dev
```

## プロジェクト構成

```
gowenet-explorer/
├── app/
│   ├── page.tsx                 # ダッシュボード
│   ├── blocks/page.tsx          # ブロック一覧
│   ├── block/[id]/page.tsx      # ブロック詳細
│   ├── transactions/page.tsx    # トランザクション一覧
│   ├── tx/[hash]/page.tsx       # トランザクション詳細
│   ├── address/[addr]/page.tsx  # アドレス詳細
│   ├── network/page.tsx         # 🆕 ネットワーク統計
│   ├── api/
│   │   └── network/
│   │       ├── stats/route.ts           # 統計情報 API
│   │       ├── peers/route.ts           # ピア情報 API
│   │       └── validators/route.ts      # バリデータ情報 API
│   └── layout.tsx
├── components/
│   ├── Header.tsx               # ナビゲーションヘッダー
│   ├── SearchBar.tsx            # 検索バー
│   ├── BlockCard.tsx            # ブロックカード
│   ├── BlockRow.tsx             # ブロック行
│   ├── TransactionCard.tsx      # トランザクションカード
│   ├── TransactionRow.tsx       # トランザクション行
│   ├── NetworkStatsCard.tsx     # 🆕 統計情報カード
│   ├── PeerList.tsx             # 🆕 ピアリスト
│   ├── ValidatorList.tsx        # 🆕 バリデータリスト
│   ├── Loading.tsx              # ローディング表示
│   ├── ErrorMessage.tsx         # エラーメッセージ
│   └── NetworkStatus.tsx        # ネットワーク接続状態
├── lib/
│   ├── provider.ts              # ethers.js プロバイダー
│   ├── constants.ts             # ネットワーク設定
│   ├── utils.ts                 # ユーティリティ関数
│   └── rpc.ts                   # 🆕 RPC ユーティリティ
├── types/
│   └── index.ts                 # 型定義
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── README.md
```

## 管理コマンド一覧

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発環境でサーバー起動 |
| `npm run build` | プロダクションビルド |
| `npm start` | ビルド済みアプリを起動 |
| `npm run lint` | ESLint チェック |
| `./start-explorer.sh start` | エクスプローラー起動 |
| `./start-explorer.sh stop` | エクスプローラー停止 |
| `./start-explorer.sh restart` | エクスプローラー再起動 |
| `./start-explorer.sh status` | エクスプローラー状態確認 |

## トラブルシューティング

### エラー: "Cannot connect to node"

```
✗ Cannot connect to node at http://192.168.3.86:9654/...
ERROR: Node health check failed. Exiting.
```

**原因と対処:**
1. GOWENETノードが起動していることを確認
2. RPC エンドポイント（ポート 9654）が正しいことを確認
3. ファイアウォール設定を確認

### エラー: "server response 404 Not Found"

**原因と対処:**
- ノードのポート番号を確認（Pi1 は 9654、Pi2-Pi4 は 9650）
- エンドポイント URL が正しいことを確認

### ページが応答しない

**原因と対処:**
1. `tail -f explorer.log` でログを確認
2. ノード接続を確認
3. エクスプローラーを再起動: `./start-explorer.sh restart`

## 技術仕様

### データ更新間隔
- ダッシュボード: 5秒ごと
- Network ページ: 5秒ごと（ピア、バリデータ、統計情報）

### ブロック情報
- 最新 6 ブロックをダッシュボードに表示
- 平均ブロック時間は最新 10 ブロックから計算

### トランザクション表示
- 最新 6 トランザクションをダッシュボードに表示
- Last 100 Blocks の総トランザクション数を Network ページに表示

### バリデータ情報
- 現在のアクティブバリデータを表示
- Weight を基に Stake % を自動計算

## バージョン情報

- **Version**: 1.1.0
- **Last Updated**: 2025-11-09
- **Avalanchego**: v1.14.0
- **Avalanche SDK**: ethers.js v6.15.0+

## ライセンス

MIT License

## サポート

問題が発生した場合は、ログファイルを確認してください：
```bash
tail -f /home/hirofj/gowenet-explorer/explorer.log
```

詳細なトラブルシューティングについては、README のトラブルシューティングセクションを参照してください。
