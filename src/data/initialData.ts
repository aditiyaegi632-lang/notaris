import { BerkasNotaris, ProfilKantor } from '../types';

export const PROFIL_KANTOR_DEFAULT: ProfilKantor = {
  namaNotaris: 'Hj. Anindya Laksmi Prabowo, S.H., M.Kn.',
  jabatan: 'Notaris & Pejabat Pembuat Akta Tanah (PPAT)',
  wilayahKerja: 'Kota Administrasi Jakarta Selatan & Provinsi DKI Jakarta',
  skKemenkumham: 'AHU-00452.AH.02.01.TAHUN 2017',
  skBpn: 'Keputusan Menteri ATR/BPN No. 112/KEP-400.20/XI/2018',
  alamatKantor: 'Gedung Graha Notariat Lantai 3, Jl. Fatmawati Raya No. 45, Cilandak, Jakarta Selatan 12430',
  teleponKantor: '(021) 7590-8812 / 0812-9988-7711',
  emailKantor: 'kontak@notaris-anindya.co.id',
  npwpKantor: '08.234.567.8-015.000',
  namaAdmin: 'Siti Rahmawati, S.H.'
};

export const INITIAL_BERKAS: BerkasNotaris[] = [
  {
    id: 'BKS-2025-001',
    nomorBerkas: 'BKS/PPAT/2025/084',
    kategori: 'PPAT',
    jenisAkta: 'Akta Jual Beli (AJB)',
    judulPekerjaan: 'AJB Rumah Tinggal SHM No. 4312/Cilandak Barat (Luas 285 m²)',
    namaKlien: 'Ir. Hendra Gunawan & Linda Wulandari',
    kontakKlien: '0811-8899-2233',
    emailKlien: 'hendra.gunawan@techindo.com',
    instansiMitra: 'Kantor Pertanahan Kota Administrasi Jakarta Selatan',
    pihakPertama: {
      nama: 'Bambang Sudarmono',
      nik: '3174021208650001',
      peran: 'Penjual (Pemilik Terdaftar)',
      telepon: '0812-3344-5566',
      alamat: 'Jl. Terogong III No. 12, Cilandak, Jakarta Selatan'
    },
    pihakKedua: {
      nama: 'Ir. Hendra Gunawan',
      nik: '3174052309780004',
      peran: 'Pembeli',
      telepon: '0811-8899-2233',
      alamat: 'Jl. Gandaria Tengah II No. 8, Kebayoran Baru, Jakarta Selatan'
    },
    picStaff: 'Fajar Nugraha, S.H. (Staf PPAT/Pertanahan)',
    tahap: 'VALIDASI_PAJAK',
    prioritas: 'TINGGI',
    tanggalMasuk: '2025-05-10',
    targetSelesai: '2025-05-28',
    nomorAkta: '18/2025',
    nomorRepertorium: 'REP/PPAT/V/2025/018',
    tanggalAkta: '2025-05-18',
    sifatAkta: 'Minuta Akta',
    lokasiFisikMap: 'Lemari A - Map Biru PPAT No. 84',
    kelengkapanDokumen: [
      { id: 'd1', nama: 'Asli Sertipikat Tanah (SHM No. 4312)', wajib: true, status: 'LENGKAP', keterangan: 'Hasil cek bersih BPN Jaksel' },
      { id: 'd2', nama: 'Fotokopi e-KTP & KK Penjual dan Suami/Istri', wajib: true, status: 'LENGKAP' },
      { id: 'd3', nama: 'Fotokopi e-KTP & KK Pembeli', wajib: true, status: 'LENGKAP' },
      { id: 'd4', nama: 'Surat Nikah / Surat Persetujuan Suami/Istri', wajib: true, status: 'LENGKAP' },
      { id: 'd5', nama: 'SPPT PBB & Bukti Lunas PBB 5 Tahun Terakhir', wajib: true, status: 'LENGKAP' },
      { id: 'd6', nama: 'Bukti Validasi Setor PPh Final (2.5%)', wajib: true, status: 'LENGKAP', keterangan: 'NTPN: 2025051287654' },
      { id: 'd7', nama: 'Bukti Validasi Setor BPHTB (5%)', wajib: true, status: 'MENYUSUL', keterangan: 'Sedang proses verifikasi Bapenda Jaksel' }
    ],
    keuangan: {
      honorarium: 12500000,
      titipanPPh: 62500000,
      titipanBPHTB: 121000000,
      biayaPNBP: 2850000,
      biayaOperasional: 1500000,
      totalBiaya: 200350000,
      jumlahTerbayar: 200350000,
      statusPembayaran: 'LUNAS',
      catatanKeuangan: 'Pelunasan transfer via BCA Rekening Kantor'
    },
    catatanKendala: 'Menunggu lembar verifikasi berkas BPHTB dari Bapenda Jaksel (estimasi selesai 2 hari kerja)',
    riwayat: [
      {
        id: 'r1',
        tanggal: '2025-05-10T09:30:00Z',
        aksi: 'Penerimaan Berkas',
        keterangan: 'Penerimaan berkas transaksi jual beli dan dokumen asal dari penjual',
        user: 'Siti Rahmawati, S.H.'
      },
      {
        id: 'r2',
        tanggal: '2025-05-12T14:15:00Z',
        aksi: 'Pengecekan Sertipikat',
        keterangan: 'Pengecekan sertipikat online BPN Jaksel terbit status VALID/BERSIH',
        user: 'Fajar Nugraha, S.H.'
      },
      {
        id: 'r3',
        tanggal: '2025-05-15T11:00:00Z',
        aksi: 'Validasi Pajak PPh',
        keterangan: 'Validasi PPh Final berhasil dari KPP Kebayoran Baru',
        user: 'Dewi Anggraini, S.E.'
      }
    ]
  },
  {
    id: 'BKS-2025-002',
    nomorBerkas: 'BKS/NOT/2025/112',
    kategori: 'NOTARIS',
    jenisAkta: 'Pendirian PT (Perseroan Terbatas)',
    judulPekerjaan: 'Pendirian PT Nusantara Artha Mandiri (KBLI Konstruksi & Perdagangan)',
    namaKlien: 'Bpk. Raditya Kusuma (Dirut)',
    kontakKlien: '0813-1122-3344',
    emailKlien: 'raditya@nusantaraartha.id',
    instansiMitra: 'Ditjen AHU Kemenkumham RI',
    pihakPertama: {
      nama: 'Raditya Kusuma',
      nik: '3276011405820005',
      peran: 'Direktur Utama / Pendiri',
      telepon: '0813-1122-3344',
      alamat: 'Cinere, Depok'
    },
    pihakKedua: {
      nama: 'Ahmad Fauzi Rahman',
      nik: '3175080903850002',
      peran: 'Komisaris Utama / Pendiri',
      telepon: '0812-8877-6655',
      alamat: 'Kebayoran Lama, Jakarta Selatan'
    },
    picStaff: 'Budi Santoso (Admin & Perizinan AHU)',
    tahap: 'PROSES_BPN_SK',
    prioritas: 'NORMAL',
    tanggalMasuk: '2025-05-08',
    targetSelesai: '2025-05-22',
    nomorAkta: '07',
    nomorRepertorium: 'REP/NOT/V/2025/007',
    tanggalAkta: '2025-05-14',
    sifatAkta: 'Minuta Akta',
    lokasiFisikMap: 'Rak Notaris Map Kuning No. 112',
    kelengkapanDokumen: [
      { id: 'd21', nama: 'KTP & NPWP Seluruh Pendiri & Pengurus', wajib: true, status: 'LENGKAP' },
      { id: 'd22', nama: 'KK Direktur dan Komisaris', wajib: true, status: 'LENGKAP' },
      { id: 'd23', nama: 'Surat Keterangan Domisili Usaha / Perjanjian Sewa Kantor', wajib: true, status: 'LENGKAP' },
      { id: 'd24', nama: 'Pemesanan Nama PT & Bukti Voucher AHU', wajib: true, status: 'LENGKAP', keterangan: 'Nama disetujui AHU' },
      { id: 'd25', nama: 'Struktur Modal & Saham Disetor', wajib: true, status: 'LENGKAP' }
    ],
    keuangan: {
      honorarium: 6500000,
      titipanPPh: 0,
      titipanBPHTB: 0,
      biayaPNBP: 1500000,
      biayaOperasional: 500000,
      totalBiaya: 8500000,
      jumlahTerbayar: 8500000,
      statusPembayaran: 'LUNAS',
      catatanKeuangan: 'Lunas saat penandatanganan akta'
    },
    catatanKendala: 'Menunggu penomoran SK Kemenkumham dari server AHU Online',
    riwayat: [
      {
        id: 'r21',
        tanggal: '2025-05-08T10:00:00Z',
        aksi: 'Penerimaan Order',
        keterangan: 'Konsultasi pendirian PT & cek ketersediaan nama PT',
        user: 'Budi Santoso'
      },
      {
        id: 'r22',
        tanggal: '2025-05-14T15:30:00Z',
        aksi: 'Penandatanganan Akta',
        keterangan: 'Para penghadap menghadap Notaris Hj. Anindya Laksmi Prabowo, S.H., M.Kn.',
        user: 'Siti Rahmawati, S.H.'
      }
    ]
  },
  {
    id: 'BKS-2025-003',
    nomorBerkas: 'BKS/PPAT/2025/091',
    kategori: 'PPAT',
    jenisAkta: 'Akta Pemberian Hak Tanggungan (APHT)',
    judulPekerjaan: 'APHT Plafon Rp 3.500.000.000,- Agunan SHGB 891 (Bank Mandiri KC Fatmawati)',
    namaKlien: 'PT Gemilang Karya Mandiri & Bank Mandiri',
    kontakKlien: '0812-9900-1122',
    emailKlien: 'legal.kredit@bankmandiri.co.id',
    instansiMitra: 'PT Bank Mandiri (Persero) Tbk & BPN Jaksel',
    pihakPertama: {
      nama: 'PT Gemilang Karya Mandiri (Dedi Mulyadi)',
      nik: '3171011904720003',
      peran: 'Pemberi Hak Tanggungan (Debitur)',
      telepon: '0812-9900-1122',
      alamat: 'Jl. TB Simatupang No. 100, Jakarta Selatan'
    },
    pihakKedua: {
      nama: 'PT Bank Mandiri (Persero) Tbk (Kuasa Direksi)',
      nik: '3174092001800007',
      peran: 'Penerima Hak Tanggungan (Kreditur)',
      telepon: '021-52997700',
      alamat: 'Plaza Mandiri, Jl. Gatot Subroto Kav. 36-38, Jakarta'
    },
    picStaff: 'Fajar Nugraha, S.H. (Staf PPAT/Pertanahan)',
    tahap: 'DRAFTING_MINUTA',
    prioritas: 'URGENT',
    tanggalMasuk: '2025-05-16',
    targetSelesai: '2025-05-23',
    nomorAkta: '21/2025',
    nomorRepertorium: 'REP/PPAT/V/2025/021',
    lokasiFisikMap: 'Meja Fajar - Map Merah Urgent Bank Mandiri',
    kelengkapanDokumen: [
      { id: 'd31', nama: 'Perjanjian Kredit (PK) & Offering Letter Bank', wajib: true, status: 'LENGKAP' },
      { id: 'd32', nama: 'Surat Kuasa Direksi Bank Mandiri', wajib: true, status: 'LENGKAP' },
      { id: 'd33', nama: 'Asli Sertipikat SHGB 891', wajib: true, status: 'LENGKAP' },
      { id: 'd34', nama: 'Hasil Pengecekan Sertipikat BPN', wajib: true, status: 'LENGKAP' },
      { id: 'd35', nama: 'Persetujuan Dewan Komisaris / RUPS Debitur', wajib: true, status: 'MENYUSUL', keterangan: 'Sedang ditandatangani komisaris' }
    ],
    keuangan: {
      honorarium: 15000000,
      titipanPPh: 0,
      titipanBPHTB: 0,
      biayaPNBP: 3500000,
      biayaOperasional: 1200000,
      totalBiaya: 19700000,
      jumlahTerbayar: 10000000,
      statusPembayaran: 'DP',
      catatanKeuangan: 'DP Rp 10.000.000,- diterima. Sisa dibayar setelah penandatanganan.'
    },
    catatanKendala: 'Deadline pencairan kredit tanggal 26 Mei. Menunggu lembar RUPS persetujuan penjaminan aset.',
    riwayat: [
      {
        id: 'r31',
        tanggal: '2025-05-16T11:20:00Z',
        aksi: 'Order Masuk dari Bank',
        keterangan: 'Penyerahan covernote dan copy draft PK dari Bank Mandiri',
        user: 'Siti Rahmawati, S.H.'
      }
    ]
  },
  {
    id: 'BKS-2025-004',
    nomorBerkas: 'BKS/PPAT/2025/078',
    kategori: 'PPAT',
    jenisAkta: 'Roya Hak Tanggungan',
    judulPekerjaan: 'Penghapusan Roya Hak Tanggungan No. 1290/2019 atas SHM No. 2011/Jagakarsa',
    namaKlien: 'Ibu Ratna Juwita',
    kontakKlien: '0815-4433-2211',
    emailKlien: 'ratnajuwita@gmail.com',
    instansiMitra: 'BPN Jakarta Selatan & CIMB Niaga',
    pihakPertama: {
      nama: 'Ratna Juwita',
      nik: '3174095503790001',
      peran: 'Pemilik Tanah (Eks Debitur)',
      telepon: '0815-4433-2211',
      alamat: 'Jl. Jagakarsa Raya No. 42, Jakarta Selatan'
    },
    pihakKedua: {
      nama: 'PT Bank CIMB Niaga Tbk',
      nik: '-',
      peran: 'Kreditur yang Dilunasi',
      telepon: '14041',
      alamat: 'Graha Niaga, Jl. Jend. Sudirman Kav. 58'
    },
    picStaff: 'Rian Pratama (Kurir & Lapangan BPN)',
    tahap: 'PENJILIDAN_SALINAN',
    prioritas: 'NORMAL',
    tanggalMasuk: '2025-05-02',
    targetSelesai: '2025-05-20',
    nomorAkta: '-',
    nomorRepertorium: 'REP/PPAT/V/2025/ROYA-09',
    lokasiFisikMap: 'Box Selesai Menunggu Ambil',
    kelengkapanDokumen: [
      { id: 'd41', nama: 'Asli Sertipikat Tanah SHM 2011', wajib: true, status: 'LENGKAP' },
      { id: 'd42', nama: 'Asli Sertipikat Hak Tanggungan (SHT)', wajib: true, status: 'LENGKAP' },
      { id: 'd43', nama: 'Surat Keterangan Lunas dari Bank', wajib: true, status: 'LENGKAP' },
      { id: 'd44', nama: 'Surat Kuasa Roya', wajib: true, status: 'LENGKAP' }
    ],
    keuangan: {
      honorarium: 1500000,
      titipanPPh: 0,
      titipanBPHTB: 0,
      biayaPNBP: 50000,
      biayaOperasional: 450000,
      totalBiaya: 2000000,
      jumlahTerbayar: 2000000,
      statusPembayaran: 'LUNAS',
      catatanKeuangan: 'Lunas di awal'
    },
    catatanKendala: 'Catatan pencoretan sertipikat di buku tanah BPN selesai. Tinggal diserahkan ke klien.',
    riwayat: [
      {
        id: 'r41',
        tanggal: '2025-05-02T13:00:00Z',
        aksi: 'Penerimaan Dokumen',
        keterangan: 'Penerimaan sertipikat & surat lunas bank',
        user: 'Rian Pratama'
      },
      {
        id: 'r42',
        tanggal: '2025-05-18T16:00:00Z',
        aksi: 'Sertipikat Kembali dari BPN',
        keterangan: 'Pencoretan roya selesai dan cap BPN tercetak',
        user: 'Rian Pratama'
      }
    ]
  },
  {
    id: 'BKS-2025-005',
    nomorBerkas: 'BKS/NOT/2025/099',
    kategori: 'NOTARIS',
    jenisAkta: 'Perjanjian Kerjasama & Usaha (MOU/PKS)',
    judulPekerjaan: 'Perjanjian Kerjasama Joint Venture Distribusi Logistik Farmasi',
    namaKlien: 'PT Medika Farma Prima & PT Sehat Sentosa',
    kontakKlien: '0817-6655-4433',
    emailKlien: 'legal@medikafarma.co.id',
    instansiMitra: 'Swasta / Korporasi',
    pihakPertama: {
      nama: 'dr. Satria Wibowo, Sp.A (PT Medika Farma)',
      nik: '3172010101800002',
      peran: 'Pihak Pertama (Distributor)',
      telepon: '0817-6655-4433',
      alamat: 'Menteng, Jakarta Pusat'
    },
    pihakKedua: {
      nama: 'Ir. Herman Salim (PT Sehat Sentosa)',
      nik: '3173051508750009',
      peran: 'Pihak Kedua (Produsen)',
      telepon: '0811-9922-3311',
      alamat: 'Kelapa Gading, Jakarta Utara'
    },
    picStaff: 'Siti Rahmawati, S.H. (Senior Associate)',
    tahap: 'PENANDATANGANAN',
    prioritas: 'TINGGI',
    tanggalMasuk: '2025-05-11',
    targetSelesai: '2025-05-21',
    nomorAkta: '15',
    nomorRepertorium: 'REP/NOT/V/2025/015',
    lokasiFisikMap: 'Meja Notaris - Map Merah Penandatanganan',
    kelengkapanDokumen: [
      { id: 'd51', nama: 'Akta Pendirian & Perubahan Terakhir Kedua PT', wajib: true, status: 'LENGKAP' },
      { id: 'd52', nama: 'SK Kemenkumham Kedua Perusahaan', wajib: true, status: 'LENGKAP' },
      { id: 'd53', nama: 'KTP & NPWP Direksi Penandatangan', wajib: true, status: 'LENGKAP' },
      { id: 'd54', nama: 'Draft Kontrak / Syarat Klausula Bisnis Disepakati', wajib: true, status: 'LENGKAP' }
    ],
    keuangan: {
      honorarium: 12000000,
      titipanPPh: 0,
      titipanBPHTB: 0,
      biayaPNBP: 0,
      biayaOperasional: 1000000,
      totalBiaya: 13000000,
      jumlahTerbayar: 13000000,
      statusPembayaran: 'LUNAS',
      catatanKeuangan: 'Dibayar via Transfer Rek Mandiri'
    },
    catatanKendala: 'Jadwal pembacaan dan penandatanganan dijadwalkan besok siang jam 14.00 WIB di kantor.',
    riwayat: [
      {
        id: 'r51',
        tanggal: '2025-05-11T10:00:00Z',
        aksi: 'Konsultasi Perjanjian',
        keterangan: 'Review klausul arbitrase & wanprestasi',
        user: 'Siti Rahmawati, S.H.'
      },
      {
        id: 'r52',
        tanggal: '2025-05-17T17:00:00Z',
        aksi: 'Minuta Disetujui',
        keterangan: 'Draft final disetujui tim legal kedua perusahaan',
        user: 'Siti Rahmawati, S.H.'
      }
    ]
  },
  {
    id: 'BKS-2025-006',
    nomorBerkas: 'BKS/PPAT/2025/065',
    kategori: 'PPAT',
    jenisAkta: 'Akta Pembagian Hak Bersama (APHB)',
    judulPekerjaan: 'APHB Tanah Waris Alm. H. Mahfudz SHM No. 1045/Ragunan (3 Ahli Waris)',
    namaKlien: 'Keluarga Ahli Waris Alm. H. Mahfudz (Farhan Mahfudz)',
    kontakKlien: '0812-7788-9900',
    emailKlien: 'farhan.mahfudz@gmail.com',
    instansiMitra: 'BPN Jaksel & Pengadilan Agama Jaksel',
    pihakPertama: {
      nama: 'Farhan Mahfudz dkk (Para Ahli Waris)',
      nik: '3174091212880005',
      peran: 'Para Ahli Waris Bersama',
      telepon: '0812-7788-9900',
      alamat: 'Ragunan, Pasar Minggu, Jakarta Selatan'
    },
    pihakKedua: {
      nama: 'Farhan Mahfudz',
      nik: '3174091212880005',
      peran: 'Penerima Hak Tunggal Berdasarkan APHB',
      telepon: '0812-7788-9900',
      alamat: 'Ragunan, Pasar Minggu, Jakarta Selatan'
    },
    picStaff: 'Fajar Nugraha, S.H. (Staf PPAT/Pertanahan)',
    tahap: 'SELESAI',
    prioritas: 'NORMAL',
    tanggalMasuk: '2025-04-15',
    targetSelesai: '2025-05-15',
    tanggalSelesaiReal: '2025-05-14',
    nomorAkta: '04/2025',
    nomorRepertorium: 'REP/PPAT/V/2025/004',
    tanggalAkta: '2025-05-02',
    sifatAkta: 'Minuta Akta',
    lokasiFisikMap: 'Arsip Tetap 2025 / Box PPAT Mei',
    kelengkapanDokumen: [
      { id: 'd61', nama: 'Surat Keterangan Kematian & Ahli Waris Notaris', wajib: true, status: 'LENGKAP' },
      { id: 'd62', nama: 'KTP & KK Seluruh Ahli Waris', wajib: true, status: 'LENGKAP' },
      { id: 'd63', nama: 'Sertipikat Asli SHM No. 1045/Ragunan', wajib: true, status: 'LENGKAP' },
      { id: 'd64', nama: 'Surat Kesepakatan Pembagian Hak Waris Bersama', wajib: true, status: 'LENGKAP' },
      { id: 'd65', nama: 'Validasi BPHTB Waris Bapenda', wajib: true, status: 'LENGKAP' }
    ],
    keuangan: {
      honorarium: 9000000,
      titipanPPh: 0,
      titipanBPHTB: 18500000,
      biayaPNBP: 1200000,
      biayaOperasional: 800000,
      totalBiaya: 29500000,
      jumlahTerbayar: 29500000,
      statusPembayaran: 'LUNAS',
      catatanKeuangan: 'Lunas 100%'
    },
    catatanKendala: 'Pekerjaan selesai 100%. Salinan akta dan sertipikat baru telah diserahkan dengan tanda terima nomor TT-052/2025.',
    riwayat: [
      {
        id: 'r61',
        tanggal: '2025-04-15T09:00:00Z',
        aksi: 'Konsultasi Waris',
        keterangan: 'Pemeriksaan silsilah waris dan dokumen hak',
        user: 'Fajar Nugraha, S.H.'
      },
      {
        id: 'r62',
        tanggal: '2025-05-14T11:00:00Z',
        aksi: 'Penyerahan Selesai',
        keterangan: 'Penyerahan sertipikat hasil APHB kepada Klien',
        user: 'Siti Rahmawati, S.H.'
      }
    ]
  }
];
