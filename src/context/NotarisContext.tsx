import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BerkasNotaris,
  ProfilKantor,
  StatusDokumen,
  TahapPekerjaan,
  TAHAPAN_LIST,
  KeuanganBerkas
} from '../types';
import { INITIAL_BERKAS, PROFIL_KANTOR_DEFAULT } from '../data/initialData';

const STORAGE_BERKAS_KEY = 'simno_berkas_data_v1';
const STORAGE_PROFIL_KEY = 'simno_profil_kantor_v1';

export type NavigationTab = 'dashboard' | 'pipeline' | 'tabel' | 'repertorium' | 'keuangan' | 'staf';

interface NotarisContextType {
  berkasList: BerkasNotaris[];
  profilKantor: ProfilKantor;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  kategoriFilter: 'SEMUA' | 'NOTARIS' | 'PPAT';
  setKategoriFilter: (k: 'SEMUA' | 'NOTARIS' | 'PPAT') => void;
  
  // Modals & Selection
  selectedBerkas: BerkasNotaris | null;
  setSelectedBerkas: (b: BerkasNotaris | null) => void;
  isDetailOpen: boolean;
  setIsDetailOpen: (open: boolean) => void;
  isFormOpen: boolean;
  setIsFormOpen: (open: boolean) => void;
  formEditingBerkas: BerkasNotaris | null;
  openNewForm: () => void;
  openEditForm: (b: BerkasNotaris) => void;
  isPengaturanOpen: boolean;
  setIsPengaturanOpen: (open: boolean) => void;
  printModalType: 'disposisi' | 'repertorium' | 'kwitansi' | null;
  setPrintModalType: (type: 'disposisi' | 'repertorium' | 'kwitansi' | null) => void;

  // Actions
  addBerkas: (berkasData: Omit<BerkasNotaris, 'id' | 'riwayat'>) => void;
  updateBerkas: (berkas: BerkasNotaris) => void;
  deleteBerkas: (id: string) => void;
  advanceTahap: (id: string, step: 1 | -1) => void;
  setDirectTahap: (id: string, targetTahap: TahapPekerjaan) => void;
  updateStatusDokumen: (berkasId: string, docId: string, status: StatusDokumen) => void;
  addDokumenSyarat: (berkasId: string, nama: string, wajib: boolean) => void;
  deleteDokumenSyarat: (berkasId: string, docId: string) => void;
  updateKeuangan: (berkasId: string, keuangan: Partial<KeuanganBerkas>) => void;
  updateProfilKantor: (profil: ProfilKantor) => void;
  resetDataKeDefault: () => void;
  importDataFromJson: (jsonStr: string) => { success: boolean; message: string };
}

const NotarisContext = createContext<NotarisContextType | undefined>(undefined);

