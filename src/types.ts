export type KategoriAkta = 'NOTARIS' | 'PPAT';

export type TahapPekerjaan =
  | 'PENERIMAAN_BERKAS'     // Tahap 1
  | 'PENGECEKAN_BPN_AHU'    // Tahap 2
  | 'DRAFTING_MINUTA'       // Tahap 3
  | 'VALIDASI_PAJAK'        // Tahap 4
  | 'PENANDATANGANAN'       // Tahap 5
  | 'PROSES_BPN_SK'         // Tahap 6
  | 'PENJILIDAN_SALINAN'    // Tahap 7
  | 'SELESAI';              // Tahap 8

export type Prioritas = 'RENDAH' | 'NORMAL' | 'TINGGI' | 'URGENT';

export type StatusDokumen = 'LENGKAP' | 'BELUM' | 'MENYUSUL';

export interface DokumenSyarat {
  id: string;
  nama: string;
  wajib: boolean;
  status: StatusDokumen;
  keterangan?: string;
}

export interface PihakPenghadap {
  nama: string;
  nik: string;
  peran: string; // e.g. Penjual, Pembeli, Direktur, Debitur
  telepon?: string;
  alamat?: string;
}

export type StatusPembayaran = 'LUNAS' | 'DP' | 'BELUM_BAYAR';

export interface KeuanganBerkas {
  honorarium: number;        // Jasa Notaris/PPAT
  titipanPPh: number;        // PPh Final (biasanya 2.5%)
  titipanBPHTB: number;      // Bea Perolehan Hak atas Tanah & Bangunan (5%)
  biayaPNBP: number;         // Penerimaan Negara Bukan Pajak (BPN)
  biayaOperasional: number;  // Validasi, materai, transport, saksi
  totalBiaya: number;        // Total kalkulasi
  jumlahTerbayar: number;
  statusPembayaran: StatusPembayaran;
  catatanKeuangan?: string;
}

export interface RiwayatLog {
  id: string;
  tanggal: string; // ISO string
  aksi: string;
  keterangan: string;
  user: string;
}

export interface BerkasNotaris {
  id: string;
  nomorBerkas: string;        // contoh: BKS/PPAT/2025/089
  kategori: KategoriAkta;
  jenisAkta: string;          // contoh: Akta Jual Beli (AJB), Akta Pendirian PT, APHT
  judulPekerjaan: string;     // Deskripsi singkat transaksi/objek
  namaKlien: string;
  kontakKlien: string;
  emailKlien?: string;
  instansiMitra?: string;     // BPN Jaksel, Bank Mandiri, Bapenda, dll
  pihakPertama: PihakPenghadap;
  pihakKedua: PihakPenghadap;
  picStaff: string;           // Staf pelaksana pengampu
  tahap: TahapPekerjaan;
  prioritas: Prioritas;
  tanggalMasuk: string;       // YYYY-MM-DD
  targetSelesai: string;      // YYYY-MM-DD
  tanggalSelesaiReal?: string;
  nomorAkta?: string;         // nomor akta resmi (cth: Akta No. 24)
  nomorRepertorium?: string;  // nomor buku repertorium (cth: REP/X/2025/024)
  tanggalAkta?: string;       // tanggal penandatanganan akta
  sifatAkta?: string;         // Minuta / Originali
  kelengkapanDokumen: DokumenSyarat[];
  keuangan: KeuanganBerkas;
  catatanKendala?: string;
  lokasiFisikMap?: string;    // Rak 2B / Box A3 (lokasi arsip fisik kantor)
  riwayat: RiwayatLog[];
}

export interface ProfilKantor {
  namaNotaris: string;
  jabatan: string;
  wilayahKerja: string;
  skKemenkumham: string;
  skBpn: string;
  alamatKantor: string;
  teleponKantor: string;
  emailKantor: string;
  npwpKantor: string;
  namaAdmin: string;
}

export interface TahapConfig {
  key: TahapPekerjaan;
  label: string;
  nomor: number;
  deskripsi: string;
  warnaBadge: string;
}

