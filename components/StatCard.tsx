
import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, trend }) => {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className={`p-4 rounded-2xl ${color} text-white shadow-lg shadow-${color.split('-')[1]}-200/50`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-black text-slate-900 leading-none">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h3>
          {trend && <span className="text-xs font-bold text-emerald-500">{trend}</span>}
        </div>
      </div>
    </div>
  );
};
