import React, { useState, useEffect } from 'react';
import { useNotaris } from '../context/NotarisContext';
import {
  KategoriAkta,
  TahapPekerjaan,
  Prioritas,
  DAFTAR_JENIS_AKTA,
  DAFTAR_STAF_PIC,
  TAHAPAN_LIST,
  BerkasNotaris,
  DokumenSyarat
} from '../types';
import { X, Save, Plus } from 'lucide-react';

export const BerkasFormModal: React.FC = () => {
  const {
    isFormOpen,
    setIsFormOpen,
    formEditingBerkas,
    addBerkas,
    updateBerkas,
    berkasList
  } = useNotaris();

  const isEdit = !!formEditingBerkas;

  // Form State
  const [kategori, setKategori] = useState<KategoriAkta>('PPAT');
  const [jenisAkta, setJenisAkta] = useState<string>('Akta Jual Beli (AJB)');
  const [customJenisAkta, setCustomJenisAkta] = useState<string>('');
  const [nomorBerkas, setNomorBerkas] = useState<string>('');
  const [judulPekerjaan, setJudulPekerjaan] = useState<string>('');
  const [namaKlien, setNamaKlien] = useState<string>('');
  const [kontakKlien, setKontakKlien] = useState<string>('');
  const [emailKlien, setEmailKlien] = useState<string>('');
  const [instansiMitra, setInstansiMitra] = useState<string>('');
  const [picStaff, setPicStaff] = useState<string>(DAFTAR_STAF_PIC[0]);
  const [prioritas, setPrioritas] = useState<Prioritas>('NORMAL');
  const [tahap, setTahap] = useState<TahapPekerjaan>('PENERIMAAN_BERKAS');
  const [tanggalMasuk, setTanggalMasuk] = useState<string>('');
  const [targetSelesai, setTargetSelesai] = useState<string>('');
  const [lokasiFisikMap, setLokasiFisikMap] = useState<string>('');

  // Para Pihak
  const [pihak1Nama, setPihak1Nama] = useState<string>('');
  const [pihak1Nik, setPihak1Nik] = useState<string>('');
  const [pihak1Peran, setPihak1Peran] = useState<string>('Pihak Pertama / Penjual');
  const [pihak1Telp, setPihak1Telp] = useState<string>('');
  const [pihak1Alamat, setPihak1Alamat] = useState<string>('');

  const [pihak2Nama, setPihak2Nama] = useState<string>('');
  const [pihak2Nik, setPihak2Nik] = useState<string>('');
  const [pihak2Peran, setPihak2Peran] = useState<string>('Pihak Kedua / Pembeli');
  const [pihak2Telp, setPihak2Telp] = useState<string>('');
  const [pihak2Alamat, setPihak2Alamat] = useState<string>('');

  // Akta & Repertorium
  const [nomorAkta, setNomorAkta] = useState<string>('');
  const [nomorRepertorium, setNomorRepertorium] = useState<string>('');
  const [tanggalAkta, setTanggalAkta] = useState<string>('');

  // Keuangan
  const [honorarium, setHonorarium] = useState<number>(5000000);
  const [titipanPPh, setTitipanPPh] = useState<number>(0);
  const [titipanBPHTB, setTitipanBPHTB] = useState<number>(0);
  const [biayaPNBP, setBiayaPNBP] = useState<number>(500000);
  const [biayaOperasional, setBiayaOperasional] = useState<number>(500000);
  const [jumlahTerbayar, setJumlahTerbayar] = useState<number>(0);

  // Catatan Kendala
  const [catatanKendala, setCatatanKendala] = useState<string>('');

  useEffect(() => {
    if (formEditingBerkas) {
      setKategori(formEditingBerkas.kategori);
      setJenisAkta(formEditingBerkas.jenisAkta);
      setNomorBerkas(formEditingBerkas.nomorBerkas);
      setJudulPekerjaan(formEditingBerkas.judulPekerjaan);
      setNamaKlien(formEditingBerkas.namaKlien);
      setKontakKlien(formEditingBerkas.kontakKlien);
      setEmailKlien(formEditingBerkas.emailKlien || '');
      setInstansiMitra(formEditingBerkas.instansiMitra || '');
      setPicStaff(formEditingBerkas.picStaff);
      setPrioritas(formEditingBerkas.prioritas);
      setTahap(formEditingBerkas.tahap);
      setTanggalMasuk(formEditingBerkas.tanggalMasuk);
      setTargetSelesai(formEditingBerkas.targetSelesai);
      setLokasiFisikMap(formEditingBerkas.lokasiFisikMap || '');

      setPihak1Nama(formEditingBerkas.pihakPertama.nama);
      setPihak1Nik(formEditingBerkas.pihakPertama.nik);
      setPihak1Peran(formEditingBerkas.pihakPertama.peran);
      setPihak1Telp(formEditingBerkas.pihakPertama.telepon || '');
      setPihak1Alamat(formEditingBerkas.pihakPertama.alamat || '');

      setPihak2Nama(formEditingBerkas.pihakKedua.nama);
      setPihak2Nik(formEditingBerkas.pihakKedua.nik);
      setPihak2Peran(formEditingBerkas.pihakKedua.peran);
      setPihak2Telp(formEditingBerkas.pihakKedua.telepon || '');
      setPihak2Alamat(formEditingBerkas.pihakKedua.alamat || '');

      setNomorAkta(formEditingBerkas.nomorAkta || '');
      setNomorRepertorium(formEditingBerkas.nomorRepertorium || '');
      setTanggalAkta(formEditingBerkas.tanggalAkta || '');

      setHonorarium(formEditingBerkas.keuangan.honorarium);
      setTitipanPPh(formEditingBerkas.keuangan.titipanPPh);
      setTitipanBPHTB(formEditingBerkas.keuangan.titipanBPHTB);
      setBiayaPNBP(formEditingBerkas.keuangan.biayaPNBP);
      setBiayaOperasional(formEditingBerkas.keuangan.biayaOperasional);
      setJumlahTerbayar(formEditingBerkas.keuangan.jumlahTerbayar);
      setCatatanKendala(formEditingBerkas.catatanKendala || '');
    } else {
      // New Form Defaults
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const targetDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      setKategori('PPAT');
      setJenisAkta('Akta Jual Beli (AJB)');
      setNomorBerkas(`BKS/PPAT/${now.getFullYear()}/${String(berkasList.length + 1).padStart(3, '0')}`);
      setJudulPekerjaan('');
      setNamaKlien('');
      setKontakKlien('');
      setEmailKlien('');
      setInstansiMitra('Kantor Pertanahan (BPN)');
      setPicStaff(DAFTAR_STAF_PIC[0]);
      setPrioritas('NORMAL');
      setTahap('PENERIMAAN_BERKAS');
      setTanggalMasuk(todayStr);
      setTargetSelesai(targetDate);
      setLokasiFisikMap(`Map Kuning No. ${berkasList.length + 1}`);

      setPihak1Nama('');
      setPihak1Nik('');
      setPihak1Peran('Penjual');
      setPihak1Telp('');
      setPihak1Alamat('');

      setPihak2Nama('');
      setPihak2Nik('');
      setPihak2Peran('Pembeli');
      setPihak2Telp('');
      setPihak2Alamat('');

      setNomorAkta('');
      setNomorRepertorium('');
      setTanggalAkta('');

      setHonorarium(5000000);
      setTitipanPPh(0);
      setTitipanBPHTB(0);
      setBiayaPNBP(500000);
      setBiayaOperasional(500000);
      setJumlahTerbayar(0);
      setCatatanKendala('');
    }
  }, [formEditingBerkas, isFormOpen]);

  if (!isFormOpen) return null;

  // Handle deed list when category flips
  const handleKategoriChange = (newKat: KategoriAkta) => {
    setKategori(newKat);
    const list = DAFTAR_JENIS_AKTA[newKat];
    setJenisAkta(list[0]);
    if (!isEdit) {
      const year = new Date().getFullYear();
      setNomorBerkas(`BKS/${newKat}/${year}/${String(berkasList.length + 1).padStart(3, '0')}`);
      if (newKat === 'NOTARIS') {
        setPihak1Peran('Pihak Pertama / Pendiri');
        setPihak2Peran('Pihak Kedua / Pengurus');
        setInstansiMitra('Ditjen AHU Kemenkumham RI');
      } else {
        setPihak1Peran('Penjual / Pemilik');
        setPihak2Peran('Pembeli / Debitur');
        setInstansiMitra('Kantor Pertanahan (BPN)');
      }
    }
  };

  const getPresetDocuments = (jenis: string, kat: KategoriAkta): DokumenSyarat[] => {
    if (jenis.includes('Jual Beli') || jenis.includes('AJB')) {
      return [
        { id: `d-${Date.now()}-1`, nama: 'Asli Sertipikat Tanah (SHM/SHGB)', wajib: true, status: 'BELUM' },
        { id: `d-${Date.now()}-2`, nama: 'Fotokopi e-KTP & KK Penjual dan Suami/Istri', wajib: true, status: 'BELUM' },
        { id: `d-${Date.now()}-3`, nama: 'Fotokopi e-KTP & KK Pembeli', wajib: true, status: 'BELUM' },
        { id: `d-${Date.now()}-4`, nama: 'Surat Nikah / Akta Cerai Penjual', wajib: true, status: 'BELUM' },
        { id: `d-${Date.now()}-5`, nama: 'SPPT PBB & Bukti Lunas PBB 5 Thn Terakhir', wajib: true, status: 'BELUM' },
        { id: `d-${Date.now()}-6`, nama: 'Bukti Validasi Setoran PPh Final (2.5%)', wajib: true, status: 'BELUM' },
        { id: `d-${Date.now()}-7`, nama: 'Bukti Validasi Setoran BPHTB (5%)', wajib: true, status: 'BELUM' }
      ];
    } else if (jenis.includes('PT') || jenis.includes('Perseroan')) {
      return [
        { id: `d-${Date.now()}-1`, nama: 'e-KTP & NPWP Para Pendiri & Pengurus', wajib: true, status: 'BELUM' },
        { id: `d-${Date.now()}-2`, nama: 'Kartu Keluarga (KK) Direksi & Komisaris', wajib: true, status: 'BELUM' },
        { id: `d-${Date.now()}-3`, nama: 'Bukti Pemesanan Nama PT & Kode Voucher AHU', wajib: true, status: 'BELUM' },
        { id: `d-${Date.now()}-4`, nama: 'Surat Perjanjian Sewa / Bukti Domisili Gedung Kantor', wajib: true, status: 'BELUM' },
        { id: `d-${Date.now()}-5`, nama: 'Rincian Modal Saham & Struktur Kepengurusan', wajib: true, status: 'BELUM' }
      ];
    } else if (jenis.includes('APHT') || jenis.includes('Tanggungan')) {
      return [
        { id: `d-${Date.now()}-1`, nama: 'Perjanjian Kredit (PK) & Offering Letter Bank', wajib: true, status: 'BELUM' },
        { id: `d-${Date.now()}-2`, nama: 'Surat Kuasa Direksi Bank / Kuasa Menghadap', wajib: true, status: 'BELUM' },
        { id: `d-${Date.now()}-3`, nama: 'Asli Sertipikat Tanah Agunan', wajib: true, status: 'BELUM' },
        { id: `d-${Date.now()}-4`, nama: 'Hasil Pengecekan Sertipikat BPN', wajib: true, status: 'BELUM' },
        { id: `d-${Date.now()}-5`, nama: 'Persetujuan Pasangan / RUPS Debitur', wajib: true, status: 'BELUM' }
      ];
    }

    // Default general checklist
    return [
      { id: `d-${Date.now()}-1`, nama: 'e-KTP & KK Para Pihak Menghadap', wajib: true, status: 'BELUM' },
      { id: `d-${Date.now()}-2`, nama: 'NPWP Pribadi / Perusahaan', wajib: true, status: 'BELUM' },
      { id: `d-${Date.now()}-3`, nama: 'Dokumen Dasar / Alas Hak Asli', wajib: true, status: 'BELUM' },
      { id: `d-${Date.now()}-4`, nama: 'Draft Kesepakatan Pokok Transaksi', wajib: false, status: 'BELUM' }
    ];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedJenis = customJenisAkta.trim() || jenisAkta;
    const total =
      (honorarium || 0) +
      (titipanPPh || 0) +
      (titipanBPHTB || 0) +
      (biayaPNBP || 0) +
      (biayaOperasional || 0);

    let statusBayar: 'LUNAS' | 'DP' | 'BELUM_BAYAR' = 'BELUM_BAYAR';
    if (jumlahTerbayar >= total && total > 0) {
      statusBayar = 'LUNAS';
    } else if (jumlahTerbayar > 0) {
      statusBayar = 'DP';
    }

    const payload: Omit<BerkasNotaris, 'id' | 'riwayat'> = {
      nomorBerkas,
      kategori,
      jenisAkta: selectedJenis,
      judulPekerjaan: judulPekerjaan || `${selectedJenis} - ${namaKlien}`,
      namaKlien: namaKlien || pihak1Nama || 'Klien Kantor',
      kontakKlien,
      emailKlien,
      instansiMitra,
      picStaff,
      tahap,
      prioritas,
      tanggalMasuk,
      targetSelesai,
      lokasiFisikMap,
      nomorAkta: nomorAkta || undefined,
      nomorRepertorium: nomorRepertorium || undefined,
      tanggalAkta: tanggalAkta || undefined,
      pihakPertama: {
        nama: pihak1Nama || 'Pihak 1',
        nik: pihak1Nik,
        peran: pihak1Peran,
        telepon: pihak1Telp,
        alamat: pihak1Alamat
      },
      pihakKedua: {
        nama: pihak2Nama || 'Pihak 2',
        nik: pihak2Nik,
        peran: pihak2Peran,
        telepon: pihak2Telp,
        alamat: pihak2Alamat
      },
      kelengkapanDokumen: isEdit
        ? formEditingBerkas.kelengkapanDokumen
        : getPresetDocuments(selectedJenis, kategori),
      keuangan: {
        honorarium,
        titipanPPh,
        titipanBPHTB,
        biayaPNBP,
        biayaOperasional,
        totalBiaya: total,
        jumlahTerbayar,
        statusPembayaran: statusBayar
      },
      catatanKendala
    };

    if (isEdit) {
      updateBerkas({
        ...payload,
        id: formEditingBerkas.id,
        riwayat: formEditingBerkas.riwayat
      });
    } else {
      addBerkas(payload);
    }

    setIsFormOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between gap-3 shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              {isEdit ? 'Edit Data Berkas Pekerjaan' : 'Pendaftaran Berkas Pekerjaan Baru'}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Masukkan data registrasi akta, pihak penghadap, rincian biaya, dan target SLA kantor
            </p>
          </div>
          <button
            onClick={() => setIsFormOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          {/* Section 1: Kategori & Identitas Berkas */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500 border-b pb-1">
              1. Identitas Berkas & Layanan
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Kategori */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Kategori Layanan *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleKategoriChange('PPAT')}
                    className={`py-2 px-3 rounded-lg border font-bold text-xs transition-colors cursor-pointer ${
                      kategori === 'PPAT'
                        ? 'bg-amber-100 text-amber-900 border-amber-400'
                        : 'bg-slate-50 text-slate-600 border-slate-300'
                    }`}
                  >
                    PPAT (Pertanahan)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleKategoriChange('NOTARIS')}
                    className={`py-2 px-3 rounded-lg border font-bold text-xs transition-colors cursor-pointer ${
                      kategori === 'NOTARIS'
                        ? 'bg-sky-100 text-sky-900 border-sky-400'
                        : 'bg-slate-50 text-slate-600 border-slate-300'
                    }`}
                  >
                    NOTARIS (Badan/Akta)
                  </button>
                </div>
              </div>

              {/* Jenis Akta */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Jenis Akta *
                </label>
                <select
                  value={jenisAkta}
                  onChange={e => setJenisAkta(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {DAFTAR_JENIS_AKTA[kategori].map(j => (
                    <option key={j} value={j}>
                      {j}
                    </option>
                  ))}
                  <option value="LAINNYA">-- Jenis Akta Lainnya --</option>
                </select>
                {jenisAkta === 'LAINNYA' && (
                  <input
                    type="text"
                    value={customJenisAkta}
                    onChange={e => setCustomJenisAkta(e.target.value)}
                    placeholder="Ketik jenis akta kustom..."
                    className="w-full mt-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    required
                  />
                )}
              </div>

              {/* Nomor Berkas */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Nomor Registrasi Berkas *
                </label>
                <input
                  type="text"
                  value={nomorBerkas}
                  onChange={e => setNomorBerkas(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Judul Transaksi & Objek */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Deskripsi / Objek Transaksi *
              </label>
              <input
                type="text"
                value={judulPekerjaan}
                onChange={e => setJudulPekerjaan(e.target.value)}
                placeholder="Contoh: AJB Rumah SHM No. 4312/Cilandak Barat atas nama Ir. Hendra Gunawan"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Klien & PIC Row */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Nama Pemohon / Klien Utama *
                </label>
                <input
                  type="text"
                  value={namaKlien}
                  onChange={e => setNamaKlien(e.target.value)}
                  required
                  placeholder="Nama klien pemohon..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  No. HP / WhatsApp Klien
                </label>
                <input
                  type="text"
                  value={kontakKlien}
                  onChange={e => setKontakKlien(e.target.value)}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Staf PIC Pengampu *
                </label>
                <select
                  value={picStaff}
                  onChange={e => setPicStaff(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                >
                  {DAFTAR_STAF_PIC.map(s => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Lokasi Map Fisik Arsip
                </label>
                <input
                  type="text"
                  value={lokasiFisikMap}
                  onChange={e => setLokasiFisikMap(e.target.value)}
                  placeholder="Contoh: Rak 2B - Map Biru 84"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>
            </div>

            {/* Waktu Masuk & Target */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Tanggal Berkas Masuk *
                </label>
                <input
                  type="date"
                  value={tanggalMasuk}
                  onChange={e => setTanggalMasuk(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Target Selesai (SLA) *
                </label>
                <input
                  type="date"
                  value={targetSelesai}
                  onChange={e => setTargetSelesai(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Tingkat Prioritas *
                </label>
                <select
                  value={prioritas}
                  onChange={e => setPrioritas(e.target.value as Prioritas)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="NORMAL">Normal</option>
                  <option value="TINGGI">Tinggi</option>
                  <option value="URGENT">Urgent (Mendesak / Bank)</option>
                  <option value="RENDAH">Rendah</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Tahap Pekerjaan Awal *
                </label>
                <select
                  value={tahap}
                  onChange={e => setTahap(e.target.value as TahapPekerjaan)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                >
                  {TAHAPAN_LIST.map(t => (
                    <option key={t.key} value={t.key}>
                      {t.nomor}. {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Para Pihak Penghadap */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500 border-b pb-1">
              2. Data Para Pihak (Penghadap)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pihak 1 */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-emerald-800 text-xs block">
                  Pihak Pertama (Penjual / Pemberi Hak / Pendiri)
                </span>
                <input
                  type="text"
                  value={pihak1Nama}
                  onChange={e => setPihak1Nama(e.target.value)}
                  placeholder="Nama Lengkap Pihak Pertama..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={pihak1Nik}
                    onChange={e => setPihak1Nik(e.target.value)}
                    placeholder="NIK (16 digit)..."
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                  />
                  <input
                    type="text"
                    value={pihak1Peran}
                    onChange={e => setPihak1Peran(e.target.value)}
                    placeholder="Peran: Penjual / Debitur"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <input
                  type="text"
                  value={pihak1Alamat}
                  onChange={e => setPihak1Alamat(e.target.value)}
                  placeholder="Alamat sesuai KTP..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>

              {/* Pihak 2 */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-blue-800 text-xs block">
                  Pihak Kedua (Pembeli / Penerima Hak / Bank)
                </span>
                <input
                  type="text"
                  value={pihak2Nama}
                  onChange={e => setPihak2Nama(e.target.value)}
                  placeholder="Nama Lengkap Pihak Kedua..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={pihak2Nik}
                    onChange={e => setPihak2Nik(e.target.value)}
                    placeholder="NIK / No. Identitas..."
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                  />
                  <input
                    type="text"
                    value={pihak2Peran}
                    onChange={e => setPihak2Peran(e.target.value)}
                    placeholder="Peran: Pembeli / Kreditur"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <input
                  type="text"
                  value={pihak2Alamat}
                  onChange={e => setPihak2Alamat(e.target.value)}
                  placeholder="Alamat sesuai KTP..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Data Akta & Repertorium (Opsional / Jika Sudah Terbit) */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500 border-b pb-1">
              3. Data Buku Repertorium & Nomor Akta (Dapat diisi saat penandatanganan)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Nomor Akta Resmi
                </label>
                <input
                  type="text"
                  value={nomorAkta}
                  onChange={e => setNomorAkta(e.target.value)}
                  placeholder="Contoh: 14/2025"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Nomor Buku Repertorium
                </label>
                <input
                  type="text"
                  value={nomorRepertorium}
                  onChange={e => setNomorRepertorium(e.target.value)}
                  placeholder="Contoh: REP/PPAT/V/2025/014"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Tanggal Akta / Penandatanganan
                </label>
                <input
                  type="date"
                  value={tanggalAkta}
                  onChange={e => setTanggalAkta(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Estimasi Keuangan & Titipan Pajak */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500 border-b pb-1">
              4. Rincian Biaya & Titipan Pajak (Escrow)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Honor Notaris (Rp)
                </label>
                <input
                  type="number"
                  value={honorarium}
                  onChange={e => setHonorarium(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-amber-800 font-semibold mb-1">
                  Titipan PPh (Rp)
                </label>
                <input
                  type="number"
                  value={titipanPPh}
                  onChange={e => setTitipanPPh(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-amber-50 border border-amber-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-amber-800 font-semibold mb-1">
                  Titipan BPHTB (Rp)
                </label>
                <input
                  type="number"
                  value={titipanBPHTB}
                  onChange={e => setTitipanBPHTB(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-amber-50 border border-amber-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  PNBP BPN/AHU (Rp)
                </label>
                <input
                  type="number"
                  value={biayaPNBP}
                  onChange={e => setBiayaPNBP(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Operasional (Rp)
                </label>
                <input
                  type="number"
                  value={biayaOperasional}
                  onChange={e => setBiayaOperasional(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-emerald-800 font-semibold mb-1">
                  Terbayar Klien (Rp)
                </label>
                <input
                  type="number"
                  value={jumlahTerbayar}
                  onChange={e => setJumlahTerbayar(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-emerald-50 border border-emerald-300 rounded-lg text-xs font-bold"
                />
              </div>
            </div>
          </div>

          {/* Catatan Kendala */}
          <div className="pt-3 border-t border-slate-200">
            <label className="block text-slate-700 font-semibold mb-1">
              Catatan Internal / Kendala Berkas
            </label>
            <textarea
              rows={2}
              value={catatanKendala}
              onChange={e => setCatatanKendala(e.target.value)}
              placeholder="Contoh: Menunggu lembar validasi BPHTB dari Bapenda, sertipikat sudah bersih di BPN..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-xs transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isEdit ? 'Simpan Perubahan' : 'Daftarkan Berkas'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
