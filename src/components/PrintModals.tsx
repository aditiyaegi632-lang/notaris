import React from 'react';
import { useNotaris } from '../context/NotarisContext';
import {
  formatRupiah,
  formatTanggalIndo,
  hitungProgresTahap
} from '../utils/formatters';
import { TAHAPAN_LIST } from '../types';
import { Printer, X, Download } from 'lucide-react';

export const PrintModals: React.FC = () => {
  const {
    printModalType,
    setPrintModalType,
    selectedBerkas,
    profilKantor,
    berkasList
  } = useNotaris();

  if (!printModalType) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[96vh] print:max-h-none print:shadow-none print:border-none print:w-full print:rounded-none">
        {/* Modal Controls (Hidden in Print) */}
        <div className="bg-slate-900 text-white p-3 sm:p-4 flex items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-sm">
              {printModalType === 'disposisi' && 'Pratinjau Lembar Disposisi / Kartu Kendali Map'}
              {printModalType === 'repertorium' && 'Pratinjau Laporan Buku Repertorium Bulanan (MPD/BPN)'}
              {printModalType === 'kwitansi' && 'Pratinjau Kwitansi / Rincian Biaya Notaris'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Sekarang (Print / PDF)</span>
            </button>
            <button
              onClick={() => setPrintModalType(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 font-serif text-slate-900 bg-white print:p-0">
          {/* TEMPLATE 1: LEMBAR DISPOSISI MAP BERKAS */}
          {printModalType === 'disposisi' && selectedBerkas && (
            <div className="max-w-3xl mx-auto border-2 border-slate-800 p-6 sm:p-8 space-y-4 print:border-2 print:border-black">
              {/* Kop Kantor */}
              <div className="text-center border-b-2 border-slate-800 pb-3 font-sans">
                <h1 className="text-lg sm:text-xl font-extrabold uppercase tracking-tight text-slate-900">
                  {profilKantor.namaNotaris}
                </h1>
                <p className="text-xs font-semibold uppercase text-slate-700 tracking-wider">
                  {profilKantor.jabatan}
                </p>
                <p className="text-[11px] text-slate-600">
                  SK Kemenkumham: {profilKantor.skKemenkumham} | {profilKantor.skBpn}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {profilKantor.alamatKantor} • Telp: {profilKantor.teleponKantor}
                </p>
              </div>

              {/* Title */}
              <div className="text-center py-1 font-sans">
                <h2 className="text-sm font-extrabold uppercase tracking-wider underline">
                  LEMBAR KENDALI & DISPOSISI BERKAS
                </h2>
                <div className="flex justify-between items-center text-xs font-mono font-bold mt-2">
                  <span>NO. BERKAS: {selectedBerkas.nomorBerkas}</span>
                  <span>KATEGORI: {selectedBerkas.kategori}</span>
                  <span>LOKASI MAP: {selectedBerkas.lokasiFisikMap || '-'}</span>
                </div>
              </div>

              {/* Table Info Transaksi */}
              <table className="w-full text-xs font-sans border-collapse border border-slate-700">
                <tbody>
                  <tr className="border-b border-slate-700">
                    <td className="w-1/4 p-2 bg-slate-100 font-bold border-r border-slate-700">Jenis Layanan / Akta</td>
                    <td className="p-2 font-bold">{selectedBerkas.jenisAkta}</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="p-2 bg-slate-100 font-bold border-r border-slate-700">Deskripsi / Objek</td>
                    <td className="p-2">{selectedBerkas.judulPekerjaan}</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="p-2 bg-slate-100 font-bold border-r border-slate-700">Pihak Pertama ({selectedBerkas.pihakPertama.peran})</td>
                    <td className="p-2">
                      <div className="font-bold">{selectedBerkas.pihakPertama.nama}</div>
                      <div className="text-[11px] text-slate-600">NIK: {selectedBerkas.pihakPertama.nik} • Telp: {selectedBerkas.pihakPertama.telepon || '-'}</div>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="p-2 bg-slate-100 font-bold border-r border-slate-700">Pihak Kedua ({selectedBerkas.pihakKedua.peran})</td>
                    <td className="p-2">
                      <div className="font-bold">{selectedBerkas.pihakKedua.nama}</div>
                      <div className="text-[11px] text-slate-600">NIK: {selectedBerkas.pihakKedua.nik} • Telp: {selectedBerkas.pihakKedua.telepon || '-'}</div>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="p-2 bg-slate-100 font-bold border-r border-slate-700">Staf PIC / Tanggal Masuk</td>
                    <td className="p-2">
                      {selectedBerkas.picStaff} (Masuk: {formatTanggalIndo(selectedBerkas.tanggalMasuk)} • Target: {formatTanggalIndo(selectedBerkas.targetSelesai)})
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 bg-slate-100 font-bold border-r border-slate-700">Nomor Akta / Repertorium</td>
                    <td className="p-2 font-mono font-bold">
                      {selectedBerkas.nomorAkta ? `Akta No. ${selectedBerkas.nomorAkta}` : 'Belum Terbit'} • {selectedBerkas.nomorRepertorium || '-'}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Checklist Syarat */}
              <div className="font-sans">
                <h3 className="text-xs font-bold uppercase mb-1.5">Checklist Dokumen Persyaratan:</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  {selectedBerkas.kelengkapanDokumen.map(d => (
                    <div key={d.id} className="flex items-center gap-1.5 py-0.5 border-b border-slate-200">
                      <span className="w-3.5 h-3.5 border border-slate-700 flex items-center justify-center text-[10px] font-bold">
                        {d.status === 'LENGKAP' ? '✓' : ''}
                      </span>
                      <span className="truncate">{d.nama}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kolom Disposisi & Paraf */}
              <div className="pt-4 font-sans">
                <div className="border border-slate-700 h-28 p-2 flex flex-col justify-between">
                  <div className="text-[11px] font-bold uppercase text-slate-700">
                    Petunjuk / Disposisi Notaris & PPAT:
                  </div>
                  <div className="flex justify-between items-end text-xs">
                    <div>
                      Tanggal: .......................................
                    </div>
                    <div className="text-center">
                      <div className="mb-8">Tanda Tangan / Paraf Notaris</div>
                      <div className="font-bold underline">{profilKantor.namaNotaris}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TEMPLATE 2: LAPORAN BUKU REPERTORIUM BULANAN */}
          {printModalType === 'repertorium' && (
            <div className="max-w-4xl mx-auto space-y-4 font-sans">
              <div className="text-center border-b-2 border-slate-900 pb-3">
                <h1 className="text-lg font-bold uppercase">
                  LAPORAN BULANAN BUKU DAFTAR AKTA (REPERTORIUM)
                </h1>
                <p className="text-xs font-semibold">
                  KANTOR NOTARIS & PEJABAT PEMBUAT AKTA TANAH (PPAT)
                </p>
                <p className="text-sm font-extrabold uppercase mt-1">
                  {profilKantor.namaNotaris}
                </p>
                <p className="text-[11px] text-slate-600">
                  Wilayah Jabatan: {profilKantor.wilayahKerja}
                </p>
              </div>

              <table className="w-full text-[11px] border-collapse border border-slate-700">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-700 font-bold text-center">
                    <th className="p-1.5 border-r border-slate-700 w-10">No.</th>
                    <th className="p-1.5 border-r border-slate-700">No. Akta</th>
                    <th className="p-1.5 border-r border-slate-700">Tanggal</th>
                    <th className="p-1.5 border-r border-slate-700">Sifat / Judul Akta</th>
                    <th className="p-1.5 border-r border-slate-700">Para Penghadap & Kuasanya</th>
                    <th className="p-1.5 border-r border-slate-700 w-16">Minuta</th>
                    <th className="p-1.5 w-20">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {berkasList.map((b, idx) => (
                    <tr key={b.id} className="border-b border-slate-700">
                      <td className="p-1.5 text-center font-bold border-r border-slate-700">{idx + 1}</td>
                      <td className="p-1.5 font-mono font-bold border-r border-slate-700">{b.nomorAkta || '-'}</td>
                      <td className="p-1.5 border-r border-slate-700">{formatTanggalIndo(b.tanggalAkta || b.tanggalMasuk)}</td>
                      <td className="p-1.5 border-r border-slate-700 font-medium">{b.jenisAkta}</td>
                      <td className="p-1.5 border-r border-slate-700">
                        1. {b.pihakPertama.nama} ({b.pihakPertama.peran})<br/>
                        2. {b.pihakKedua.nama} ({b.pihakKedua.peran})
                      </td>
                      <td className="p-1.5 text-center border-r border-slate-700 font-semibold">Ada</td>
                      <td className="p-1.5 text-[10px]">{b.nomorBerkas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pt-6 flex justify-between text-xs">
                <div>
                  <p>Disampaikan kepada:</p>
                  <p>1. Majelis Pengawas Daerah (MPD) Notaris</p>
                  <p>2. Kantor Pertanahan (BPN) Setempat</p>
                </div>
                <div className="text-center">
                  <p>{profilKantor.wilayahKerja.split('&')[0].trim()}, {formatTanggalIndo(new Date().toISOString().split('T')[0])}</p>
                  <p className="mt-1 font-bold">Notaris & PPAT,</p>
                  <div className="h-16" />
                  <p className="font-extrabold underline">{profilKantor.namaNotaris}</p>
                </div>
              </div>
            </div>
          )}

          {/* TEMPLATE 3: KWITANSI RINCIAN BIAYA */}
          {printModalType === 'kwitansi' && selectedBerkas && (
            <div className="max-w-2xl mx-auto border border-slate-800 p-6 space-y-4 font-sans">
              <div className="text-center border-b pb-2">
                <h1 className="text-base font-extrabold uppercase">{profilKantor.namaNotaris}</h1>
                <p className="text-xs uppercase text-slate-600 font-semibold">{profilKantor.jabatan}</p>
                <p className="text-[10px] text-slate-500">{profilKantor.alamatKantor}</p>
              </div>

              <div className="text-center py-1">
                <h2 className="text-sm font-extrabold underline uppercase">KWITANSI / RINCIAN BIAYA</h2>
                <p className="text-xs font-mono mt-1">NO: KW-{selectedBerkas.nomorBerkas.replace(/\//g, '-')}</p>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-slate-600">Telah Terima Dari:</span><span className="font-bold">{selectedBerkas.namaKlien}</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Untuk Pekerjaan:</span><span className="font-bold text-right">{selectedBerkas.jenisAkta}</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Objek / Judul:</span><span className="text-right">{selectedBerkas.judulPekerjaan}</span></div>
              </div>

              {/* Rincian itemized */}
              <table className="w-full text-xs border border-slate-300 mt-3">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300">
                    <th className="p-2 text-left">Komponen Biaya</th>
                    <th className="p-2 text-right">Jumlah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr><td className="p-2">Honorarium Jasa Notaris / PPAT</td><td className="p-2 text-right font-bold">{formatRupiah(selectedBerkas.keuangan.honorarium)}</td></tr>
                  {selectedBerkas.keuangan.titipanPPh > 0 && <tr><td className="p-2">Titipan Pajak Penghasilan (PPh Final 2.5%)</td><td className="p-2 text-right">{formatRupiah(selectedBerkas.keuangan.titipanPPh)}</td></tr>}
                  {selectedBerkas.keuangan.titipanBPHTB > 0 && <tr><td className="p-2">Titipan Pajak Bea Perolehan Hak (BPHTB 5%)</td><td className="p-2 text-right">{formatRupiah(selectedBerkas.keuangan.titipanBPHTB)}</td></tr>}
                  <tr><td className="p-2">Biaya PNBP BPN / Voucher AHU</td><td className="p-2 text-right">{formatRupiah(selectedBerkas.keuangan.biayaPNBP)}</td></tr>
                  <tr><td className="p-2">Operasional, Saksi, Materai & Penjilidan</td><td className="p-2 text-right">{formatRupiah(selectedBerkas.keuangan.biayaOperasional)}</td></tr>
                  <tr className="bg-slate-50 font-bold border-t-2 border-slate-800">
                    <td className="p-2">TOTAL TAGIHAN</td>
                    <td className="p-2 text-right text-sm">{formatRupiah(selectedBerkas.keuangan.totalBiaya)}</td>
                  </tr>
                  <tr className="bg-emerald-50 font-bold text-emerald-900">
                    <td className="p-2">Jumlah Telah Terbayar ({selectedBerkas.keuangan.statusPembayaran})</td>
                    <td className="p-2 text-right text-sm">{formatRupiah(selectedBerkas.keuangan.jumlahTerbayar)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="pt-4 flex justify-between items-end text-xs">
                <div className="text-[10px] text-slate-500 italic">
                  *Titipan pajak akan disetorkan langsung ke Kas Negara / Daerah.
                </div>
                <div className="text-center">
                  <p>Tanggal: {formatTanggalIndo(new Date().toISOString().split('T')[0])}</p>
                  <p className="mt-1 font-semibold">Kasir / Bagian Keuangan,</p>
                  <div className="h-12" />
                  <p className="font-bold underline">{profilKantor.namaAdmin || 'Bagian Keuangan'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
