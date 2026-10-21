import React, { useState } from 'react';
import { useNotaris } from '../context/NotarisContext';
import { formatRupiah, formatTanggalIndo } from '../utils/formatters';
import {
  DollarSign,
  Landmark,
  Banknote,
  Receipt,
  CheckCircle2,
  AlertCircle,
  Printer,
  Search,
  ArrowUpRight
} from 'lucide-react';

export const KeuanganView: React.FC = () => {
  const {
    berkasList,
    updateKeuangan,
    setSelectedBerkas,
    setIsDetailOpen,
    setPrintModalType
  } = useNotaris();

  const [searchFin, setSearchFin] = useState('');
  const [filterBayar, setFilterBayar] = useState<string>('SEMUA');

  // Aggregates
  const totalHonorarium = berkasList.reduce((acc, b) => acc + (b.keuangan.honorarium || 0), 0);
  const totalPPh = berkasList.reduce((acc, b) => acc + (b.keuangan.titipanPPh || 0), 0);
  const totalBPHTB = berkasList.reduce((acc, b) => acc + (b.keuangan.titipanBPHTB || 0), 0);
  const totalPNBP = berkasList.reduce((acc, b) => acc + (b.keuangan.biayaPNBP || 0), 0);
  const totalSemuaBiaya = berkasList.reduce((acc, b) => acc + (b.keuangan.totalBiaya || 0), 0);
  const totalTerbayar = berkasList.reduce((acc, b) => acc + (b.keuangan.jumlahTerbayar || 0), 0);
  const sisaPiutang = Math.max(0, totalSemuaBiaya - totalTerbayar);

  const filtered = berkasList.filter(b => {
    if (filterBayar !== 'SEMUA' && b.keuangan.statusPembayaran !== filterBayar) return false;
    if (searchFin.trim()) {
      const q = searchFin.toLowerCase();
      const match =
        b.nomorBerkas.toLowerCase().includes(q) ||
        b.namaKlien.toLowerCase().includes(q) ||
        b.jenisAkta.toLowerCase().includes(q) ||
        b.judulPekerjaan.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-800">
                Escrow & Fee Tracker
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Pemisahan Dana Titipan Pajak vs Honorarium Notaris
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              Monitoring Keuangan & Titipan Pajak Klien
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola pembayaran honorarium, pemisahan uang titipan PPh/BPHTB yang harus disetorkan ke kas daerah/negara
            </p>
          </div>
        </div>
      </div>

      {/* 4 Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Titipan Pajak */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              Total Titipan Pajak
            </span>
            <Landmark className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-950 mt-2">
            {formatRupiah(totalPPh + totalBPHTB)}
          </div>
          <div className="mt-2 pt-2 border-t border-amber-200/60 text-[11px] text-amber-800 space-y-0.5">
            <div className="flex justify-between">
              <span>PPh Final (2.5%):</span>
              <span className="font-semibold">{formatRupiah(totalPPh)}</span>
            </div>
            <div className="flex justify-between">
              <span>BPHTB (5%):</span>
              <span className="font-semibold">{formatRupiah(totalBPHTB)}</span>
            </div>
          </div>
        </div>

        {/* Honorarium Notaris */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Honorarium Jasa
            </span>
            <Banknote className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-950 mt-2">
            {formatRupiah(totalHonorarium)}
          </div>
          <div className="mt-2 pt-2 border-t border-emerald-200/60 text-[11px] text-emerald-800">
            Pendapatan jasa kantor notaris/PPAT
          </div>
        </div>

        {/* Kas Terbayar */}
        <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
              Kas Diterima
            </span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-950 mt-2">
            {formatRupiah(totalTerbayar)}
          </div>
          <div className="mt-2 pt-2 border-t border-blue-200/60 text-[11px] text-blue-800">
            Dana riil telah disetor klien ke kantor
          </div>
        </div>

        {/* Sisa Piutang */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Sisa Piutang / Kurang
            </span>
            <AlertCircle className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-black text-slate-800 mt-2">
            {formatRupiah(sisaPiutang)}
          </div>
          <div className="mt-2 pt-2 border-t border-slate-200 text-[11px] text-slate-600">
            {sisaPiutang > 0 ? 'Menunggu pelunasan klien' : 'Semua berkas lunas'}
          </div>
        </div>
      </div>

      {/* Financial Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Table Header Filter */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Filter Status:</span>
            <div className="inline-flex rounded-md p-0.5 bg-slate-100 border border-slate-200 text-xs">
              {(['SEMUA', 'LUNAS', 'DP', 'BELUM_BAYAR'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setFilterBayar(s)}
                  className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                    filterBayar === s ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchFin}
              onChange={e => setSearchFin(e.target.value)}
              placeholder="Cari transaksi klien / berkas..."
              className="w-full pl-8 pr-3 py-1 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-3">No. Berkas & Klien</th>
                <th className="py-3 px-3">Pekerjaan</th>
                <th className="py-3 px-3 text-right">Honor Notaris</th>
                <th className="py-3 px-3 text-right">Titipan PPh</th>
                <th className="py-3 px-3 text-right">Titipan BPHTB</th>
                <th className="py-3 px-3 text-right">PNBP / Ops</th>
                <th className="py-3 px-3 text-right">Total Tagihan</th>
                <th className="py-3 px-3 text-right">Terbayar</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Kwitansi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(b => {
                const k = b.keuangan;
                return (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-900">{b.nomorBerkas}</div>
                      <div className="text-[11px] font-medium text-slate-600">{b.namaKlien}</div>
                    </td>

                    <td className="py-3 px-3 max-w-xs">
                      <div className="font-semibold text-slate-800 truncate">{b.jenisAkta}</div>
                      <div className="text-[10px] text-slate-500 truncate">{b.judulPekerjaan}</div>
                    </td>

                    <td className="py-3 px-3 text-right font-medium text-slate-800 whitespace-nowrap">
                      {formatRupiah(k.honorarium)}
                    </td>

                    <td className="py-3 px-3 text-right font-medium text-amber-900 whitespace-nowrap">
                      {k.titipanPPh > 0 ? formatRupiah(k.titipanPPh) : '-'}
                    </td>

                    <td className="py-3 px-3 text-right font-medium text-amber-900 whitespace-nowrap">
                      {k.titipanBPHTB > 0 ? formatRupiah(k.titipanBPHTB) : '-'}
                    </td>

                    <td className="py-3 px-3 text-right font-medium text-slate-700 whitespace-nowrap">
                      {formatRupiah(k.biayaPNBP + k.biayaOperasional)}
                    </td>

                    <td className="py-3 px-3 text-right font-bold text-slate-900 whitespace-nowrap">
                      {formatRupiah(k.totalBiaya)}
                    </td>

                    <td className="py-3 px-3 text-right font-bold text-emerald-700 whitespace-nowrap">
                      {formatRupiah(k.jumlahTerbayar)}
                    </td>

                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          k.statusPembayaran === 'LUNAS'
                            ? 'bg-emerald-100 text-emerald-800'
                            : k.statusPembayaran === 'DP'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {k.statusPembayaran}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedBerkas(b);
                          setPrintModalType('kwitansi');
                        }}
                        className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors cursor-pointer inline-flex items-center gap-1"
                        title="Cetak Kwitansi / Rincian Biaya"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-semibold">Kwitansi</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
