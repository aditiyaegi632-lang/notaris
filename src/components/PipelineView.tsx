import React, { useState } from 'react';
import {
  TAHAPAN_LIST,
  TahapPekerjaan,
  DAFTAR_STAF_PIC,
  BerkasNotaris
} from '../types';
import { useNotaris } from '../context/NotarisContext';
import {
  formatRupiah,
  formatTanggalIndo,
  hitungDeadline,
  hitungProgresTahap
} from '../utils/formatters';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertCircle,
  CheckCircle2,
  User,
  FileCheck,
  Building,
  Scale,
  Plus
} from 'lucide-react';

export const PipelineView: React.FC = () => {
  const {
    berkasList,
    advanceTahap,
    setSelectedBerkas,
    setIsDetailOpen,
    kategoriFilter,
    searchQuery,
    openNewForm
  } = useNotaris();

  const [filterStaf, setFilterStaf] = useState<string>('SEMUA');
  const [filterPrioritas, setFilterPrioritas] = useState<string>('SEMUA');

  // Filtered files
  const filtered = berkasList.filter(b => {
    if (kategoriFilter !== 'SEMUA' && b.kategori !== kategoriFilter) return false;
    if (filterStaf !== 'SEMUA' && b.picStaff !== filterStaf) return false;
    if (filterPrioritas !== 'SEMUA' && b.prioritas !== filterPrioritas) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        b.nomorBerkas.toLowerCase().includes(q) ||
        b.judulPekerjaan.toLowerCase().includes(q) ||
        b.namaKlien.toLowerCase().includes(q) ||
        b.jenisAkta.toLowerCase().includes(q) ||
        (b.nomorAkta && b.nomorAkta.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4 pb-12">
      {/* Pipeline Header with Controls */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Alur Monitoring 8 Tahapan Notaris & PPAT
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pantau dan geser progres berkas dari penerimaan awal hingga penjilidan salinan resmi & penyerahan
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* PIC Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Staf PIC:</span>
            <select
              value={filterStaf}
              onChange={e => setFilterStaf(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="SEMUA">Semua Staf ({berkasList.length})</option>
              {DAFTAR_STAF_PIC.map(s => (
                <option key={s} value={s}>
                  {s.split(' ')[0]} ({berkasList.filter(b => b.picStaff === s).length})
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Prioritas:</span>
            <select
              value={filterPrioritas}
              onChange={e => setFilterPrioritas(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="SEMUA">Semua Prioritas</option>
              <option value="URGENT">Urgent</option>
              <option value="TINGGI">Tinggi</option>
              <option value="NORMAL">Normal</option>
              <option value="RENDAH">Rendah</option>
            </select>
          </div>

          <button
            onClick={openNewForm}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Berkas</span>
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Kanban Columns */}
      <div className="overflow-x-auto pb-4 pt-1">
        <div className="inline-flex gap-4 min-w-full">
          {TAHAPAN_LIST.map((tahap, idx) => {
            const stageFiles = filtered.filter(b => b.tahap === tahap.key);
            const isFirst = idx === 0;
            const isLast = idx === TAHAPAN_LIST.length - 1;

            return (
              <div
                key={tahap.key}
                className="w-72 shrink-0 flex flex-col bg-slate-100/80 rounded-xl border border-slate-200/90 max-h-[calc(100vh-210px)]"
              >
                {/* Column Header */}
                <div className="p-3 border-b border-slate-200/90 bg-white rounded-t-xl sticky top-0 z-10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-bold">
                        {tahap.nomor}
                      </span>
                      Tahap {tahap.nomor}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {stageFiles.length}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 truncate" title={tahap.label}>
                    {tahap.label}
                  </h3>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                    {tahap.deskripsi}
                  </p>
                </div>

                {/* Column Body / Cards List */}
                <div className="p-2 space-y-2.5 overflow-y-auto flex-1 scrollbar-thin">
                  {stageFiles.length === 0 ? (
                    <div className="h-32 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-300 rounded-lg text-slate-400">
                      <Clock className="w-5 h-5 mb-1 text-slate-300" />
                      <p className="text-xs">Tidak ada berkas di tahap ini</p>
                    </div>
                  ) : (
                    stageFiles.map(berkas => {
                      const deadline = hitungDeadline(berkas.targetSelesai, berkas.tahap);
                      const totalDocs = berkas.kelengkapanDokumen.length;
                      const lengkapDocs = berkas.kelengkapanDokumen.filter(
                        d => d.status === 'LENGKAP'
                      ).length;

                      return (
                        <div
                          key={berkas.id}
                          className="bg-white rounded-lg p-3 border border-slate-200 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all group"
                        >
                          {/* Card Top: Berkas Number & Category Badge */}
                          <div className="flex items-center justify-between gap-1 mb-1.5">
                            <span className="text-xs font-mono font-bold text-slate-900 truncate">
                              {berkas.nomorBerkas}
                            </span>
                            <div className="flex items-center gap-1 shrink-0">
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                                  berkas.kategori === 'PPAT'
                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                    : 'bg-sky-50 text-sky-700 border-sky-200'
                                }`}
                              >
                                {berkas.kategori}
                              </span>
                              {berkas.prioritas === 'URGENT' && (
                                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-red-100 text-red-700 border border-red-300 animate-pulse">
                                  URGENT
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Deed type & Title */}
                          <div
                            onClick={() => {
                              setSelectedBerkas(berkas);
                              setIsDetailOpen(true);
                            }}
                            className="cursor-pointer"
                          >
                            <h4 className="text-xs font-bold text-slate-800 line-clamp-1 hover:text-emerald-700 transition-colors">
                              {berkas.jenisAkta}
                            </h4>
                            <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-snug">
                              {berkas.judulPekerjaan}
                            </p>
                          </div>

                          {/* Client & PIC */}
                          <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] space-y-1">
                            <div className="flex items-center justify-between text-slate-600">
                              <span className="truncate font-medium">{berkas.namaKlien}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-slate-500">
                              <User className="w-3 h-3 text-slate-400" />
                              <span className="truncate">{berkas.picStaff.split(' ')[0]}</span>
                            </div>
                          </div>

                          {/* Meta: Checklist & Deadline */}
                          <div className="mt-2 flex items-center justify-between gap-1 text-[10px]">
                            {/* Checklist docs */}
                            <span
                              className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded ${
                                lengkapDocs === totalDocs
                                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                              title={`${lengkapDocs} dari ${totalDocs} syarat lengkap`}
                            >
                              <FileCheck className="w-3 h-3" />
                              <span>{lengkapDocs}/{totalDocs} Syarat</span>
                            </span>

                            {/* Deadline Badge */}
                            <span
                              className={`px-1.5 py-0.5 rounded border text-[10px] font-medium ${deadline.badgeClass}`}
                            >
                              {deadline.label}
                            </span>
                          </div>

                          {/* Card Footer: Advance/Back Arrows & Detail */}
                          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                            <button
                              disabled={isFirst}
                              onClick={e => {
                                e.stopPropagation();
                                advanceTahap(berkas.id, -1);
                              }}
                              className={`p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer ${
                                isFirst ? 'opacity-20 cursor-not-allowed' : ''
                              }`}
                              title="Kembalikan ke tahap sebelumnya"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => {
                                setSelectedBerkas(berkas);
                                setIsDetailOpen(true);
                              }}
                              className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                            >
                              Detail Berkas
                            </button>

                            <button
                              disabled={isLast}
                              onClick={e => {
                                e.stopPropagation();
                                advanceTahap(berkas.id, 1);
                              }}
                              className={`p-1 rounded text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 cursor-pointer ${
                                isLast ? 'opacity-20 cursor-not-allowed' : ''
                              }`}
                              title="Majukan ke tahap berikutnya"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
