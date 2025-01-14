import express from 'express';
import multer from 'multer';
import { analyzePdf } from '../services/pdfAnalyzer.js';

const router = express.Router();
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('PDFファイルのみアップロード可能です'), false);
    }
  }
});

// PDFアップロードと分析エンドポイント
router.post('/analyze', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'PDFファイルが必要です' });
    }

    const result = await analyzePdf(req.file.path);
    res.json(result);
  } catch (error) {
    console.error('分析エラー:', error);
    res.status(500).json({ error: '分析中にエラーが発生しました' });
  }
});

export { router };
