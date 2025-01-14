import fs from 'fs';
import pdf from 'pdf-parse';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini APIの初期化
const genAI = new GoogleGenerativeAI('AIzaSyDYddIoMtru8Oeh60lYZV9CrHLw3YYgEAY', {
  apiVersion: 'v1alpha'
});

/**
 * PDFファイルを解析し、Gemini APIを使用して分析を行う
 * @param {string} filePath - アップロードされたPDFファイルのパス
 * @returns {Promise<Object>} 分析結果
 */
export async function analyzePdf(filePath) {
  try {
    // PDFファイルの読み込み
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer);
    
    // Gemini APIモデルの設定
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-thinking-exp"
    });

    // プロンプトの作成
    const prompt = `
    以下は企業の決算書の内容です。この内容について以下の観点から分析してください：
    
    1. 収益性分析：
      - 売上高や利益の推移
      - 主要な利益率（売上総利益率、営業利益率など）
    
    2. 財務健全性分析：
      - 負債比率
      - 流動性
      - 自己資本比率
    
    3. 成長性分析：
      - 前年比での成長率
      - 将来の成長可能性
    
    4. リスク要因：
      - 財務上の懸念点
      - 外部環境によるリスク
    
    分析内容：
    ${pdfData.text}
    `;

    // Gemini APIによる分析実行
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // 思考プロセスと分析結果を分離
    let analysis = '';
    let thoughts = '';
    
    for (const part of response.candidates[0].content.parts) {
      if (part.thought === true) {
        thoughts += part.text + '\n';
      } else {
        analysis += part.text + '\n';
      }
    }

    // 一時ファイルの削除
    fs.unlinkSync(filePath);

    // 分析結果を構造化して返却
    return {
      success: true,
      analysis: analysis.trim(),
      thoughts: thoughts.trim(),
      metadata: {
        pageCount: pdfData.numpages,
        documentInfo: pdfData.info
      }
    };

  } catch (error) {
    console.error('PDF分析エラー:', error);
    throw new Error('PDF分析中にエラーが発生しました');
  }
}
