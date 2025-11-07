# GOWENET Block Explorer

ローカルAvalanche Subnet「GOWENET」専用のブロックエクスプローラー

## 概要

GOWENETは独自L1 Subnetのブロックチェーンデータを可視化するWebアプリケーションです。
リアルタイムでブロック、トランザクション、アドレス情報を閲覧できます。

## 主な機能

- **ダッシュボード**: 最新のブロックとトランザクションをリアルタイム表示
- **ブロック一覧・詳細**: ブロック番号、ハッシュ、Gas情報、トランザクション一覧
- **トランザクション一覧・詳細**: From/To、Value、Gas、Status（成功/失敗）
- **アドレス詳細**: 残高、トランザクション履歴、コントラクト判定
- **検索機能**: ブロック番号、トランザクションハッシュ、アドレスで検索
- **ネットワーク監視**: 接続状態のリアルタイム表示
- **レスポンシブデザイン**: モバイル、タブレット、デスクトップ対応

## 技術スタック

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: ethers.js v6
- **Network**: Avalanche GOWENET Subnet

## ネットワーク情報

```
Chain ID: 1337
Network ID: 1337
Blockchain ID: 2tGwFCjwr3w6fW774ytz982h5Th9eiALrKFanmBKZjxQSqTBxW
Subnet ID: 2W9boARgCWL25z6pMFNtkCfNA5v28VGg9PmBgUJfuKndEdhrvw
Currency: GOWE
RPC Endpoint: http://192.168.3.86:9654/ext/bc/2tGwFCjwr3w6fW774ytz982h5Th9eiALrKFanmBKZjxQSqTBxW/rpc
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

## 管理コマンド一覧

| コマンド | 説明 |
|---------|------|
| `./start-explorer.sh start` | エクスプローラーを起動 |
| `./start-explorer.sh stop` | エクスプローラーを停止 |
| `./start-explorer.sh restart` | エクスプローラーを再起動 |
| `./start-explorer.sh status` | 稼働状態を確認 |

**注意**: パラメータなしで実行すると`start`が実行されます。

## 初回セットアップ（既に完了済み）

依存パッケージは既にインストール済みです。必要に応じて：

```bash
cd /home/hirofj/gowenet-explorer
npm install
```

## 環境変数の設定

`.env.local` ファイルで設定を変更できます：

```bash
# .env.local
NEXT_PUBLIC_RPC_URL=http://192.168.3.86:9654/ext/bc/2tGwFCjwr3w6fW774ytz982h5Th9eiALrKFanmBKZjxQSqTBxW/rpc
NEXT_PUBLIC_WS_URL=ws://192.168.3.86:9654/ext/bc/2tGwFCjwr3w6fW774ytz982h5Th9eiALrKFanmBKZjxQSqTBxW/ws
NEXT_PUBLIC_CHAIN_ID=1337
NEXT_PUBLIC_BLOCKCHAIN_ID=2tGwFCjwr3w6fW774ytz982h5Th9eiALrKFanmBKZjxQSqTBxW
NEXT_PUBLIC_SUBNET_ID=2W9boARgCWL25z6pMFNtkCfNA5v28VGg9PmBgUJfuKndEdhrvw
NEXT_PUBLIC_NETWORK_NAME=GOWENET Local
NEXT_PUBLIC_CURRENCY_SYMBOL=GOWE
```

**重要**: RPC URLのポート番号は **9654** です（9650ではありません）

## 使い方

### ダッシュボード

- トップページ (/) で最新のブロックとトランザクションを確認
- ネットワーク統計（最新ブロック番号、平均ブロック時間）を表示
- 5秒ごとに自動更新

### ナビゲーション

- **Home**: ダッシュボード
- **Blocks**: ブロック一覧ページ（最新20件）
- **Transactions**: トランザクション一覧ページ（最新20件）

### 検索

ヘッダーの検索バーで以下を検索できます：

- **ブロック番号**: `10`, `25` など
- **ブロックハッシュ**: `0x123...` (64文字)
- **トランザクションハッシュ**: `0xabc...` (64文字)
- **アドレス**: `0x456...` (40文字)

### ブロック詳細

- ブロック番号をクリック
- ブロックハッシュ、タイムスタンプ、Gas情報を表示
- 含まれるトランザクション一覧

### トランザクション詳細

- トランザクションハッシュをクリック
- Status（成功/失敗）、From/To、Value、Gas情報を表示

### アドレス詳細

- アドレスをクリック
- 残高（GOWE単位）、コントラクト判定、トランザクション履歴を表示

## プロジェクト構造

```
gowenet-explorer/
├── start-explorer.sh        # 起動・停止スクリプト
├── explorer.log             # アプリケーションログ
├── .explorer.pid            # プロセスID（起動中のみ）
├── app/                      # Next.js App Router
│   ├── layout.tsx           # ルートレイアウト
│   ├── page.tsx             # ダッシュボード
│   ├── blocks/              # ブロック一覧
│   ├── block/[id]/          # ブロック詳細
│   ├── transactions/        # トランザクション一覧
│   ├── tx/[hash]/           # トランザクション詳細
│   └── address/[addr]/      # アドレス詳細
├── components/              # Reactコンポーネント
│   ├── Header.tsx           # ヘッダー（ナビ・検索）
│   ├── SearchBar.tsx        # 検索バー
│   ├── NetworkStatus.tsx    # ネットワーク状態
│   ├── BlockCard.tsx        # ブロックカード
│   ├── TransactionCard.tsx  # トランザクションカード
│   ├── Loading.tsx          # ローディング表示
│   └── ErrorMessage.tsx     # エラーメッセージ
├── lib/                     # ユーティリティ・ロジック
│   ├── provider.ts          # ethers.js プロバイダー
│   ├── utils.ts             # ヘルパー関数
│   └── constants.ts         # 定数定義
├── types/                   # TypeScript型定義
│   └── index.ts
├── .env.local              # 環境変数
├── next.config.ts          # Next.js設定
└── package.json            # 依存パッケージ
```

## トラブルシューティング

### RPC接続エラー

**エラーメッセージ:**
```
server response 404 Not Found
```

**原因と解決策:**

1. **GOWENETノードが起動していない**
   ```bash
   # ノードプロセスを確認
   ps aux | grep avalanchego | grep -v grep
   ```

2. **ポート番号が間違っている**
   - 正しいポート: `9654`（9650ではない）
   - `.env.local`を確認

3. **RPC接続テスト**
   ```bash
   curl -X POST --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
     -H 'content-type:application/json' \
     http://192.168.3.86:9654/ext/bc/2tGwFCjwr3w6fW774ytz982h5Th9eiALrKFanmBKZjxQSqTBxW/rpc
   ```

### エクスプローラーが起動しない

```bash
# 状態確認
./start-explorer.sh status

