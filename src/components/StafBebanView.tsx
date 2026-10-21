import React from 'react';
import { DAFTAR_STAF_PIC } from '../types';
import { useNotaris } from '../context/NotarisContext';
import { Users, CheckCircle2, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { hitungDeadline, hitungProgresTahap } from '../utils/formatters';

export const StafBebanView: React.FC = () => {
  const { berkasList, setSelectedBerkas, setIsDetailOpen } = useNotaris();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
        <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-600" />
          Beban Kerja & Produktivitas Staf Kantor
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Distribusi berkas pekerjaan kepada asisten notaris, staf pertanahan, perizinan, perpajakan, dan kurir BPN
        </p>
      </div>

      {/* Staff Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {DAFTAR_STAF_PIC.map(staf => {
          const files = berkasList.filter(b => b.picStaff === staf);
          const activeFiles = files.filter(b => b.tahap !== 'SELESAI');
          const completedFiles = files.filter(b => b.tahap === 'SELESAI');
          const urgentFiles = activeFiles.filter(b => {
            const dl = hitungDeadline(b.targetSelesai, b.tahap);
            return dl.status === 'TERLAMBAT' || dl.status === 'MENDEKATI' || b.prioritas === 'URGENT';
          });

          return (
            <div
              key={staf}
              className="bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
            >
              <div className="p-5">
                {/* Avatar and name */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-emerald-400 font-bold flex items-center justify-center text-sm shadow-inner">
                      {staf.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                        {staf.split('(')[0].trim()}
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {staf.includes('(') ? staf.split('(')[1].replace(')', '') : 'Staf Kantor'}
                      </p>
                    </div>
                  </div>
                  {urgentFiles.length > 0 && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-100 text-red-700 border border-red-300">
                      {urgentFiles.length} Urgent
                    </span>
                  )}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
                  <div className="p-2 rounded-lg bg-slate-50">
                    <div className="text-base font-bold text-slate-900">{activeFiles.length}</div>
                    <div className="text-[10px] text-slate-500 font-medium">Aktif</div>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-900">
                    <div className="text-base font-bold text-emerald-700">{completedFiles.length}</div>
                    <div className="text-[10px] text-emerald-700 font-medium">Selesai</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50">
                    <div className="text-base font-bold text-slate-900">{files.length}</div>
                    <div className="text-[10px] text-slate-500 font-medium">Total</div>
                  </div>
                </div>

                {/* Assigned Active Files list */}
                <div className="mt-4">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                    Berkas Sedang Ditangani ({activeFiles.length}):
                  </span>
                  {activeFiles.length === 0 ? (
                    <div className="text-xs text-slate-400 italic py-2">
                      Sedang tidak ada berkas aktif
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {activeFiles.map(b => {
                        const dl = hitungDeadline(b.targetSelesai, b.tahap);
                        return (
                          <div
                            key={b.id}
                            onClick={() => {
                              setSelectedBerkas(b);
                              setIsDetailOpen(true);
                            }}
                            className="p-2 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer text-xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-bold text-slate-900">
                                {b.nomorBerkas}
                              </span>
                              <span className={`text-[9px] px-1.5 py-0.2 rounded border ${dl.badgeClass}`}>
                                {dl.label}
                              </span>
                            </div>
                            <div className="font-medium text-slate-700 truncate mt-0.5">
                              {b.jenisAkta}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
