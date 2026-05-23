import React, { useState } from 'react'; 
import type { PredictionResponse, HistoryItem } from '../types';
import PredictionModal from '../components/PredictionModal';
import RecordButton from '../components/RecordButton';
import AudioPreview from '../components/AudioPreview';
import UploadInput from '../components/UploadInput';
import FloatingTaskbar, { type TabType } from '../components/FloatingTaskbar';
import HistoryView from './HistoryView';
 
interface TranslatorViewProps {
  isRecording: boolean;
  timeLeft: number;
  mediaBlobUrl: string | null;
  file: File | null;
  loading: boolean;
  displayError: string;
  prediction: PredictionResponse | null;
  
  // Props History
  history: HistoryItem[];
  onDeleteHistory: (ids: string[]) => void;
  onClearHistory: () => void;

  onToggleRecord: () => void;
  onRetake: () => void;
  onTranslate: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClosePrediction: () => void;
}

export default function TranslatorView({
  isRecording,
  timeLeft,
  mediaBlobUrl,
  file,
  loading,
  displayError,
  prediction,
  history,
  onDeleteHistory,
  onClearHistory,
  onToggleRecord,
  onRetake,
  onTranslate,
  onFileChange,
  onClosePrediction
}: TranslatorViewProps) {
  
  const [activeTab, setActiveTab] = useState<TabType>('record');
  const isTranslateDisabled = loading || (!isRecording && !mediaBlobUrl && !file);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pb-28 relative overflow-hidden font-sans selection:bg-indigo-100">
      
      {/* Background Blobs ... */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob animation-delay-2000"></div>

      {/* KONTEN UTAMA: PEREKAM */}
      {activeTab === 'record' && (
        <div className="bg-white/80 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] max-w-md w-full p-8 relative z-10 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
          
          <div className="flex items-center justify-center mb-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 shrink-0">
                <img src="/logo.png" alt="Logo" className="w-7 h-7 object-contain brightness-0 invert" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-black text-slate-800 leading-none tracking-tight">
                  Meow<span className="text-indigo-600">Translate</span>
                </h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  AI Interpreter
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center mb-10">
              <RecordButton 
                  isRecording={isRecording} 
                  timeLeft={timeLeft} 
                  onToggleRecord={onToggleRecord} 
              />
              <p className="mt-4 text-slate-400 text-xs font-medium">
                  {isRecording ? "Sedang mendengarkan..." : "Ketuk untuk mulai merekam"}
              </p>
          </div>

          <div className="min-h-20">
              {mediaBlobUrl && !isRecording && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 mb-6">
                  <AudioPreview 
                      mediaBlobUrl={mediaBlobUrl} 
                      onRetake={onRetake} 
                  />
              </div>
              )}
          </div>

          <button
            onClick={onTranslate}
            disabled={isTranslateDisabled}
            className={`w-full py-5 rounded-3xl text-white font-bold text-lg shadow-xl mb-8 transition-all duration-300 transform active:scale-95 ${
              isTranslateDisabled
                ? "bg-slate-200 shadow-none cursor-not-allowed text-slate-400"
                : "bg-slate-900 hover:bg-slate-800 hover:shadow-indigo-200 active:translate-y-0 -translate-y-1"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Menganalisis...
              </span>
            ) : "Terjemahkan Sekarang 🐾"}
          </button>

          {/* PERUBAHAN: Sembunyikan error jika PredictionModal sedang terbuka */}
          {displayError && !prediction && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-500 rounded-2xl text-center text-xs font-bold animate-pulse">
              {displayError}
            </div>
          )}

          <div className="pt-6 border-t border-slate-100">
              <UploadInput file={file} onFileChange={onFileChange} />
          </div>

          {/* Pemanggilan komponen Modal */}
          {prediction && (
            <PredictionModal prediction={prediction} onClose={onClosePrediction} />
          )}

        </div>
      )}

      {/* HALAMAN RIWAYAT KITA */}
      {activeTab === 'history' && (
        <HistoryView 
          history={history} 
          onDelete={onDeleteHistory} 
          onClearAll={onClearHistory} 
        />
      )}

      {/* HALAMAN NOTIFIKASI */}
      {activeTab === 'notification' && (
        <div className="text-center z-10 animate-in fade-in zoom-in-95 duration-300">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Notifikasi</h2>
          <p className="text-slate-500">Belum ada pembaruan untuk kucingmu hari ini.</p>
        </div>
      )}

      <FloatingTaskbar 
        activeTab={activeTab} 
        onTabChange={(tab) => setActiveTab(tab)} 
      />

    </div>
  );
}