# ログ確認
cat explorer.log

# 古いプロセスを停止
./start-explorer.sh stop

# 再起動
./start-explorer.sh start
```

### ポート3000が既に使用中

```bash
# 使用中のプロセスを確認
sudo lsof -i :3000

# エクスプローラーを停止
./start-explorer.sh stop

# または別のポートで起動（手動の場合）
PORT=3001 npm run dev
```

### Node.jsバージョンエラー

```bash
# 現在のバージョン確認
node --version

# v20未満の場合、アップグレード
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y
```

### LAN内のMacから接続できない

1. エクスプローラーが起動しているか確認
   ```bash
   ./start-explorer.sh status
   ```

2. 両方のデバイスが同じLAN（192.168.3.x）にいるか確認

3. ファイアウォール設定を確認（Ubuntu側のufwは非アクティブなので問題なし）

4. Mac側で接続テスト
   ```bash
   curl http://192.168.3.86:3000
   ```

### ページが404エラー

開発サーバーを再起動してください：

```bash
./start-explorer.sh restart
```

## 高度な使い方

### 本番ビルド

```bash
npm run build
npm start
```

### 別のポートで起動（手動）

```bash
PORT=8080 npm run dev
# アクセス: http://192.168.3.86:8080
```

### カスタマイズ

#### 更新間隔の変更

`lib/constants.ts` を編集：

```typescript
export const REFRESH_INTERVAL = 5000; // ミリ秒単位
```

#### カラーテーマの変更

`tailwind.config.js` または各コンポーネントのクラス名を編集

#### 表示件数の変更

`lib/constants.ts`:

```typescript
export const ITEMS_PER_PAGE = 20;
```

## 開発

### コード整形

```bash
npm run lint
```

### 型チェック

TypeScriptの型チェックは自動的に行われます。

### デバッグモード

開発サーバーをフォアグラウンドで起動：

```bash
npm run dev
```

## パフォーマンス最適化

- ブロックデータは取得後キャッシュ（不変データのため）
- 最新データのみ定期的に更新
- トランザクション取得は並列処理
- 大量データはページネーション対応

## セキュリティ

- **Read-Only**: 秘密鍵は扱わない
- **ローカル専用**: インターネット接続不要
- **環境変数**: 機密情報は`.env.local`で管理

## よくある質問（FAQ）

### Q: ブロックが表示されない

A: GOWENETノードが起動しているか確認してください。`./start-explorer.sh status` を使うと自動チェックされます。

### Q: MacからアクセスできるIPアドレスは？

A: `http://192.168.3.86:3000` です。

