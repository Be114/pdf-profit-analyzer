import { TrendingUp, TrendingDown } from 'lucide-react';

interface FinancialMetrics {
  revenue: number;
  operatingIncome: number;
  netIncome: number;
  roe: number;
}

interface AnalysisResultProps {
  companyName: string;
  date: string;
  metrics: FinancialMetrics;
  recommendation: string;
  confidence: number;
}

const AnalysisResult = ({ companyName, date, metrics, recommendation, confidence }: AnalysisResultProps) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  const getRecommendationColor = () => {
    if (recommendation.includes('購入推奨')) return 'text-accent';
    if (recommendation.includes('非推奨')) return 'text-destructive';
    return 'text-secondary';
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold">{companyName}</h2>
        <p className="text-sm text-gray-500">分析日: {formatDate(date)}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-gray-500">売上高</p>
          <p className="text-xl font-mono font-semibold">{formatNumber(metrics.revenue)}</p>
        </div>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-gray-500">営業利益</p>
          <p className="text-xl font-mono font-semibold">{formatNumber(metrics.operatingIncome)}</p>
        </div>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-gray-500">当期純利益</p>
          <p className="text-xl font-mono font-semibold">{formatNumber(metrics.netIncome)}</p>
        </div>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-gray-500">ROE</p>
          <p className="text-xl font-mono font-semibold">{metrics.roe.toFixed(2)}%</p>
        </div>
      </div>
      
      <div className="border-t pt-6">
        <div className="flex items-center gap-2 mb-2">
          {recommendation.includes('購入推奨') ? (
            <TrendingUp className="w-6 h-6 text-accent" />
          ) : (
            <TrendingDown className="w-6 h-6 text-destructive" />
          )}
          <h3 className={`text-xl font-semibold ${getRecommendationColor()}`}>
            {recommendation}
          </h3>
        </div>
        <div className="bg-gray-200 h-2 rounded-full mt-2">
          <div
            className={`h-full rounded-full ${
              confidence > 0.7 ? 'bg-accent' : confidence > 0.4 ? 'bg-yellow-400' : 'bg-destructive'
            }`}
            style={{ width: `${confidence * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          信頼度: {(confidence * 100).toFixed(0)}%
        </p>
      </div>
    </div>
  );
};

export default AnalysisResult;