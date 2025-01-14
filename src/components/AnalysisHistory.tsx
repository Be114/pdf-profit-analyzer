import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import type { AnalysisResult } from "@/lib/pdfAnalyzer";

interface AnalysisHistoryProps {
  analyses: AnalysisResult[];
  onSelect: (analysis: AnalysisResult) => void;
}

const AnalysisHistory = ({ analyses, onSelect }: AnalysisHistoryProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4">過去の分析履歴</h2>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>分析日</TableHead>
              <TableHead>企業名</TableHead>
              <TableHead>売上高</TableHead>
              <TableHead>判断</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {analyses.map((analysis) => (
              <TableRow key={analysis.id}>
                <TableCell>{formatDate(analysis.date)}</TableCell>
                <TableCell>{analysis.companyName}</TableCell>
                <TableCell>{formatNumber(analysis.metrics.revenue)}</TableCell>
                <TableCell>{analysis.recommendation}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSelect(analysis)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    詳細
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AnalysisHistory;