### Q: トランザクションがない場合は？

A: GOWENETで何もトランザクションが実行されていない場合、「No transactions found」と表示されます。

### Q: バックグラウンドで起動していますか？

A: はい。`./start-explorer.sh start` はバックグラウンドで起動します。ターミナルを閉じても動作し続けます。

### Q: ログはどこに保存されますか？

A: プロジェクトルートの `explorer.log` に保存されます。`tail -f explorer.log` でリアルタイム表示できます。

### Q: 複数のノードがある場合は？

A: `.env.local`のRPC URLを目的のノードのIPとポートに変更してください。

### Q: エクスプローラーが起動しているか確認するには？

A: `./start-explorer.sh status` を実行してください。

## 自動起動設定（オプション）

サーバー起動時に自動起動したい場合、systemdサービスを作成できます：

```bash
sudo nano /etc/systemd/system/gowenet-explorer.service
```

```ini
[Unit]
Description=GOWENET Block Explorer
After=network.target

[Service]
Type=forking
User=hirofj
WorkingDirectory=/home/hirofj/gowenet-explorer
ExecStart=/home/hirofj/gowenet-explorer/start-explorer.sh start
ExecStop=/home/hirofj/gowenet-explorer/start-explorer.sh stop
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable gowenet-explorer
sudo systemctl start gowenet-explorer
```

## ライセンス

MIT License

## サポート

問題が発生した場合：

1. `./start-explorer.sh status` で状態確認
2. `cat explorer.log` でログ確認
3. GOWENETノードが稼働中か確認
4. `.env.local`の設定を確認（ポート9654）
5. Node.jsバージョンを確認（v20以上）

## 今後の拡張案

- [ ] Validator情報ページ
- [ ] トランザクション履歴のエクスポート機能
- [ ] ダークモード対応
- [ ] WebSocket対応（リアルタイム更新）
- [ ] コントラクトABI表示
- [ ] 統計グラフ表示
- [ ] ページネーション改善

## 変更履歴

### Version 1.0.0 (2025-11-07)
- 初回リリース
- ダッシュボード、ブロック、トランザクション、アドレス詳細ページ
- start/stop/restart/statusコマンド対応
- バックグラウンド実行対応
- LAN内デバイスからのアクセス対応

---

**GOWENET Block Explorer** - Built with Next.js & ethers.js

Version: 1.0.0 | Last Updated: 2025-11-07
