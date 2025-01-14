import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { router as apiRouter } from './routes/api.js';

const app = express();
const port = process.env.PORT || 3000;

// ミドルウェアの設定
app.use(cors());
app.use(express.json());

// ファイルアップロード用の設定
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB制限
  }
});

// APIルートの設定
app.use('/api', apiRouter);

// サーバーの起動
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
