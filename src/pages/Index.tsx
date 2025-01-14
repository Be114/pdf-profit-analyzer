import { useState } from 'react';
import { Link } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import AnalysisResult from '../components/AnalysisResult';
import AnalysisHistory from '../components/AnalysisHistory';
import AnalysisChart from '../components/AnalysisChart';
import { analyzePdf, type AnalysisResult as AnalysisResultType } from '../lib/pdfAnalyzer';
import { useToast } from '../components/ui/use-toast';
import { Button } from '../components/ui/button';
import { BarChart3 } from 'lucide-react';

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState<AnalysisResultType | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResultType[]>([]);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    try {
      setIsAnalyzing(true);
      const analysis = await analyzePdf(file);
      setCurrentResult(analysis);
      setAnalysisHistory(prev => [analysis, ...prev]);
    } catch (error) {
      toast({
        title: 'エラー',
        description: 'PDFの分析中にエラーが発生しました。',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleHistorySelect = (analysis: AnalysisResultType) => {
    setCurrentResult(analysis);
    toast({
      title: '過去の分析を表示',
      description: `${analysis.companyName}の分析結果を表示しています。`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">決算書分析アシスタント</h1>
          <Link to="/compare">
            <Button variant="outline" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              比較ページへ
            </Button>
          </Link>
        </div>
        
        <p className="text-gray-600 text-center mb-8">
          企業の決算情報PDFをアップロードして、投資判断をサポート
        </p>
        
        <div className="space-y-8">
          <FileUpload onFileSelect={handleFileSelect} />
          
          {isAnalyzing && (
            <div className="text-center space-y-4">
              <LoadingSpinner />
              <p className="text-gray-600">決算書を分析中...</p>
            </div>
          )}
          
          {currentResult && <AnalysisResult {...currentResult} />}
          
          {analysisHistory.length > 1 && (
            <AnalysisChart analyses={analysisHistory} />
          )}
          
          {analysisHistory.length > 0 && (
            <AnalysisHistory 
              analyses={analysisHistory} 
              onSelect={handleHistorySelect}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;