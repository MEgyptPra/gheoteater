
export interface VisitorData {
  timestamp: string;
  jenisKunjungan: 'Perorangan' | 'Rombongan';
  nama?: string;
  usia?: number;
  jenisKelamin?: 'L' | 'P';
  pekerjaan?: string;
  alamat?: string;
  desa?: string;
  kecamatan: string;
  ketuaRombongan?: string;
  instansi?: string;
  jumlahPersonil: number;
  jumlahL: number;
  jumlahP: number;
  rentangUsia?: string;
}

export interface DashboardStats {
  total: number;
  totalL: number;
  totalP: number;
  anak: number;
  remaja: number;
  dewasa: number;
  lansia: number;
  perorangan: number;
  rombongan: number;
  origins: Record<string, number>;
  pekerjaan: Record<string, number>;
}

export interface InsightReport {
  summary: string;
  recommendations: string[];
  trendingStatus: 'up' | 'down' | 'stable';
}
