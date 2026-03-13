// src/views/HistoryView.tsx
import { useState } from 'react';
import type { HistoryItem } from '../types';

interface HistoryViewProps {
  history: HistoryItem[];
  onDelete: (ids: string[]) => void;
  onClearAll: () => void;
}

export default function HistoryView({ history, onDelete, onClearAll }: HistoryViewProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // Toggle item yang dipilih
  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Konfirmasi dan hapus yang terpilih
  const handleDeleteSelected = () => {
    if (selectedIds.length > 0) {
      onDelete(selectedIds);
      setSelectedIds([]);
      setIsSelectionMode(false);
    }
  };

  // Format tanggal (contoh: "12 Okt 2026, 14:30")
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', { 
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' 
    });
  };

  return (
    <div className="bg-white/80 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] max-w-md w-full p-8 relative z-10 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 flex flex-col max-h-[80vh]">
      
      {/* Header Riwayat */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Riwayat</h2>
          <p className="text-xs text-slate-500 font-medium">{history.length} Terjemahan tersimpan</p>
        </div>
        
        {history.length > 0 && (
          <button 
            onClick={() => {
              setIsSelectionMode(!isSelectionMode);
              if (isSelectionMode) setSelectedIds([]); // Reset saat membatalkan pilihan
            }}
            className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl hover:bg-indigo-100 transition-colors"
          >
            {isSelectionMode ? 'Batal' : 'Pilih'}
          </button>
        )}
      </div>

      {/* Daftar Riwayat (Scrollable) */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center opacity-60">
            <span className="text-4xl mb-3">📭</span>
            <p className="text-slate-500 text-sm font-medium">Belum ada riwayat terjemahan.</p>
          </div>
        ) : (
          history.map(item => (
            <div 
              key={item.id} 
              onClick={() => isSelectionMode && toggleSelection(item.id)}
              className={`relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                selectedIds.includes(item.id) 
                  ? 'border-indigo-400 bg-indigo-50/50 shadow-sm' 
                  : 'border-slate-100 bg-white hover:border-indigo-200 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox muncul jika dalam mode seleksi */}
                {isSelectionMode && (
                  <div className={`mt-1 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                    selectedIds.includes(item.id) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'
                  }`}>
                    {selectedIds.includes(item.id) && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                )}
                
                {/* Konten Terjemahan */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-400">{formatDate(item.date)}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      {item.confidence}
                    </span>
                  </div>
                  <h3 className="text-slate-800 font-bold text-base leading-snug">"{item.prediction}"</h3>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Action Area (Hanya muncul jika mode seleksi aktif) */}
      {isSelectionMode && history.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between animate-in slide-in-from-bottom-2">
          <button 
            onClick={onClearAll}
            className="text-xs font-bold text-red-500 hover:text-red-700 px-2 transition-colors"
          >
            Bersihkan Semua
          </button>
          
          <button 
            onClick={handleDeleteSelected}
            disabled={selectedIds.length === 0}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md ${
              selectedIds.length === 0 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-red-500 text-white hover:bg-red-600 hover:shadow-red-200'
            }`}
          >
            Hapus ({selectedIds.length})
          </button>
        </div>
      )}
    </div>
  );
}