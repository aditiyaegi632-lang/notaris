import React, { useState } from 'react';
import { useNotaris } from '../context/NotarisContext';
import { ProfilKantor } from '../types';
import {
  X,
  Save,
  Download,
  Upload,
  RotateCcw,
  Building,
  ShieldCheck,
  CheckCircle2,
  Server,
  FileCode
} from 'lucide-react';

export const PengaturanModal: React.FC = () => {
  const {
    isPengaturanOpen,
    setIsPengaturanOpen,
    profilKantor,
    updateProfilKantor,
    berkasList,
    resetDataKeDefault,
    importDataFromJson
  } = useNotaris();

  const [formProfil, setFormProfil] = useState<ProfilKantor>({ ...profilKantor });
  const [importMessage, setImportMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isPengaturanOpen) return null;

  const handleSaveProfil = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfilKantor(formProfil);
    alert('Profil kantor Notaris & PPAT berhasil disimpan!');
  };

  const handleExportJSON = () => {
    const backupData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      profilKantor,
      berkasList
    };
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonStr);
    downloadAnchor.setAttribute(
      'download',
      `backup_notaris_ppat_${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = event => {
        if (event.target?.result) {
          const res = importDataFromJson(event.target.result as string);
          setImportMessage({
            text: res.message,
            isError: !res.success
          });
        }
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between gap-3 shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-emerald-400" />
              Pengaturan Kantor & Format Vercel
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Kelola profil kantor Notaris & PPAT, kop surat resmi, serta ekspor-impor cadangan data
            </p>
          </div>
          <button
            onClick={() => setIsPengaturanOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          {/* Section 1: Vercel Ready Status Information */}
          <div className="bg-slate-900 text-slate-200 rounded-xl p-4 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <Server className="w-4 h-4 text-emerald-400" />
                <span>Format Arsitektur Vercel (Production Ready)</span>
              </div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                100% Terverifikasi
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Aplikasi ini dikembangkan menggunakan struktur standar <strong>Vite SPA</strong> dengan file <code>vercel.json</code> yang sudah disetel untuk rute rewrite <code>/(.*) &rarr; /index.html</code>. Dapat dideploy langsung ke akun Vercel Anda tanpa konfigurasi manual tambahan.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[11px]">
              <div>
                <span className="text-slate-400 block">Framework Preset:</span>
                <span className="font-bold text-white">Vite</span>
              </div>
              <div>
                <span className="text-slate-400 block">Build Command:</span>
                <span className="font-mono text-emerald-400">npm run build</span>
              </div>
              <div>
                <span className="text-slate-400 block">Output Directory:</span>
                <span className="font-mono text-emerald-400">dist</span>
              </div>
            </div>
          </div>

          {/* Section 2: Profil Kantor Form */}
          <form onSubmit={handleSaveProfil} className="space-y-4">
            <div className="flex items-center justify-between border-b pb-1">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
                Identitas Resmi Kantor Notaris & PPAT
              </h3>
              <button
                type="submit"
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Profil</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Nama Notaris & Gelar Lengkap *
                </label>
                <input
                  type="text"
                  value={formProfil.namaNotaris}
                  onChange={e => setFormProfil({ ...formProfil, namaNotaris: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Jabatan Resmi *
                </label>
                <input
                  type="text"
                  value={formProfil.jabatan}
                  onChange={e => setFormProfil({ ...formProfil, jabatan: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Wilayah Kerja Jabatan *
                </label>
                <input
                  type="text"
                  value={formProfil.wilayahKerja}
                  onChange={e => setFormProfil({ ...formProfil, wilayahKerja: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Nama Admin / Staf Penata Usaha
                </label>
                <input
                  type="text"
                  value={formProfil.namaAdmin}
                  onChange={e => setFormProfil({ ...formProfil, namaAdmin: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  SK Notaris (Kemenkumham) *
                </label>
                <input
                  type="text"
                  value={formProfil.skKemenkumham}
                  onChange={e => setFormProfil({ ...formProfil, skKemenkumham: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  SK PPAT (Kementerian ATR/BPN) *
                </label>
                <input
                  type="text"
                  value={formProfil.skBpn}
                  onChange={e => setFormProfil({ ...formProfil, skBpn: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">
                  Alamat Lengkap Kantor
                </label>
                <input
                  type="text"
                  value={formProfil.alamatKantor}
                  onChange={e => setFormProfil({ ...formProfil, alamatKantor: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  No. Telepon / WhatsApp Kantor
                </label>
                <input
                  type="text"
                  value={formProfil.teleponKantor}
                  onChange={e => setFormProfil({ ...formProfil, teleponKantor: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Email Kantor
                </label>
                <input
                  type="email"
                  value={formProfil.emailKantor}
                  onChange={e => setFormProfil({ ...formProfil, emailKantor: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>
          </form>

          {/* Section 3: Cadangan Data (Backup & Restore) */}
          <div className="pt-3 border-t border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
              Cadangan & Pemulihan Data (Backup & Restore JSON)
            </h3>
            <p className="text-slate-600">
              Seluruh data pekerjaan tersimpan aman di peramban (localStorage). Anda dapat mengunduh salinan berkas sebagai file JSON atau memulihkannya kapan saja.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleExportJSON}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Unduh Cadangan JSON ({berkasList.length} Berkas)</span>
              </button>

              <label className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold text-xs flex items-center gap-1.5 border border-slate-300 transition-colors cursor-pointer">
                <Upload className="w-4 h-4 text-blue-600" />
                <span>Pulihkan dari File JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Apakah Anda yakin ingin mereset seluruh data ke contoh awal kantor notaris? Data perubahan yang belum diunduh akan terhapus.')) {
                    resetDataKeDefault();
                    alert('Data telah direset ke contoh default.');
                  }
                }}
                className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-semibold text-xs flex items-center gap-1.5 border border-red-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset ke Contoh Default</span>
              </button>
            </div>

            {importMessage && (
              <div
                className={`p-3 rounded-lg text-xs font-semibold ${
                  importMessage.isError
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}
              >
                {importMessage.text}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={() => setIsPengaturanOpen(false)}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold text-xs hover:bg-slate-800 cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
