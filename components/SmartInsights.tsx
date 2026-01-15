
import React from 'react';
import { Sparkles, ArrowUpRight, ArrowDownRight, Minus, Lightbulb } from 'lucide-react';
import { InsightReport } from '../types';

interface SmartInsightsProps {
  insights: InsightReport | null;
  loading: boolean;
}

export const SmartInsights: React.FC<SmartInsightsProps> = ({ insights, loading }) => {
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-[2.5rem] border border-indigo-100 animate-pulse">
        <div className="h-4 w-32 bg-indigo-200 rounded mb-4"></div>
        <div className="h-6 w-full bg-indigo-100 rounded mb-2"></div>
        <div className="h-6 w-3/4 bg-indigo-100 rounded"></div>
      </div>
    );
  }

  if (!insights) return null;

  const StatusIcon = {
    up: <ArrowUpRight className="text-emerald-500" />,
    down: <ArrowDownRight className="text-rose-500" />,
    stable: <Minus className="text-amber-500" />
  }[insights.trendingStatus];

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[2.5rem] shadow-xl text-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
            <Sparkles size={20} />
          </div>
          <h2 className="text-lg font-bold tracking-tight">Smart AI Insights</h2>
        </div>
        <div className="px-4 py-1.5 bg-white/20 rounded-full backdrop-blur-md flex items-center gap-2 border border-white/20">
          <span className="text-xs font-bold uppercase tracking-widest">Status: {insights.trendingStatus}</span>
          <div className="bg-white p-0.5 rounded-full">
            {StatusIcon}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-indigo-100/80 leading-relaxed text-sm">
            {insights.summary}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.recommendations.map((rec, i) => (
            <div key={i} className="flex gap-3 bg-white/10 p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors">
              <Lightbulb size={18} className="shrink-0 text-amber-300" />
              <p className="text-xs font-medium leading-normal">{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