export const NotarisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [berkasList, setBerkasList] = useState<BerkasNotaris[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_BERKAS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading berkas from localStorage', e);
    }
    return INITIAL_BERKAS;
  });

  const [profilKantor, setProfilKantor] = useState<ProfilKantor>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROFIL_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading profil from localStorage', e);
    }
    return PROFIL_KANTOR_DEFAULT;
  });

  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [kategoriFilter, setKategoriFilter] = useState<'SEMUA' | 'NOTARIS' | 'PPAT'>('SEMUA');

  const [selectedBerkas, setSelectedBerkas] = useState<BerkasNotaris | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formEditingBerkas, setFormEditingBerkas] = useState<BerkasNotaris | null>(null);
  const [isPengaturanOpen, setIsPengaturanOpen] = useState(false);
  const [printModalType, setPrintModalType] = useState<'disposisi' | 'repertorium' | 'kwitansi' | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_BERKAS_KEY, JSON.stringify(berkasList));
    } catch (err) {
      console.error('Failed to save berkas to localStorage', err);
    }
  }, [berkasList]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROFIL_KEY, JSON.stringify(profilKantor));
    } catch (err) {
      console.error('Failed to save profil to localStorage', err);
    }
  }, [profilKantor]);

  // Keep selectedBerkas in sync if list updates
  useEffect(() => {
    if (selectedBerkas) {
      const updated = berkasList.find(b => b.id === selectedBerkas.id);
      if (updated) {
        setSelectedBerkas(updated);
      }
    }
  }, [berkasList]);

  const openNewForm = () => {
    setFormEditingBerkas(null);
    setIsFormOpen(true);
  };

  const openEditForm = (b: BerkasNotaris) => {
    setFormEditingBerkas(b);
    setIsFormOpen(true);
  };

  const addBerkas = (berkasData: Omit<BerkasNotaris, 'id' | 'riwayat'>) => {
    const newId = `BKS-${new Date().getFullYear()}-${String(berkasList.length + 1).padStart(3, '0')}`;
    const initialLog = {
      id: `log-${Date.now()}`,
      tanggal: new Date().toISOString(),
      aksi: 'Pendaftaran Berkas',
      keterangan: `Berkas didaftarkan untuk pekerjaan: ${berkasData.judulPekerjaan}`,
      user: profilKantor.namaAdmin || 'Admin Notaris'
    };

    const newBerkas: BerkasNotaris = {
      ...berkasData,
      id: newId,
      riwayat: [initialLog]
    };

    setBerkasList(prev => [newBerkas, ...prev]);
  };

  const updateBerkas = (updated: BerkasNotaris) => {
    setBerkasList(prev =>
      prev.map(item => (item.id === updated.id ? updated : item))
    );
  };

  const deleteBerkas = (id: string) => {
    setBerkasList(prev => prev.filter(b => b.id !== id));
    if (selectedBerkas?.id === id) {
      setSelectedBerkas(null);
      setIsDetailOpen(false);
    }
  };

  const advanceTahap = (id: string, step: 1 | -1) => {
    setBerkasList(prev =>
      prev.map(berkas => {
        if (berkas.id !== id) return berkas;
        const currentIdx = TAHAPAN_LIST.findIndex(t => t.key === berkas.tahap);
        const nextIdx = currentIdx + step;
        if (nextIdx < 0 || nextIdx >= TAHAPAN_LIST.length) return berkas;

        const nextTahap = TAHAPAN_LIST[nextIdx].key;
        const nowIso = new Date().toISOString();
        const actionText = step > 0 ? 'Maju ke tahap' : 'Kembali ke tahap';
        
        const newLog = {
          id: `log-${Date.now()}`,
          tanggal: nowIso,
          aksi: `Perubahan Tahap`,
          keterangan: `${actionText}: ${TAHAPAN_LIST[nextIdx].label}`,
          user: profilKantor.namaAdmin || 'Petugas Notaris'
        };

        const isNowSelesai = nextTahap === 'SELESAI';

        return {
          ...berkas,
          tahap: nextTahap,
          tanggalSelesaiReal: isNowSelesai ? new Date().toISOString().split('T')[0] : berkas.tanggalSelesaiReal,
          riwayat: [newLog, ...berkas.riwayat]
        };
      })
    );
  };

  const setDirectTahap = (id: string, targetTahap: TahapPekerjaan) => {
    setBerkasList(prev =>
      prev.map(berkas => {
        if (berkas.id !== id || berkas.tahap === targetTahap) return berkas;
        const targetConfig = TAHAPAN_LIST.find(t => t.key === targetTahap);
        
        const newLog = {
          id: `log-${Date.now()}`,
          tanggal: new Date().toISOString(),
          aksi: 'Update Status Tahap',
          keterangan: `Dipindahkan langsung ke: ${targetConfig?.label || targetTahap}`,
          user: profilKantor.namaAdmin || 'Petugas Notaris'
        };

        return {
          ...berkas,
          tahap: targetTahap,
          tanggalSelesaiReal: targetTahap === 'SELESAI' ? new Date().toISOString().split('T')[0] : berkas.tanggalSelesaiReal,
          riwayat: [newLog, ...berkas.riwayat]
        };
      })
    );
  };

  const updateStatusDokumen = (berkasId: string, docId: string, status: StatusDokumen) => {
    setBerkasList(prev =>
      prev.map(b => {
        if (b.id !== berkasId) return b;
        return {
          ...b,
          kelengkapanDokumen: b.kelengkapanDokumen.map(d =>
            d.id === docId ? { ...d, status } : d
          )
        };
      })
    );
  };

  const addDokumenSyarat = (berkasId: string, nama: string, wajib: boolean) => {
    setBerkasList(prev =>
      prev.map(b => {
        if (b.id !== berkasId) return b;
        const newDoc = {
          id: `doc-${Date.now()}`,
          nama,
          wajib,
          status: 'BELUM' as StatusDokumen
        };
        return {
          ...b,
          kelengkapanDokumen: [...b.kelengkapanDokumen, newDoc]
        };
      })
    );
  };

  const deleteDokumenSyarat = (berkasId: string, docId: string) => {
    setBerkasList(prev =>
      prev.map(b => {
        if (b.id !== berkasId) return b;
        return {
          ...b,
          kelengkapanDokumen: b.kelengkapanDokumen.filter(d => d.id !== docId)
        };
      })
    );
  };

  const updateKeuangan = (berkasId: string, patch: Partial<KeuanganBerkas>) => {
    setBerkasList(prev =>
      prev.map(b => {
        if (b.id !== berkasId) return b;
        const updatedK: KeuanganBerkas = {
          ...b.keuangan,
          ...patch
        };
        // Recalculate total if any fee altered
        const total =
          (updatedK.honorarium || 0) +
          (updatedK.titipanPPh || 0) +
          (updatedK.titipanBPHTB || 0) +
          (updatedK.biayaPNBP || 0) +
          (updatedK.biayaOperasional || 0);

        updatedK.totalBiaya = total;

        let statusBayar: 'LUNAS' | 'DP' | 'BELUM_BAYAR' = 'BELUM_BAYAR';
        if (updatedK.jumlahTerbayar >= total && total > 0) {
          statusBayar = 'LUNAS';
        } else if (updatedK.jumlahTerbayar > 0) {
          statusBayar = 'DP';
        }
        updatedK.statusPembayaran = statusBayar;

        return {
          ...b,
          keuangan: updatedK
        };
      })
    );
  };

  const updateProfilKantor = (profil: ProfilKantor) => {
    setProfilKantor(profil);
  };

  const resetDataKeDefault = () => {
    setBerkasList(INITIAL_BERKAS);
    setProfilKantor(PROFIL_KANTOR_DEFAULT);
    localStorage.removeItem(STORAGE_BERKAS_KEY);
    localStorage.removeItem(STORAGE_PROFIL_KEY);
  };

  const importDataFromJson = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.berkasList && Array.isArray(parsed.berkasList)) {
        setBerkasList(parsed.berkasList);
        if (parsed.profilKantor) {
          setProfilKantor(parsed.profilKantor);
        }
        return { success: true, message: `Berhasil mengimpor ${parsed.berkasList.length} data berkas.` };
      } else if (Array.isArray(parsed)) {
        setBerkasList(parsed);
        return { success: true, message: `Berhasil mengimpor ${parsed.length} data berkas.` };
      }
      return { success: false, message: 'Format file JSON tidak valid (harus berisi array berkas atau objek backup).' };
    } catch {
      return { success: false, message: 'Gagal membaca format file JSON.' };
    }
  };

  return (
    <NotarisContext.Provider
      value={{
        berkasList,
        profilKantor,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        kategoriFilter,
        setKategoriFilter,
        selectedBerkas,
        setSelectedBerkas,
        isDetailOpen,
        setIsDetailOpen,
        isFormOpen,
        setIsFormOpen,
        formEditingBerkas,
        openNewForm,
        openEditForm,
        isPengaturanOpen,
        setIsPengaturanOpen,
        printModalType,
        setPrintModalType,
        addBerkas,
        updateBerkas,
        deleteBerkas,
        advanceTahap,
        setDirectTahap,
        updateStatusDokumen,
        addDokumenSyarat,
        deleteDokumenSyarat,
        updateKeuangan,
        updateProfilKantor,
        resetDataKeDefault,
        importDataFromJson
      }}
    >
      {children}
    </NotarisContext.Provider>
  );
};

export const useNotaris = () => {
  const context = useContext(NotarisContext);
  if (!context) {
    throw new Error('useNotaris must be used within a NotarisProvider');
  }
  return context;
};
