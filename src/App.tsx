/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NotarisProvider, useNotaris } from './context/NotarisContext';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { PipelineView } from './components/PipelineView';
import { BerkasTableView } from './components/BerkasTableView';
import { RepertoriumView } from './components/RepertoriumView';
import { KeuanganView } from './components/KeuanganView';
import { StafBebanView } from './components/StafBebanView';
import { BerkasDetailModal } from './components/BerkasDetailModal';
import { BerkasFormModal } from './components/BerkasFormModal';
import { PengaturanModal } from './components/PengaturanModal';
import { PrintModals } from './components/PrintModals';
import { Scale, Heart } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, profilKantor } = useNotaris();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'pipeline' && <PipelineView />}
        {activeTab === 'tabel' && <BerkasTableView />}
        {activeTab === 'repertorium' && <RepertoriumView />}
        {activeTab === 'keuangan' && <KeuanganView />}
        {activeTab === 'staf' && <StafBebanView />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px]">
              <Scale className="w-3 h-3" />
            </div>
            <span className="font-bold text-slate-700">SIMNO</span>
            <span>&copy; {new Date().getFullYear()} Kantor {profilKantor.namaNotaris}</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>Format Deploy: Vercel SPA (Vite)</span>
            <span>•</span>
            <span>Wilayah: {profilKantor.wilayahKerja.split('&')[0].trim()}</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <BerkasDetailModal />
      <BerkasFormModal />
      <PengaturanModal />
      <PrintModals />
    </div>
  );
};

export default function App() {
  return (
    <NotarisProvider>
      <MainContent />
    </NotarisProvider>
  );
}
