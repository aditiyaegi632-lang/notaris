import React, { useState } from 'react';
import { useNotaris } from '../context/NotarisContext';
import { formatTanggalIndo, exportKeCSV } from '../utils/formatters';
import {
  BookOpen,
  Printer,
  Download,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  Scale,
  FileCheck
} from 'lucide-react';

export const RepertoriumView: React.FC = () => {
  const {
    berkasList,
    profilKantor,
    setSelectedBerkas,
    setIsDetailOpen,
    setPrintModalType
  } = useNotaris();

  const [filterKategori, setFilterKategori] = useState<'SEMUA' | 'NOTARIS' | 'PPAT'>('SEMUA');
  const [filterBulan, setFilterBulan] = useState<string>('2025-05'); // default Mei 2025 (sesuai sample data)
  const [searchRep, setSearchRep] = useState<string>('');

  // Akta yang sudah punya nomor akta atau sudah di tahap drafting/penandatanganan ke atas
  const berkasRepertorium = berkasList.filter(b => {
    if (!b.nomorAkta && !b.nomorRepertorium && b.tahap === 'PENERIMAAN_BERKAS') return false;
    if (filterKategori !== 'SEMUA' && b.kategori !== filterKategori) return false;
    
    // Check month if date exists
    const tgl = b.tanggalAkta || b.tanggalMasuk;
    if (filterBulan && tgl && !tgl.startsWith(filterBulan)) {
      // allow if no date set
    }

    if (searchRep.trim()) {
      const q = searchRep.toLowerCase();
      const match =
        (b.nomorAkta && b.nomorAkta.toLowerCase().includes(q)) ||
        (b.nomorRepertorium && b.nomorRepertorium.toLowerCase().includes(q)) ||
        b.jenisAkta.toLowerCase().includes(q) ||
        b.namaKlien.toLowerCase().includes(q) ||
        b.pihakPertama.nama.toLowerCase().includes(q) ||
        b.pihakKedua.nama.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleExportCSV = () => {
    exportKeCSV(berkasRepertorium, `buku_repertorium_${filterBulan || 'semua'}.csv`);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-slate-900 text-white">
                Buku Daftar Akta Resmi
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Sesuai UU Jabatan Notaris & Peraturan PPAT
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              Buku Repertorium Notaris & PPAT
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Pencatatan resmi nomor urut akta, tanggal, penghadap, dan status penyerahan salinan untuk laporan ke MPD & BPN
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setPrintModalType('repertorium')}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Cetak Laporan Bulanan (MPD/BPN)</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-300 cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Unduh CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Kategori */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Kategori:</span>
              <div className="inline-flex rounded-md p-0.5 bg-slate-100 border border-slate-200">
                {(['SEMUA', 'NOTARIS', 'PPAT'] as const).map(k => (
                  <button
                    key={k}
                    onClick={() => setFilterKategori(k)}
                    className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
                      filterKategori === k ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>

            {/* Bulan */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Periode Bulan:</span>
              <input
                type="month"
                value={filterBulan}
                onChange={e => setFilterBulan(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Search inside repertorium */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchRep}
              onChange={e => setSearchRep(e.target.value)}
              placeholder="Cari no. akta / pihak / repertorium..."
              className="w-full pl-8 pr-3 py-1 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Repertorium Table (Official Format) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-semibold">
                <th className="py-3 px-3 w-12 text-center">No.</th>
                <th className="py-3 px-3 whitespace-nowrap">Nomor Akta</th>
                <th className="py-3 px-3 whitespace-nowrap">Tanggal Akta</th>
                <th className="py-3 px-3 whitespace-nowrap">Sifat / Judul Akta</th>
                <th className="py-3 px-3">Nama Penghadap / Pihak</th>
                <th className="py-3 px-3 whitespace-nowrap text-center">Minuta</th>
                <th className="py-3 px-3 whitespace-nowrap text-center">Salinan</th>
                <th className="py-3 px-3">Lokasi Fisik & Keterangan</th>
                <th className="py-3 px-3 text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {berkasRepertorium.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    Belum ada data akta di Buku Repertorium pada filter ini.
                  </td>
                </tr>
              ) : (
                berkasRepertorium.map((b, index) => {
                  const isMinutaDone = ['PENANDATANGANAN', 'PROSES_BPN_SK', 'PENJILIDAN_SALINAN', 'SELESAI'].includes(
                    b.tahap
                  );
                  const isSalinanDone = ['PENJILIDAN_SALINAN', 'SELESAI'].includes(b.tahap);

                  return (
                    <tr
                      key={b.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* No. Urut */}
                      <td className="py-3 px-3 text-center font-bold text-slate-600">
                        {index + 1}
                      </td>

                      {/* Nomor Akta */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-mono font-bold text-slate-900">
                          {b.nomorAkta || '-'}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {b.nomorRepertorium || '-'}
                        </div>
                      </td>

                      {/* Tanggal Akta */}
                      <td className="py-3 px-3 whitespace-nowrap text-slate-700">
                        {formatTanggalIndo(b.tanggalAkta || b.tanggalMasuk)}
                      </td>

                      {/* Sifat / Judul Akta */}
                      <td className="py-3 px-3 max-w-xs">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                              b.kategori === 'PPAT'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-sky-100 text-sky-800'
                            }`}
                          >
                            {b.kategori}
                          </span>
                          <span className="font-semibold text-slate-900">
                            {b.jenisAkta}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-2">
                          {b.judulPekerjaan}
                        </p>
                      </td>

                      {/* Pihak Penghadap */}
                      <td className="py-3 px-3 max-w-sm">
                        <div className="space-y-1">
                          <div className="text-slate-900">
                            <span className="font-semibold">1. {b.pihakPertama.nama}</span>
                            <span className="text-[10px] text-slate-500 block">
                              ({b.pihakPertama.peran}) • NIK: {b.pihakPertama.nik}
                            </span>
                          </div>
                          <div className="text-slate-900">
                            <span className="font-semibold">2. {b.pihakKedua.nama}</span>
                            <span className="text-[10px] text-slate-500 block">
                              ({b.pihakKedua.peran}) • NIK: {b.pihakKedua.nik}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Minuta */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {isMinutaDone ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3" /> Ada
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500">
                            <Clock className="w-3 h-3" /> Draft
                          </span>
                        )}
                      </td>

                      {/* Salinan */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {isSalinanDone ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-300">
                            <FileCheck className="w-3 h-3" /> Diserahkan
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700">
                            Proses
                          </span>
                        )}
                      </td>

                      {/* Lokasi Fisik */}
                      <td className="py-3 px-3 text-slate-600 max-w-xs">
                        <div className="font-medium text-slate-800 text-[11px]">
                          {b.lokasiFisikMap || 'Rak Arsip Kantor'}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          No. Berkas: {b.nomorBerkas}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedBerkas(b);
                            setIsDetailOpen(true);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors cursor-pointer"
                        >
                          Buka
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
