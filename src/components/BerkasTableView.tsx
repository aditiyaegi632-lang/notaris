import React, { useState } from 'react';
import {
  TahapPekerjaan,
  TAHAPAN_LIST,
  DAFTAR_STAF_PIC,
  BerkasNotaris,
  StatusPembayaran
} from '../types';
import { useNotaris } from '../context/NotarisContext';
import {
  formatRupiah,
  formatTanggalIndo,
  hitungDeadline,
  hitungProgresTahap,
  exportKeCSV
} from '../utils/formatters';
import {
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  Printer,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';

export const BerkasTableView: React.FC = () => {
  const {
    berkasList,
    kategoriFilter,
    setKategoriFilter,
    searchQuery,
    setSearchQuery,
    setSelectedBerkas,
    setIsDetailOpen,
    openEditForm,
    openNewForm,
    deleteBerkas,
    setPrintModalType
  } = useNotaris();

  const [filterTahap, setFilterTahap] = useState<string>('SEMUA');
  const [filterPIC, setFilterPIC] = useState<string>('SEMUA');
  const [filterPrioritas, setFilterPrioritas] = useState<string>('SEMUA');
  const [filterBayar, setFilterBayar] = useState<string>('SEMUA');

  // Sorting
  const [sortField, setSortField] = useState<keyof BerkasNotaris>('tanggalMasuk');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const filtered = berkasList.filter(b => {
    if (kategoriFilter !== 'SEMUA' && b.kategori !== kategoriFilter) return false;
    if (filterTahap !== 'SEMUA' && b.tahap !== filterTahap) return false;
    if (filterPIC !== 'SEMUA' && b.picStaff !== filterPIC) return false;
    if (filterPrioritas !== 'SEMUA' && b.prioritas !== filterPrioritas) return false;
    if (filterBayar !== 'SEMUA' && b.keuangan.statusPembayaran !== filterBayar) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        b.nomorBerkas.toLowerCase().includes(q) ||
        b.judulPekerjaan.toLowerCase().includes(q) ||
        b.namaKlien.toLowerCase().includes(q) ||
        b.jenisAkta.toLowerCase().includes(q) ||
        (b.nomorAkta && b.nomorAkta.toLowerCase().includes(q)) ||
        (b.nomorRepertorium && b.nomorRepertorium.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === 'targetSelesai' || sortField === 'tanggalMasuk') {
      const aTime = new Date(aVal as string || '').getTime();
      const bTime = new Date(bVal as string || '').getTime();
      return sortAsc ? aTime - bTime : bTime - aTime;
    }

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return 0;
  });

  const handleSort = (field: keyof BerkasNotaris) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleExportCSV = () => {
    exportKeCSV(sorted, `daftar_pekerjaan_notaris_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Table Action Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              Tabel Monitoring Berkas Pekerjaan
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Menampilkan {sorted.length} dari total {berkasList.length} data berkas di kantor
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-300 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Ekspor CSV (Excel)</span>
            </button>

            <button
              onClick={openNewForm}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Berkas Baru</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-xs">
          {/* Tahap Filter */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
              Tahapan Pekerjaan
            </label>
            <select
              value={filterTahap}
              onChange={e => setFilterTahap(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-md px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="SEMUA">Semua Tahap (8)</option>
              {TAHAPAN_LIST.map(t => (
                <option key={t.key} value={t.key}>
                  {t.nomor}. {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* PIC Filter */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
              Staf PIC
            </label>
            <select
              value={filterPIC}
              onChange={e => setFilterPIC(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-md px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="SEMUA">Semua Staf</option>
              {DAFTAR_STAF_PIC.map(s => (
                <option key={s} value={s}>
                  {s.split(' ')[0]}
                </option>
              ))}
            </select>
          </div>

          {/* Prioritas Filter */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
              Prioritas
            </label>
            <select
              value={filterPrioritas}
              onChange={e => setFilterPrioritas(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-md px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="SEMUA">Semua Prioritas</option>
              <option value="URGENT">Urgent (Sangat Penting)</option>
              <option value="TINGGI">Tinggi</option>
              <option value="NORMAL">Normal</option>
              <option value="RENDAH">Rendah</option>
            </select>
          </div>

          {/* Status Bayar Filter */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
              Status Pembayaran
            </label>
            <select
              value={filterBayar}
              onChange={e => setFilterBayar(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-md px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="SEMUA">Semua Status Bayar</option>
              <option value="LUNAS">Lunas</option>
              <option value="DP">DP (Uang Muka)</option>
              <option value="BELUM_BAYAR">Belum Bayar</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterTahap('SEMUA');
                setFilterPIC('SEMUA');
                setFilterPrioritas('SEMUA');
                setFilterBayar('SEMUA');
                setSearchQuery('');
                setKategoriFilter('SEMUA');
              }}
              className="w-full py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md text-xs font-medium transition-colors border border-slate-200 cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold select-none">
                <th
                  onClick={() => handleSort('nomorBerkas')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100/80 whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>No. Berkas</span>
                    {sortField === 'nomorBerkas' && (sortAsc ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                  </div>
                </th>
                <th className="py-3 px-3 whitespace-nowrap">Kategori & Akta</th>
                <th className="py-3 px-3">Penghadap / Objek</th>
                <th
                  onClick={() => handleSort('tahap')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100/80 whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Tahap & Progres</span>
                    {sortField === 'tahap' && (sortAsc ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                  </div>
                </th>
                <th className="py-3 px-3 whitespace-nowrap">Staf PIC</th>
                <th
                  onClick={() => handleSort('targetSelesai')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100/80 whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Target SLA</span>
                    {sortField === 'targetSelesai' && (sortAsc ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                  </div>
                </th>
                <th className="py-3 px-3 whitespace-nowrap">Dokumen</th>
                <th className="py-3 px-3 whitespace-nowrap">Biaya & Bayar</th>
                <th className="py-3 px-3 text-right whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    Tidak ada berkas yang cocok dengan filter atau pencarian.
                  </td>
                </tr>
              ) : (
                sorted.map(berkas => {
                  const deadline = hitungDeadline(berkas.targetSelesai, berkas.tahap);
                  const progress = hitungProgresTahap(berkas.tahap);
                  const tahapCfg = TAHAPAN_LIST.find(t => t.key === berkas.tahap);
                  const totalDocs = berkas.kelengkapanDokumen.length;
                  const lengkapDocs = berkas.kelengkapanDokumen.filter(
                    d => d.status === 'LENGKAP'
                  ).length;

                  return (
                    <tr
                      key={berkas.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* No Berkas */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-mono font-bold text-slate-900">
                          {berkas.nomorBerkas}
                        </div>
                        {berkas.nomorAkta ? (
                          <div className="text-[10px] text-emerald-700 font-medium">
                            Akta No. {berkas.nomorAkta}
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-400">Belum nomor akta</div>
                        )}
                      </td>

                      {/* Kategori & Akta */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span
                            className={`px-1.5 py-0.2 text-[9px] font-bold rounded ${
                              berkas.kategori === 'PPAT'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-sky-100 text-sky-800 border border-sky-300'
                            }`}
                          >
                            {berkas.kategori}
                          </span>
                          {berkas.prioritas === 'URGENT' && (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-red-100 text-red-700 border border-red-300">
                              URGENT
                            </span>
                          )}
                        </div>
                        <div className="text-slate-800 font-semibold">{berkas.jenisAkta}</div>
                      </td>

                      {/* Penghadap / Objek */}
                      <td className="py-3 px-3 max-w-xs">
                        <div className="font-medium text-slate-900 truncate">
                          {berkas.namaKlien}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate" title={berkas.judulPekerjaan}>
                          {berkas.judulPekerjaan}
                        </div>
                      </td>

                      {/* Tahap */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-bold">
                            {tahapCfg?.nomor}
                          </span>
                          <span className="font-medium text-slate-800">
                            {tahapCfg?.label.split(' ')[0]} {tahapCfg?.label.split(' ')[1] || ''}
                          </span>
                        </div>
                        <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              berkas.tahap === 'SELESAI' ? 'bg-emerald-500' : 'bg-blue-600'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </td>

                      {/* PIC */}
                      <td className="py-3 px-3 whitespace-nowrap text-slate-600">
                        {berkas.picStaff.split(' ')[0]}
                      </td>

                      {/* Deadline */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] border ${deadline.badgeClass}`}>
                          {deadline.label}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Target: {formatTanggalIndo(berkas.targetSelesai)}
                        </div>
                      </td>

                      {/* Dokumen */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                            lengkapDocs === totalDocs
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {lengkapDocs}/{totalDocs} Lengkap
                        </span>
                      </td>

                      {/* Biaya */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">
                          {formatRupiah(berkas.keuangan.totalBiaya)}
                        </div>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            berkas.keuangan.statusPembayaran === 'LUNAS'
                              ? 'bg-emerald-100 text-emerald-800'
                              : berkas.keuangan.statusPembayaran === 'DP'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {berkas.keuangan.statusPembayaran}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setSelectedBerkas(berkas);
                              setIsDetailOpen(true);
                            }}
                            title="Lihat Detail Berkas"
                            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedBerkas(berkas);
                              setPrintModalType('disposisi');
                            }}
                            title="Cetak Lembar Disposisi Map"
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => openEditForm(berkas)}
                            title="Edit Berkas"
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Hapus berkas ${berkas.nomorBerkas} (${berkas.judulPekerjaan})?`)) {
                                deleteBerkas(berkas.id);
                              }
                            }}
                            title="Hapus Berkas"
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
