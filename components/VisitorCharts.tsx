
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts';
import { VisitorData, DashboardStats } from '../types';

interface ChartsProps {
  data: VisitorData[];
  stats: DashboardStats;
}

export const VisitorCharts: React.FC<ChartsProps> = ({ data, stats }) => {
  const lineData = data.slice(-10).map(d => ({
    name: d.timestamp.split(' ')[0],
    val: d.jumlahPersonil
  }));

  const visitTypeData = [
    { name: 'Perorangan', value: stats.perorangan, color: '#6366f1' },
    { name: 'Rombongan', value: stats.rombongan, color: '#f59e0b' }
  ];

  const ageData = [
    { name: 'Anak', count: stats.anak, color: '#10b981' },
    { name: 'Remaja', count: stats.remaja, color: '#8b5cf6' },
    { name: 'Dewasa', count: stats.dewasa, color: '#3b82f6' },
    { name: 'Lansia', count: stats.lansia, color: '#6366f1' }
  ];

  const topJobs = Object.entries(stats.pekerjaan)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Types and Age */}
      <div className="lg:col-span-4 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between">
        <h2 className="text-lg font-bold text-slate-800 mb-6">Tipe Kunjungan</h2>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={visitTypeData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {visitTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-50 text-center">
          <div>
            <p className="text-xl font-black text-indigo-600">{stats.perorangan}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Personal</p>
          </div>
          <div>
            <p className="text-xl font-black text-amber-500">{stats.rombongan}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Grup</p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-8 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 mb-6">Distribusi Usia Pengunjung</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ageData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
              <Tooltip cursor={{fill: '#f8fafc'}} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {ageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="lg:col-span-12 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-6">Top Pekerjaan / Sektor</h2>
            <div className="space-y-4">
              {topJobs.map((job, idx) => (
                <div key={job.name} className="group">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">{job.name}</span>
                    <span className="text-[10px] font-black text-slate-400">{job.value}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full transition-all duration-1000" 
                      style={{ width: `${(job.value / stats.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-6">Asal Kecamatan Terbanyak</h2>
            <div className="space-y-4">
              {Object.entries(stats.origins).sort(([,a],[,b]) => b-a).slice(0, 5).map(([name, val]) => (
                <div key={name} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    <span className="text-xs font-bold text-slate-700">{name}</span>
                  </div>
                  <span className="px-3 py-1 bg-white text-indigo-600 rounded-lg text-[10px] font-black shadow-sm">
                    {val} Orang
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
