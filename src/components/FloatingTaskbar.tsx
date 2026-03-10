export type TabType = 'history' | 'record' | 'notification';

interface FloatingTaskbarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function FloatingTaskbar({ activeTab, onTabChange }: FloatingTaskbarProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-8 px-6 py-3 bg-white/70 backdrop-blur-2xl border border-white/40 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.1)] transition-all">
        
        {/* Tombol Kiri: History */}
        <button 
          onClick={() => onTabChange('history')}
          className={`p-2 transition-colors group flex flex-col items-center gap-1 ${
            activeTab === 'history' ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-400'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 group-active:scale-95 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={activeTab === 'history' ? 2.5 : 2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {/* Titik indikator kecil di bawah icon jika aktif */}
          <span className={`w-1 h-1 rounded-full transition-all duration-300 ${activeTab === 'history' ? 'bg-indigo-600 scale-100' : 'bg-transparent scale-0'}`}></span>
        </button>

        {/* Tombol Tengah: Rekam (Main FAB / Halaman Saat Ini) */}
        <button 
          onClick={() => onTabChange('record')}
          className={`relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform active:scale-95 border-4 border-white/80 ${
            activeTab === 'record' 
              ? 'bg-indigo-600 text-white shadow-indigo-300 -translate-y-1' 
              : 'bg-slate-800 text-white shadow-slate-300 hover:-translate-y-1 hover:bg-indigo-500'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>

        {/* Tombol Kanan: Notifikasi */}
        <button 
          onClick={() => onTabChange('notification')}
          className={`relative p-2 transition-colors group flex flex-col items-center gap-1 ${
            activeTab === 'notification' ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-400'
          }`}
        >
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 group-active:scale-95 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={activeTab === 'notification' ? 2.5 : 2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {/* Dot Notifikasi Tetap Ada */}
            <span className="absolute top-0 right-0.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
          </div>
          {/* Titik indikator kecil di bawah icon jika aktif */}
          <span className={`w-1 h-1 rounded-full transition-all duration-300 ${activeTab === 'notification' ? 'bg-indigo-600 scale-100' : 'bg-transparent scale-0'}`}></span>
        </button>
        
      </div>
    </div>
  );
}