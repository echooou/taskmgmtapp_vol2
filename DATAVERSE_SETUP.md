# タスク管理アプリ - Dataverseテーブル設計

## テーブル名: Task (cr_task)

### フィールド定義

| 表示名 | スキーマ名 | データ型 | 必須 | 説明 |
|--------|------------|----------|------|------|
| タスク名 | cr_name | 1行テキスト (100文字) | ✓ | タスクの名前 |
| 顧客 | cr_customer | 1行テキスト (100文字) | ✓ | 顧客名 |
| カテゴリ | cr_category | 選択肢 | ✓ | 公共、製薬、GCIT、Downstream、Activity、その他 |
| 開始日 | cr_startdate | 日付のみ | ✓ | タスク開始日 |
| 終了予定日 | cr_duedate | 日付のみ | ✓ | タスク終了予定日 |
| ステータス | cr_status | 選択肢 | ✓ | 未着手、進行中、完了、保留 |
| 工数 | cr_workload | 10進数 (0.5刻み) | | 工数（時間） |
| 優先順位 | cr_priority | 整数 | | 並び順（小さいほど優先） |
| メモ | cr_memo | 複数行テキスト | | メモ・詳細 |
| 作成日時 | createdon | 日付と時刻 | 自動 | レコード作成日時 |
| 更新日時 | modifiedon | 日付と時刻 | 自動 | レコード更新日時 |

### 選択肢の値

**カテゴリ (cr_category)**
- 100000000: 公共
- 100000001: 製薬
- 100000002: GCIT
- 100000003: Downstream
- 100000004: Activity
- 100000005: その他

**ステータス (cr_status)**
- 100000000: 未着手
- 100000001: 進行中
- 100000002: 完了
- 100000003: 保留

## 作成手順

### 1. Power Apps ポータルでテーブルを作成

1. https://make.powerapps.com にアクセス
2. 左メニューから「テーブル」を選択
3. 「+ 新しいテーブル」→「列とデータを追加」を選択
4. テーブル名: "Task"
5. 表示名: "タスク"
6. 複数形の表示名: "タスク"
7. 上記のフィールドを追加

### 2. 接続を作成

1. Power Apps ポータル → 「接続」
2. 「+ 新しい接続」
3. "Microsoft Dataverse" を選択
4. 接続を作成
5. 接続IDをコピー

### 3. データソースを追加（CLI）

```bash
pac code add-data-source --apiId "shared_commondataserviceforapps" --connectionId "<接続ID>" --table "cr_tasks"
```

## 代替案: SharePoint リスト

SharePointリストを使用する場合:

```bash
pac code add-data-source --apiId "shared_sharepointonline" --connectionId "<接続ID>" --dataset "<サイトURL>" --table "<リスト名>"
```

## 実装後

データソースが追加されると、`power.config.json`に接続情報が追加されます。
その後、カスタムフックを実装してCRUD操作を行います。
