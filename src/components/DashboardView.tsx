import React from 'react';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  FileText,
  Building,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  Banknote,
  Landmark,
  FileSpreadsheet
} from 'lucide-react';
import { useNotaris } from '../context/NotarisContext';
import { TAHAPAN_LIST, TahapPekerjaan } from '../types';
import {
  formatRupiah,
  formatTanggalIndo,
  hitungDeadline,
  hitungProgresTahap
} from '../utils/formatters';

export const DashboardView: React.FC = () => {
  const {
    berkasList,
    setActiveTab,
    setSelectedBerkas,
    setIsDetailOpen,
    kategoriFilter,
    searchQuery,
    openNewForm,
    profilKantor
  } = useNotaris();

  // Filtered berkas
  const filteredBerkas = berkasList.filter(b => {
    if (kategoriFilter !== 'SEMUA' && b.kategori !== kategoriFilter) return false;
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

  const totalAktif = berkasList.filter(b => b.tahap !== 'SELESAI').length;
  const totalSelesai = berkasList.filter(b => b.tahap === 'SELESAI').length;

  // Deadline checks
  const urgentBerkas = berkasList.filter(b => {
    if (b.tahap === 'SELESAI') return false;
    const dl = hitungDeadline(b.targetSelesai, b.tahap);
    return dl.status === 'TERLAMBAT' || dl.status === 'MENDEKATI' || b.prioritas === 'URGENT';
  });

  // Financial aggregates
  const totalHonorarium = berkasList.reduce((acc, b) => acc + (b.keuangan.honorarium || 0), 0);
  const totalTitipanPajak = berkasList.reduce(
    (acc, b) => acc + (b.keuangan.titipanPPh || 0) + (b.keuangan.titipanBPHTB || 0),
    0
  );
  const totalPNBP = berkasList.reduce((acc, b) => acc + (b.keuangan.biayaPNBP || 0), 0);

  // Group by stage
  const stageCounts: Record<TahapPekerjaan, number> = {
    PENERIMAAN_BERKAS: 0,
    PENGECEKAN_BPN_AHU: 0,
    DRAFTING_MINUTA: 0,
    VALIDASI_PAJAK: 0,
    PENANDATANGANAN: 0,
    PROSES_BPN_SK: 0,
    PENJILIDAN_SALINAN: 0,
    SELESAI: 0
  };

  berkasList.forEach(b => {
    stageCounts[b.tahap] = (stageCounts[b.tahap] || 0) + 1;
  });

  // Kategori counts
  const totalNotaris = berkasList.filter(b => b.kategori === 'NOTARIS').length;
  const totalPPAT = berkasList.filter(b => b.kategori === 'PPAT').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Office Banner & Welcome */}
      <div className="bg-linear-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-6 shadow-sm border border-slate-700/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800/80">
                Sistem Monitoring Kantor Notaris & PPAT
              </span>
              <span className="text-xs text-slate-400">
                • {profilKantor.wilayahKerja}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {profilKantor.namaNotaris}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              SK Kemenkumham: {profilKantor.skKemenkumham} | {profilKantor.skBpn}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('pipeline')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Buka Alur Pipeline</span>
            </button>
            <button
              onClick={openNewForm}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs sm:text-sm font-semibold transition-all border border-white/20 flex items-center gap-2 cursor-pointer"
            >
              <span>+ Berkas Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* Urgent Warning SLA Alert Bar */}
      {urgentBerkas.length > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-amber-900">
                  Perhatian: Terdapat {urgentBerkas.length} Berkas Memerlukan Tindak Lanjut Segera
                </h3>
                <p className="text-xs text-amber-700 mt-0.5">
                  Berkas berstatus urgent, melewati target waktu, atau mendekati jatuh tempo (H-3):
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {urgentBerkas.map(b => {
                    const dl = hitungDeadline(b.targetSelesai, b.tahap);
                    return (
                      <button
                        key={b.id}
                        onClick={() => {
                          setSelectedBerkas(b);
                          setIsDetailOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-amber-300 hover:border-amber-500 text-xs text-slate-800 transition-colors shadow-2xs cursor-pointer"
                      >
                        <span className="font-semibold text-amber-900">{b.nomorBerkas}</span>
                        <span className="text-slate-500">• {b.namaKlien}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded border ${dl.badgeClass}`}>
                          {dl.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('tabel')}
              className="text-xs font-semibold text-amber-900 hover:text-amber-700 underline shrink-0 cursor-pointer"
            >
              Lihat di Tabel &rarr;
            </button>
          </div>
        </div>
      )}

      {/* 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Berkas Aktif */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Pekerjaan Berjalan
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{totalAktif}</span>
            <span className="text-xs font-medium text-slate-500">berkas aktif</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Notaris: {totalNotaris}</span>
            <span>•</span>
            <span>PPAT: {totalPPAT}</span>
          </div>
        </div>

        {/* Card 2: Berkas Selesai */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Selesai & Diserahkan
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-600">{totalSelesai}</span>
            <span className="text-xs font-medium text-slate-500">arsip tuntas</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Repertorium tercatat</span>
            <span className="text-emerald-600 font-medium">100% Salinan OK</span>
          </div>
        </div>

        {/* Card 3: Titipan Pajak Berjalan */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Titipan Pajak (Escrow)
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-bold text-slate-900">
              {formatRupiah(totalTitipanPajak)}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>PPh & BPHTB titipan klien</span>
          </div>
        </div>

        {/* Card 4: Honorarium & PNBP */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Honorarium Jasa Notaris
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-bold text-purple-900">
              {formatRupiah(totalHonorarium)}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>PNBP BPN/AHU: {formatRupiah(totalPNBP)}</span>
          </div>
        </div>
      </div>

      {/* Visual Tahapan Funnel Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              Alur Progres 8 Tahapan Notaris & PPAT
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Sebaran berkas aktif di setiap tahapan SOP kantor
            </p>
          </div>
          <button
            onClick={() => setActiveTab('pipeline')}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Tampilan Papan Kanban</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {TAHAPAN_LIST.map(t => {
            const count = stageCounts[t.key] || 0;
            const isFinished = t.key === 'SELESAI';
            return (
              <div
                key={t.key}
                onClick={() => setActiveTab('pipeline')}
                className={`p-3 rounded-lg border transition-all cursor-pointer hover:border-emerald-500 hover:shadow-xs ${
                  count > 0
                    ? 'bg-slate-50/80 border-slate-300'
                    : 'bg-white border-slate-200/80 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px]">
                    {t.nomor}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                      isFinished
                        ? 'bg-emerald-100 text-emerald-800'
                        : count > 0
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-slate-800 line-clamp-2 leading-snug">
                  {t.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Columns: Recent Files & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Active Files (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                Daftar Pekerjaan Berjalan Terkini
              </h2>
              <p className="text-xs text-slate-500">Klik baris untuk melihat detail lengkap atau cetak disposisi</p>
            </div>
            <button
              onClick={() => setActiveTab('tabel')}
              className="text-xs font-semibold text-slate-600 hover:text-emerald-600 flex items-center gap-1 cursor-pointer"
            >
              <span>Semua Berkas ({berkasList.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/70">
                  <th className="py-2.5 px-3">No. Berkas</th>
                  <th className="py-2.5 px-3">Kategori & Pekerjaan</th>
                  <th className="py-2.5 px-3">Penghadap / Klien</th>
                  <th className="py-2.5 px-3">Tahap Saat Ini</th>
                  <th className="py-2.5 px-3">Deadline</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBerkas.slice(0, 6).map(berkas => {
                  const deadline = hitungDeadline(berkas.targetSelesai, berkas.tahap);
                  const progress = hitungProgresTahap(berkas.tahap);
                  const tahapCfg = TAHAPAN_LIST.find(t => t.key === berkas.tahap);

                  return (
                    <tr
                      key={berkas.id}
                      onClick={() => {
                        setSelectedBerkas(berkas);
                        setIsDetailOpen(true);
                      }}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-3 font-mono font-semibold text-slate-800 whitespace-nowrap">
                        {berkas.nomorBerkas}
                        {berkas.nomorAkta && (
                          <span className="block text-[10px] text-slate-400 font-sans">
                            Akta No. {berkas.nomorAkta}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 max-w-xs">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span
                            className={`px-1.5 py-0.2 text-[10px] font-bold rounded ${
                              berkas.kategori === 'PPAT'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-sky-100 text-sky-800 border border-sky-300'
                            }`}
                          >
                            {berkas.kategori}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-700 truncate">
                            {berkas.jenisAkta}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate" title={berkas.judulPekerjaan}>
                          {berkas.judulPekerjaan}
                        </p>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-medium text-slate-800">{berkas.namaKlien}</div>
                        <div className="text-[10px] text-slate-400">PIC: {berkas.picStaff.split(' ')[0]}</div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-medium text-slate-700">
                            {tahapCfg?.nomor}. {tahapCfg?.label.split(' ')[0]}
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
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] border ${deadline.badgeClass}`}>
                          {deadline.label}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <span className="text-emerald-600 group-hover:text-emerald-700 font-semibold text-xs">
                          Buka &rarr;
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Office Fast Tools & Info */}
        <div className="space-y-4">
          {/* Box 1: Quick Notary Presets & Shortcuts */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Aksi Cepat Kantor
            </h3>
            <div className="space-y-2">
              <button
                onClick={openNewForm}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-800">+ Registrasi Berkas Baru</div>
                  <div className="text-[10px] text-slate-500">Daftarkan akta Notaris atau PPAT baru</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('repertorium')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-800">Buku Repertorium Digital</div>
                  <div className="text-[10px] text-slate-500">Cek nomor urut akta & cetak laporan MPD</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('keuangan')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-800">Monitoring Titipan Pajak</div>
                  <div className="text-[10px] text-slate-500">Cek status setor PPh & validasi BPHTB</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Box 2: Vercel Ready & Cloud Architecture Note */}
          <div className="bg-slate-900 text-slate-200 rounded-xl p-4 border border-slate-800 text-xs">
            <div className="flex items-center gap-2 font-bold text-white mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Status Sistem Vercel Ready</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Aplikasi ini dikompilasi secara otomatis sesuai arsitektur SPA Vercel (Vite, zero broken backend routes, instant client hydration, dan penyimpanan data terenkripsi di browser).
            </p>
            <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <span>Build Target: Vite SPA</span>
              <span className="text-emerald-400 font-semibold">100% Siap Deploy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
