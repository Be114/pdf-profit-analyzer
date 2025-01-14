# PDF Profit Analyzer

決算書PDFを自動で分析し、財務状況を詳細に解説するAPIサーバー。Gemini 2.0 Flash Thinkingモデルを使用して、高度な財務分析を提供します。

## 機能

- PDFファイルのアップロードと解析
- AIによる財務分析
  - 収益性分析
  - 財務健全性分析
  - 成長性分析
  - リスク要因の特定
- AIの思考プロセスの可視化
- 分析結果のJSON形式での提供

## セットアップ

1. リポジトリのクローン:
```bash
git clone https://github.com/yourusername/pdf-profit-analyzer.git
cd pdf-profit-analyzer
```

2. 依存関係のインストール:
```bash
npm install
```

3. 環境変数の設定:
```bash
# .envファイルを作成
GEMINI_API_KEY=your_api_key
```

4. サーバーの起動:
```bash
npm run dev
```

## API使用方法

### PDFファイルの分析
```bash
curl -X POST \
  http://localhost:3000/api/analyze \
  -H "Content-Type: multipart/form-data" \
  -F "pdf=@決算書.pdf"
```

### レスポンス形式
```json
{
  "success": true,
  "analysis": "財務分析の結果...",
  "thoughts": "分析の思考プロセス...",
  "metadata": {
    "pageCount": 10,
    "documentInfo": {
      "Title": "決算書2023"
    }
  }
}
```

## 技術スタック

- Node.js
- Express.js
- Google Gemini AI API
- pdf-parse
- multer（ファイルアップロード）

## 注意事項

- アップロードできるPDFファイルの最大サイズは5MBです
- PDFファイルは一時的にサーバーに保存され、処理後に自動的に削除されます
- APIキーは必ず環境変数として設定してください
