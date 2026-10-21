import React from 'react';
import {
  FileText,
  LayoutDashboard,
  Kanban,
  TableProperties,
  BookOpen,
  DollarSign,
  Users,
  Plus,
  Settings,
  Search,
  Scale
} from 'lucide-react';
import { useNotaris, NavigationTab } from '../context/NotarisContext';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    kategoriFilter,
    setKategoriFilter,
    openNewForm,
    setIsPengaturanOpen,
    profilKantor,
    berkasList
  } = useNotaris();

  // Hitung berkas yang butuh perhatian / overdue
  const today = new Date().toISOString().split('T')[0];
  const urgentCount = berkasList.filter(b => {
    if (b.tahap === 'SELESAI') return false;
    return b.targetSelesai < today || b.prioritas === 'URGENT';
  }).length;

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'pipeline', label: 'Alur Tahapan (Kanban)', icon: <Kanban className="w-4 h-4" /> },
    { id: 'tabel', label: 'Daftar Berkas', icon: <TableProperties className="w-4 h-4" />, badge: berkasList.length },
    { id: 'repertorium', label: 'Buku Repertorium', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'keuangan', label: 'Keuangan & Titipan Pajak', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'staf', label: 'Beban Kerja Staf', icon: <Users className="w-4 h-4" /> }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-md border-b border-slate-800">
      {/* Top Banner / Office Identity */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2.5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-inner font-bold">
              <Scale className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                  SIMNO
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                  Notaris & PPAT
                </span>
                <span className="hidden sm:inline-flex items-center text-[10px] font-medium text-slate-400 bg-slate-800/70 px-2 py-0.5 rounded">
                  Vercel Ready
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium truncate max-w-md">
                {profilKantor.namaNotaris}
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={openNewForm}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Berkas Baru</span>
            </button>

            <button
              onClick={() => setIsPengaturanOpen(true)}
              title="Pengaturan Kantor & Backup"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer border border-slate-700/60"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Second Row: Navigation Tabs & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 py-2">
          {/* Main Navigation */}
          <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {item.badge}
                    </span>
                  )}
                  {item.id === 'pipeline' && urgentCount > 0 && (
                    <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-red-950 text-red-300 border border-red-800">
                      {urgentCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Filter: Kategori & Search */}
          <div className="flex items-center gap-2">
            {/* Filter Kategori Switcher */}
            <div className="inline-flex rounded-md p-0.5 bg-slate-800 border border-slate-700/80 text-xs">
              {(['SEMUA', 'NOTARIS', 'PPAT'] as const).map(kategori => (
                <button
                  key={kategori}
                  onClick={() => setKategoriFilter(kategori)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                    kategoriFilter === kategori
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {kategori}
                </button>
              ))}
            </div>

            {/* Global Search Bar */}
            <div className="relative min-w-[180px] sm:min-w-[220px]">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari berkas / klien / akta..."
                className="w-full pl-8 pr-3 py-1 bg-slate-800/90 border border-slate-700 rounded-md text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-200"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
