import { TahapPekerjaan, TAHAPAN_LIST, BerkasNotaris } from '../types';

export function formatRupiah(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return 'Rp 0';
  return 'Rp ' + amount.toLocaleString('id-ID');
}

export function formatTanggalIndo(dateString?: string): string {
  if (!dateString) return '-';
  try {
    const parts = dateString.split('T')[0].split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? dateString : d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function formatTanggalWaktuIndo(isoString?: string): string {
  if (!isoString) return '-';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return isoString;
  }
}

export interface DeadlineInfo {
  selisihHari: number;
  status: 'AMAN' | 'MENDEKATI' | 'TERLAMBAT' | 'SELESAI';
  label: string;
  badgeClass: string;
}

export function hitungDeadline(targetDateStr?: string, statusTahap?: TahapPekerjaan): DeadlineInfo {
  if (statusTahap === 'SELESAI') {
    return {
      selisihHari: 0,
      status: 'SELESAI',
      label: 'Selesai Tepat Waktu',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    };
  }

  if (!targetDateStr) {
    return {
      selisihHari: 999,
      status: 'AMAN',
      label: 'Tanpa Target',
      badgeClass: 'bg-slate-100 text-slate-600 border-slate-200'
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parts = targetDateStr.split('-');
  const target = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      selisihHari: diffDays,
      status: 'TERLAMBAT',
      label: `Terlambat ${Math.abs(diffDays)} hari`,
      badgeClass: 'bg-red-50 text-red-700 border-red-200 font-semibold animate-pulse'
    };
  } else if (diffDays <= 3) {
    return {
      selisihHari: diffDays,
      status: 'MENDEKATI',
      label: diffDays === 0 ? 'Hari Ini Jatuh Tempo' : `Sisa ${diffDays} hari`,
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-300 font-medium'
    };
  } else {
    return {
      selisihHari: diffDays,
      status: 'AMAN',
      label: `Sisa ${diffDays} hari`,
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    };
  }
}

export function hitungProgresTahap(tahap: TahapPekerjaan): number {
  const cfg = TAHAPAN_LIST.find(t => t.key === tahap);
  if (!cfg) return 0;
  return Math.round((cfg.nomor / TAHAPAN_LIST.length) * 100);
}

export function exportKeCSV(berkasList: BerkasNotaris[], namaFile = 'repertorium_notaris_ppat.csv') {
  const headers = [
    'No. Berkas',
    'Kategori',
    'Jenis Akta',
    'Nama Klien / Penghadap',
    'Judul Transaksi',
    'Tahap Saat Ini',
    'PIC Staf',
    'Tgl Masuk',
    'Target Selesai',
    'No. Akta',
    'No. Repertorium',
    'Honorarium',
    'Titipan Pajak PPh',
    'Titipan Pajak BPHTB',
    'Total Tagihan',
    'Status Bayar'
  ];

  const rows = berkasList.map(b => [
    `"${b.nomorBerkas}"`,
    `"${b.kategori}"`,
    `"${b.jenisAkta.replace(/"/g, '""')}"`,
    `"${b.namaKlien.replace(/"/g, '""')}"`,
    `"${b.judulPekerjaan.replace(/"/g, '""')}"`,
    `"${TAHAPAN_LIST.find(t => t.key === b.tahap)?.label || b.tahap}"`,
    `"${b.picStaff}"`,
    `"${b.tanggalMasuk}"`,
    `"${b.targetSelesai}"`,
    `"${b.nomorAkta || '-'}"`,
    `"${b.nomorRepertorium || '-'}"`,
    b.keuangan.honorarium,
    b.keuangan.titipanPPh,
    b.keuangan.titipanBPHTB,
    b.keuangan.totalBiaya,
    `"${b.keuangan.statusPembayaran}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', namaFile);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
