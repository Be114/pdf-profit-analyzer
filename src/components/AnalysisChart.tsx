import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import type { AnalysisResult } from '@/lib/pdfAnalyzer';

interface AnalysisChartProps {
  analyses: AnalysisResult[];
}

const AnalysisChart = ({ analyses }: AnalysisChartProps) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(num);
  };

  const chartData = analyses.map(analysis => ({
    name: analysis.companyName,
    売上高: analysis.metrics.revenue,
    営業利益: analysis.metrics.operatingIncome,
    純利益: analysis.metrics.netIncome,
  }));

  const config = {
    売上高: {
      color: '#2563eb',
    },
    営業利益: {
      color: '#22c55e',
    },
    純利益: {
      color: '#eab308',
    },
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">財務指標の比較</h2>
      <div className="h-[400px]">
        <ChartContainer config={config}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={formatNumber} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid gap-2">
                      <div className="font-semibold">{label}</div>
                      {payload.map((entry) => (
                        <div
                          key={entry.name}
                          className="flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="h-2 w-2 rounded"
                              style={{ backgroundColor: entry.color }}
                            />
                            <span>{entry.name}</span>
                          </div>
                          <span className="font-mono">
                            {formatNumber(entry.value as number)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }}
            />
            <Legend />
            <Bar dataKey="売上高" fill={config.売上高.color} />
            <Bar dataKey="営業利益" fill={config.営業利益.color} />
            <Bar dataKey="純利益" fill={config.純利益.color} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default AnalysisChart;