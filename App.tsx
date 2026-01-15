
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Users, MapPin, UserPlus, RefreshCw, AlertCircle, TrendingUp, Clock, 
  Download, Filter, ChevronDown, Building2, User
} from 'lucide-react';
import { VisitorData, DashboardStats, InsightReport } from './types';
import { SHEET_CSV_URL, DUMMY_DATA } from './constants';
import { StatCard } from './components/StatCard';
import { VisitorCharts } from './components/VisitorCharts';
import { SmartInsights } from './components/SmartInsights';
import { getSmartInsights } from './services/geminiService';

const App: React.FC = () => {
  const [rawData, setRawData] = useState<VisitorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<InsightReport | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(SHEET_CSV_URL);
      if (!response.ok) throw new Error("Gagal mengambil data sinkronisasi.");
      
      const text = await response.text();
      const rows = text.split('\n').filter(r => r.trim() !== "").slice(1);
      
      const parsed: VisitorData[] = rows.map(row => {
        const cols = row.split(',').map(c => c.replace(/^"|"$/g, '').trim());
        const jenis = cols[1] === 'Rombongan' ? 'Rombongan' : 'Perorangan';
        
        return {
          timestamp: cols[0],
          jenisKunjungan: jenis,
          nama: cols[2],
          usia: parseInt(cols[3]) || undefined,
          jenisKelamin: cols[4] as 'L' | 'P',
          pekerjaan: cols[5],
          alamat: cols[6],
          desa: cols[7],
          kecamatan: cols[8],
          ketuaRombongan: cols[9],
          instansi: cols[11],
          jumlahPersonil: parseInt(cols[14]) || 1,
          jumlahL: parseInt(cols[15]) || (cols[4] === 'L' ? 1 : 0),
          jumlahP: parseInt(cols[16]) || (cols[4] === 'P' ? 1 : 0),
          rentangUsia: cols[17] || ''
        };
      });

      setRawData(parsed.length > 0 ? parsed : DUMMY_DATA);
    } catch (err) {
      console.error(err);
      setError("Sinkronisasi gagal. Menampilkan data lokal.");
      setRawData(DUMMY_DATA);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const stats = useMemo((): DashboardStats => {
    const s: DashboardStats = {
      total: 0, totalL: 0, totalP: 0,
      anak: 0, remaja: 0, dewasa: 0, lansia: 0,
      perorangan: 0, rombongan: 0,
      origins: {}, pekerjaan: {}
    };

    rawData.forEach(d => {
      const count = d.jumlahPersonil;
      s.total += count;
      s.totalL += d.jumlahL;
      s.totalP += d.jumlahP;

      if (d.jenisKunjungan === 'Perorangan') s.perorangan++;
      else s.rombongan++;

      // Regional
      const loc = d.kecamatan || 'Luar Daerah';
      s.origins[loc] = (s.origins[loc] || 0) + count;

      // Profession
      const job = d.pekerjaan || (d.instansi ? 'Instansi/Sekolah' : 'Lainnya');
      s.pekerjaan[job] = (s.pekerjaan[job] || 0) + count;

      // Age Logic
      const ageStr = (d.rentangUsia || '').toLowerCase();
      if (d.usia) {
        if (d.usia < 12) s.anak++;
        else if (d.usia < 18) s.remaja++;
        else if (d.usia < 60) s.dewasa++;
        else s.lansia++;
      } else if (ageStr) {
        if (ageStr.includes('anak')) s.anak += count;
        else if (ageStr.includes('remaja')) s.remaja += count;
        else if (ageStr.includes('dewasa')) s.dewasa += count;
        else if (ageStr.includes('lansia')) s.lansia += count;
        else s.dewasa += count; // Fallback
      }
    });

    return s;
  }, [rawData]);

  useEffect(() => {
    if (rawData.length > 0 && !insights) {
      const loadInsights = async () => {
        setInsightsLoading(true);
        const res = await getSmartInsights(stats);
        setInsights(res);
        setInsightsLoading(false);
      };
      loadInsights();
    }
  }, [rawData, stats, insights]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
      <p className="text-slate-400 font-bold tracking-widest text-xs uppercase">Processing Master Data...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfdfe] pb-20">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <Building2 size={20} />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight">Geotheater Pro</h1>
              <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Master Buku Tamu</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchData} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-100 transition-all">
              <RefreshCw size={18} />
            </button>
            <button className="flex items-center gap-2 bg-indigo-600 px-5 py-2.5 rounded-xl text-white font-bold text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
              <Download size={16} /> Export
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-10 space-y-10">
        {error && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center gap-3 text-amber-800 text-sm font-bold">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Pengunjung" value={stats.total} icon={<Users size={24} />} color="bg-indigo-600" trend="+14%" />
          <StatCard title="Total Laki-Laki" value={stats.totalL} icon={<User size={24} />} color="bg-blue-500" />
          <StatCard title="Total Perempuan" value={stats.totalP} icon={<User size={24} />} color="bg-pink-500" />
          <StatCard title="Total Rombongan" value={stats.rombongan} icon={<Building2 size={24} />} color="bg-amber-500" />
        </section>

        <SmartInsights insights={insights} loading={insightsLoading} />

        <VisitorCharts data={rawData} stats={stats} />

        <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Clock size={20} className="text-indigo-500" /> Log Kunjungan Terbaru
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                  <th className="px-8 py-5">Jenis</th>
                  <th className="px-8 py-5">Nama / Instansi</th>
                  <th className="px-8 py-5 text-center">Personil</th>
                  <th className="px-8 py-5">Kecamatan</th>
                  <th className="px-8 py-5 text-right">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rawData.slice().reverse().slice(0, 10).map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-all">
                    <td className="px-8 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        row.jenisKunjungan === 'Rombongan' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {row.jenisKunjungan}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-sm">{row.nama || row.instansi || row.ketuaRombongan}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{row.pekerjaan || 'Rombongan Terdaftar'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-center">
                      <span className="font-black text-slate-900">{row.jumlahPersonil}</span>
                    </td>
                    <td className="px-8 py-4">
                      <span className="text-slate-500 font-medium text-xs">{row.kecamatan}</span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <span className="text-slate-400 font-bold text-[10px]">{row.timestamp}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