export const TAHAPAN_LIST: TahapConfig[] = [
  {
    key: 'PENERIMAAN_BERKAS',
    label: 'Penerimaan & Validasi Dokumen',
    nomor: 1,
    deskripsi: 'Penerimaan KTP, KK, Sertipikat, PBB, & cek kelengkapan syarat',
    warnaBadge: 'bg-slate-100 text-slate-700 border-slate-300'
  },
  {
    key: 'PENGECEKAN_BPN_AHU',
    label: 'Pengecekan BPN / AHU Online',
    nomor: 2,
    deskripsi: 'Pengecekan keaslian sertipikat (HT-El/SKPT) atau pemesanan nama PT di AHU',
    warnaBadge: 'bg-sky-100 text-sky-800 border-sky-300'
  },
  {
    key: 'DRAFTING_MINUTA',
    label: 'Drafting Minuta Akta',
    nomor: 3,
    deskripsi: 'Penyusunan komparisi, premisse, klausula isi akta oleh staf & notaris',
    warnaBadge: 'bg-indigo-100 text-indigo-800 border-indigo-300'
  },
  {
    key: 'VALIDASI_PAJAK',
    label: 'Validasi Pajak (BPHTB / PPh)',
    nomor: 4,
    deskripsi: 'Penghitungan, penyetoran NTPN, & validasi SKPD Bapenda / KPP Pratama',
    warnaBadge: 'bg-amber-100 text-amber-800 border-amber-300'
  },
  {
    key: 'PENANDATANGANAN',
    label: 'Pembacaan & Tanda Tangan Akta',
    nomor: 5,
    deskripsi: 'Para pihak menghadap Notaris/PPAT, pembacaan akta, & cap jempol/ttd',
    warnaBadge: 'bg-purple-100 text-purple-800 border-purple-300'
  },
  {
    key: 'PROSES_BPN_SK',
    label: 'Pendaftaran BPN / SK AHU',
    nomor: 6,
    deskripsi: 'Pendaftaran balik nama sertipikat, roya, hak tanggungan, atau cetak SK PT',
    warnaBadge: 'bg-blue-100 text-blue-800 border-blue-300'
  },
  {
    key: 'PENJILIDAN_SALINAN',
    label: 'Penjilidan & Catat Repertorium',
    nomor: 7,
    deskripsi: 'Penjilidan salinan resmi bertali, stempel embos, penomoran buku repertorium',
    warnaBadge: 'bg-teal-100 text-teal-800 border-teal-300'
  },
  {
    key: 'SELESAI',
    label: 'Selesai & Diserahkan',
    nomor: 8,
    deskripsi: 'Semua proses tuntas, dokumen asli diserah-terimakan dengan tanda terima klien',
    warnaBadge: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  }
];

export const DAFTAR_JENIS_AKTA = {
  NOTARIS: [
    'Pendirian PT (Perseroan Terbatas)',
    'Pendirian CV / Firma / Persekutuan Perdata',
    'Pendirian Yayasan / Perkumpulan',
    'Perubahan Anggaran Dasar PT / RUPS',
    'Perjanjian Kerjasama & Usaha (MOU/PKS)',
    'Perjanjian Kredit & Pengakuan Hutang',
    'Perjanjian Sewa Menyewa',
    'Kuasa Menjual / Kuasa Subrogasi',
    'Surat Wasiat / Keterangan Waris',
    'Legalisasi Dokumen Di Bawah Tangan',
    'Waarmerking (Pencatatan Buku Surat)',
    'Akta Perdamaian / Kesepakatan Bersama'
  ],
  PPAT: [
    'Akta Jual Beli (AJB)',
    'Akta Pemberian Hak Tanggungan (APHT)',
    'Surat Kuasa Membebankan Hak Tanggungan (SKMHT)',
    'Akta Hibah Tanah & Bangunan',
    'Akta Pembagian Hak Bersama (APHB)',
    'Akta Tukar Menukar',
    'Akta Pemasukan Ke Dalam Perusahaan (Inbreng)',
    'Pengecekan Sertipikat BPN',
    'Roya Hak Tanggungan',
    'Balik Nama Pewarisan Tanah'
  ]
};

export const DAFTAR_STAF_PIC = [
  'Siti Rahmawati, S.H. (Senior Associate)',
  'Fajar Nugraha, S.H. (Staf PPAT/Pertanahan)',
  'Budi Santoso (Admin & Perizinan AHU)',
  'Dewi Anggraini, S.E. (Keuangan & Perpajakan)',
  'Rian Pratama (Kurir & Lapangan BPN)'
];
