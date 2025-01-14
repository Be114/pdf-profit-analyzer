import { useState } from 'react';
import { Link } from 'react-router-dom';
import AnalysisChart from '../components/AnalysisChart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCcw, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { AnalysisResult } from '@/lib/pdfAnalyzer';

const Compare = () => {
  const [selectedAnalyses, setSelectedAnalyses] = useState<AnalysisResult[]>([]);
  const [comparisonType, setComparisonType] = useState<'financial' | 'growth' | 'efficiency'>('financial');

  // 仮のデータ（実際のアプリケーションではAPIから取得）
  const availableAnalyses: AnalysisResult[] = [
    {
      id: "1",
      date: new Date().toISOString(),
      companyName: "サンプル株式会社A",
      metrics: {
        revenue: 1500000000,
        operatingIncome: 300000000,
        netIncome: 200000000,
        roe: 15.7,
      },
      recommendation: '購入推奨: 良好な財務状態と成長性',
      confidence: 0.85,
    },
    {
      id: "2",
      date: new Date().toISOString(),
      companyName: "サンプル株式会社B",
      metrics: {
        revenue: 2000000000,
        operatingIncome: 400000000,
        netIncome: 250000000,
        roe: 18.2,
      },
      recommendation: '購入推奨: 安定した収益性',
      confidence: 0.92,
    }
  ];

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

  const handleCompanySelect = (position: number, analysisId: string) => {
    const analysis = availableAnalyses.find(a => a.id === analysisId);
    if (!analysis) return;

    setSelectedAnalyses(prev => {
      const newAnalyses = [...prev];
      newAnalyses[position] = analysis;
      return newAnalyses.slice(0, 2); // 最大2社まで
    });
  };

  const handleRefresh = () => {
    // TODO: 分析データを再取得する処理を実装
    console.log('Refreshing data...');
  };

  const handleExport = () => {
    // TODO: データのエクスポート処理を実装
    console.log('Exporting data...');
  };

  const getComparisonMetrics = () => {
    switch (comparisonType) {
      case 'financial':
        return [
          { label: '売上高', key: 'revenue' },
          { label: '営業利益', key: 'operatingIncome' },
          { label: '純利益', key: 'netIncome' }
        ];
      case 'growth':
        return [
          { label: '売上高成長率', key: 'revenue' },
          { label: '利益成長率', key: 'operatingIncome' }
        ];
      case 'efficiency':
        return [
          { label: 'ROE', key: 'roe' },
          { label: '営業利益率', key: 'operatingIncome' }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                戻る
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">財務指標比較</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} className="gap-2">
              <RefreshCcw className="w-4 h-4" />
              更新
            </Button>
            <Button variant="outline" onClick={handleExport} className="gap-2">
              <Download className="w-4 h-4" />
              エクスポート
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">企業を選択</h2>
          <div className="grid grid-cols-2 gap-8">
            {[0, 1].map((index) => (
              <div key={index} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  企業 {index + 1}
                </label>
                <Select
                  value={selectedAnalyses[index]?.id}
                  onValueChange={(value) => handleCompanySelect(index, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="企業を選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableAnalyses.map((analysis) => (
                      <SelectItem key={analysis.id} value={analysis.id}>
                        {analysis.companyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>

        {selectedAnalyses.length === 2 && (
          <>
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">比較観点</h2>
              <RadioGroup
                value={comparisonType}
                onValueChange={(value: 'financial' | 'growth' | 'efficiency') => setComparisonType(value)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="financial" id="financial" />
                  <label htmlFor="financial">財務状況</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="growth" id="growth" />
                  <label htmlFor="growth">成長性</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="efficiency" id="efficiency" />
                  <label htmlFor="efficiency">効率性</label>
                </div>
              </RadioGroup>
            </div>

            <AnalysisChart analyses={selectedAnalyses} />

            <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>指標</TableHead>
                    <TableHead>{selectedAnalyses[0].companyName}</TableHead>
                    <TableHead>{selectedAnalyses[1].companyName}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getComparisonMetrics().map(({ label, key }) => (
                    <TableRow key={key}>
                      <TableCell>{label}</TableCell>
                      <TableCell>
                        {key === 'roe'
                          ? `${selectedAnalyses[0].metrics[key].toFixed(2)}%`
                          : formatNumber(selectedAnalyses[0].metrics[key])}
                      </TableCell>
                      <TableCell>
                        {key === 'roe'
                          ? `${selectedAnalyses[1].metrics[key].toFixed(2)}%`
                          : formatNumber(selectedAnalyses[1].metrics[key])}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}

        {selectedAnalyses.length < 2 && (
          <div className="text-center text-gray-500 mt-8 p-8 bg-white rounded-lg shadow">
            <p className="text-lg">2社を選択して比較を開始してください</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compare;