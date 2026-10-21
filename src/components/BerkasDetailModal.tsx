import React, { useState } from 'react';
import { useNotaris } from '../context/NotarisContext';
import {
  TAHAPAN_LIST,
  TahapPekerjaan,
  StatusDokumen,
  StatusPembayaran
} from '../types';
import {
  formatRupiah,
  formatTanggalIndo,
  formatTanggalWaktuIndo,
  hitungDeadline,
  hitungProgresTahap
} from '../utils/formatters';
import {
  X,
  Printer,
  Edit,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Building,
  User,
  DollarSign,
  Layers,
  History,
  Plus,
  Trash2,
  MapPin,
  FileText
} from 'lucide-react';

export const BerkasDetailModal: React.FC = () => {
  const {
    selectedBerkas,
    setSelectedBerkas,
    isDetailOpen,
    setIsDetailOpen,
    advanceTahap,
    setDirectTahap,
    updateStatusDokumen,
    addDokumenSyarat,
    deleteDokumenSyarat,
    updateKeuangan,
    openEditForm,
    setPrintModalType
  } = useNotaris();

  const [activeTab, setActiveTab] = useState<'info' | 'alur' | 'dokumen' | 'keuangan' | 'log'>('info');
  const [newDocNama, setNewDocNama] = useState('');
  const [newDocWajib, setNewDocWajib] = useState(true);
  const [bayarInput, setBayarInput] = useState<string>('');

  if (!isDetailOpen || !selectedBerkas) return null;

  const berkas = selectedBerkas;
  const deadline = hitungDeadline(berkas.targetSelesai, berkas.tahap);
  const progress = hitungProgresTahap(berkas.tahap);
  const currentTahapCfg = TAHAPAN_LIST.find(t => t.key === berkas.tahap);

  const handleAddDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocNama.trim()) return;
    addDokumenSyarat(berkas.id, newDocNama.trim(), newDocWajib);
    setNewDocNama('');
  };

  const handleUpdatePembayaran = () => {
    const val = parseFloat(bayarInput);
    if (!isNaN(val) && val >= 0) {
      updateKeuangan(berkas.id, { jumlahTerbayar: val });
      setBayarInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-start justify-between gap-3 shrink-0">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-mono text-sm sm:text-base font-bold text-emerald-400">
                {berkas.nomorBerkas}
              </span>
              <span
                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                  berkas.kategori === 'PPAT'
                    ? 'bg-amber-950 text-amber-300 border-amber-700'
                    : 'bg-sky-950 text-sky-300 border-sky-700'
                }`}
              >
                {berkas.kategori}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  berkas.prioritas === 'URGENT'
                    ? 'bg-red-950 text-red-300 border-red-700 animate-pulse'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                Prioritas: {berkas.prioritas}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white line-clamp-1">
              {berkas.jenisAkta}
            </h2>
            <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
              {berkas.judulPekerjaan}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setPrintModalType('disposisi');
              }}
              title="Cetak Lembar Disposisi Map Berkas"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg transition-colors cursor-pointer border border-slate-700 flex items-center gap-1 text-xs"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Disposisi</span>
            </button>
            <button
              onClick={() => openEditForm(berkas)}
              title="Edit Berkas"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg transition-colors cursor-pointer border border-slate-700 flex items-center gap-1 text-xs"
            >
              <Edit className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Edit</span>
            </button>
            <button
              onClick={() => setIsDetailOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tahap Quick Navigation Bar */}
        <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold">Tahap Saat Ini:</span>
            <span className="font-bold text-slate-900 bg-white px-2.5 py-1 rounded border border-slate-300 shadow-2xs">
              {currentTahapCfg?.nomor}. {currentTahapCfg?.label}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${deadline.badgeClass}`}>
              {deadline.label}
            </span>

            <div className="flex items-center gap-1">
              <button
                disabled={currentTahapCfg?.nomor === 1}
                onClick={() => advanceTahap(berkas.id, -1)}
                className="px-2 py-1 rounded bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 font-semibold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                &larr; Mundur
              </button>
              <button
                disabled={currentTahapCfg?.nomor === TAHAPAN_LIST.length}
                onClick={() => advanceTahap(berkas.id, 1)}
                className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                Maju Tahap &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 pt-2 border-b border-slate-200 bg-white overflow-x-auto text-xs shrink-0">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-2 px-3 font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'info'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Pihak & Info Objek</span>
          </button>

          <button
            onClick={() => setActiveTab('alur')}
            className={`py-2 px-3 font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'alur'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Alur Tahapan ({progress}%)</span>
          </button>

          <button
            onClick={() => setActiveTab('dokumen')}
            className={`py-2 px-3 font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'dokumen'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Checklist Syarat ({berkas.kelengkapanDokumen.filter(d => d.status === 'LENGKAP').length}/{berkas.kelengkapanDokumen.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('keuangan')}
            className={`py-2 px-3 font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'keuangan'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Keuangan & Titipan Pajak</span>
          </button>

          <button
            onClick={() => setActiveTab('log')}
            className={`py-2 px-3 font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'log'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Log Aktivitas ({berkas.riwayat.length})</span>
          </button>
        </div>

        {/* Modal Tab Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* TAB 1: INFO UMUM & PIHAK */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              {/* Para Pihak Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pihak Pertama */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                    Pihak Pertama ({berkas.pihakPertama.peran})
                  </span>
                  <div className="mt-2 text-sm font-bold text-slate-900">
                    {berkas.pihakPertama.nama}
                  </div>
                  <div className="mt-1 space-y-1 text-slate-600 text-xs">
                    <div>NIK / No. Identitas: <span className="font-mono font-medium text-slate-900">{berkas.pihakPertama.nik}</span></div>
                    {berkas.pihakPertama.telepon && (
                      <div>Telepon: <span className="font-medium text-slate-900">{berkas.pihakPertama.telepon}</span></div>
                    )}
                    {berkas.pihakPertama.alamat && (
                      <div className="text-[11px] text-slate-500 mt-1">Alamat: {berkas.pihakPertama.alamat}</div>
                    )}
                  </div>
                </div>

                {/* Pihak Kedua */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">
                    Pihak Kedua ({berkas.pihakKedua.peran})
                  </span>
                  <div className="mt-2 text-sm font-bold text-slate-900">
                    {berkas.pihakKedua.nama}
                  </div>
                  <div className="mt-1 space-y-1 text-slate-600 text-xs">
                    <div>NIK / No. Identitas: <span className="font-mono font-medium text-slate-900">{berkas.pihakKedua.nik}</span></div>
                    {berkas.pihakKedua.telepon && (
                      <div>Telepon: <span className="font-medium text-slate-900">{berkas.pihakKedua.telepon}</span></div>
                    )}
                    {berkas.pihakKedua.alamat && (
                      <div className="text-[11px] text-slate-500 mt-1">Alamat: {berkas.pihakKedua.alamat}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Data Akta & Legalitas */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
                  Data Registrasi Akta & Lokasi Arsip
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] text-slate-500 block">Nomor Akta Resmi:</span>
                    <span className="font-mono font-bold text-slate-900 text-xs">
                      {berkas.nomorAkta || 'Belum Diberi Nomor'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] text-slate-500 block">Buku Repertorium:</span>
                    <span className="font-mono font-bold text-slate-900 text-xs">
                      {berkas.nomorRepertorium || 'Belum Dicatat'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] text-slate-500 block">Tanggal Penandatanganan:</span>
                    <span className="font-medium text-slate-900 text-xs">
                      {formatTanggalIndo(berkas.tanggalAkta || berkas.tanggalMasuk)}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] text-slate-500 block">Lokasi Fisik Map Arsip:</span>
                    <span className="font-semibold text-emerald-800 text-xs">
                      {berkas.lokasiFisikMap || 'Rak Arsip Utama'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Staf Pengampu & Mitra Instansi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                    Staf PIC Pengampu:
                  </span>
                  <span className="font-bold text-slate-900 text-xs block mt-1">
                    {berkas.picStaff}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                    Instansi / Bank Mitra Terkait:
                  </span>
                  <span className="font-bold text-slate-900 text-xs block mt-1">
                    {berkas.instansiMitra || 'Kantor Pertanahan (BPN) / Kemenkumham'}
                  </span>
                </div>
              </div>

              {/* Catatan Kendala */}
              {berkas.catatanKendala && (
                <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200">
                  <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block mb-1">
                    Catatan Status / Kendala Terkini:
                  </span>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    {berkas.catatanKendala}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ALUR TAHAPAN STEPPER */}
          {activeTab === 'alur' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Pilih tahapan langsung atau gunakan tombol Maju/Mundur untuk mengupdate alur pekerjaan berkas:
              </p>

              <div className="space-y-2">
                {TAHAPAN_LIST.map(t => {
                  const isCurrent = berkas.tahap === t.key;
                  const currentIdx = TAHAPAN_LIST.findIndex(x => x.key === berkas.tahap);
                  const isPassed = t.nomor <= currentIdx + 1;

                  return (
                    <div
                      key={t.key}
                      onClick={() => setDirectTahap(berkas.id, t.key)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isCurrent
                          ? 'bg-emerald-50 border-emerald-500 shadow-xs'
                          : isPassed
                          ? 'bg-slate-50 border-slate-300 hover:border-slate-400'
                          : 'bg-white border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                            isCurrent
                              ? 'bg-emerald-600 text-white'
                              : isPassed
                              ? 'bg-slate-300 text-slate-800'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {t.nomor}
                        </div>
                        <div>
                          <div className={`font-bold text-xs ${isCurrent ? 'text-emerald-900' : 'text-slate-800'}`}>
                            {t.label}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {t.deskripsi}
                          </div>
                        </div>
                      </div>

                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">
                          Tahap Aktif
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: CHECKLIST DOKUMEN & PERSYARATAN */}
          {activeTab === 'dokumen' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">
                    Kelengkapan Berkas Persyaratan Pembuatan Akta
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Klik status untuk mengubah (Lengkap / Belum / Menyusul)
                  </p>
                </div>
              </div>

              {/* Document List */}
              <div className="space-y-2">
                {berkas.kelengkapanDokumen.map(doc => (
                  <div
                    key={doc.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-xs">
                          {doc.nama}
                        </span>
                        {doc.wajib && (
                          <span className="text-[9px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded">
                            Wajib
                          </span>
                        )}
                      </div>
                      {doc.keterangan && (
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          Ket: {doc.keterangan}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Status Selector */}
                      <select
                        value={doc.status}
                        onChange={e =>
                          updateStatusDokumen(berkas.id, doc.id, e.target.value as StatusDokumen)
                        }
                        className={`text-xs font-bold px-2 py-1 rounded-md border cursor-pointer ${
                          doc.status === 'LENGKAP'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : doc.status === 'MENYUSUL'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-red-50 text-red-800 border-red-300'
                        }`}
                      >
                        <option value="LENGKAP">✓ LENGKAP</option>
                        <option value="MENYUSUL">⏳ MENYUSUL</option>
                        <option value="BELUM">✕ BELUM</option>
                      </select>

                      <button
                        onClick={() => deleteDokumenSyarat(berkas.id, doc.id)}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Hapus Syarat"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Custom Requirement */}
              <form
                onSubmit={handleAddDoc}
                className="mt-3 pt-3 border-t border-slate-200 flex flex-col sm:flex-row gap-2"
              >
                <input
                  type="text"
                  value={newDocNama}
                  onChange={e => setNewDocNama(e.target.value)}
                  placeholder="Tambah nama dokumen persyaratan lain (misal: Surat Kuasa Waris)..."
                  className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Syarat</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: KEUANGAN & TITIPAN PAJAK */}
          {activeTab === 'keuangan' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Rincian Komponen Biaya */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2.5">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
                    Rincian Komponen Tagihan
                  </h4>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Honorarium Jasa Notaris/PPAT:</span>
                    <span className="font-bold text-slate-900">{formatRupiah(berkas.keuangan.honorarium)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 text-amber-900">
                    <span>Titipan PPh Final (2.5%):</span>
                    <span className="font-bold">{formatRupiah(berkas.keuangan.titipanPPh)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 text-amber-900">
                    <span>Titipan BPHTB (5%):</span>
                    <span className="font-bold">{formatRupiah(berkas.keuangan.titipanBPHTB)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">PNBP (BPN / AHU Online):</span>
                    <span className="font-bold text-slate-900">{formatRupiah(berkas.keuangan.biayaPNBP)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Operasional & Materai:</span>
                    <span className="font-bold text-slate-900">{formatRupiah(berkas.keuangan.biayaOperasional)}</span>
                  </div>
                  <div className="flex justify-between pt-2 text-sm font-black text-slate-900">
                    <span>Total Tagihan:</span>
                    <span>{formatRupiah(berkas.keuangan.totalBiaya)}</span>
                  </div>
                </div>

                {/* Status Pelunasan & Update */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500 mb-2">
                      Status Pelunasan Klien
                    </h4>
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          berkas.keuangan.statusPembayaran === 'LUNAS'
                            ? 'bg-emerald-100 text-emerald-800'
                            : berkas.keuangan.statusPembayaran === 'DP'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        Status: {berkas.keuangan.statusPembayaran}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Jumlah Telah Terbayar:</span>
                        <span className="font-bold text-emerald-700">
                          {formatRupiah(berkas.keuangan.jumlahTerbayar)}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Sisa Kurang Bayar:</span>
                        <span className="font-bold text-red-700">
                          {formatRupiah(Math.max(0, berkas.keuangan.totalBiaya - berkas.keuangan.jumlahTerbayar))}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Input update bayar */}
                  <div className="pt-3 border-t border-slate-200">
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                      Update Total Kas Terbayar (Rp):
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={bayarInput}
                        onChange={e => setBayarInput(e.target.value)}
                        placeholder={`Contoh: ${berkas.keuangan.totalBiaya}`}
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleUpdatePembayaran}
                        className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 cursor-pointer"
                      >
                        Simpan
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateKeuangan(berkas.id, { jumlahTerbayar: berkas.keuangan.totalBiaya })}
                      className="mt-2 text-[10px] text-emerald-700 hover:underline font-semibold cursor-pointer block"
                    >
                      Set Lunas Penuh (100%)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: LOG RIWAYAT */}
          {activeTab === 'log' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-xs">
                Log Catatan & Rekam Jejak Berkas
              </h4>
              <div className="space-y-2">
                {berkas.riwayat.map(log => (
                  <div
                    key={log.id}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                      <span className="font-semibold text-slate-700">{log.user}</span>
                      <span>{formatTanggalWaktuIndo(log.tanggal)}</span>
                    </div>
                    <div className="font-bold text-slate-800">{log.aksi}</div>
                    <p className="text-slate-600 text-[11px] mt-0.5">{log.keterangan}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="text-[11px] text-slate-500">
            Terdaftar: {formatTanggalIndo(berkas.tanggalMasuk)} • Target Selesai: {formatTanggalIndo(berkas.targetSelesai)}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPrintModalType('disposisi')}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Lembar Disposisi Map</span>
            </button>
            <button
              onClick={() => setIsDetailOpen(false)}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
