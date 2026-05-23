import { type PredictionResponse } from '../types';

interface PredictionModalProps {
  prediction: PredictionResponse;
  onClose: () => void;
}

export default function PredictionModal({ prediction, onClose }: PredictionModalProps) {
  
  // --- KONDISI 1: Jika Terjadi Error pada API ---
  if (prediction.error) {
    return (
      <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 animate-fade-in">
        <div className="w-full max-w-xs text-center">
          <div className="text-4xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-red-600 mb-2">Terjadi Kesalahan</h2>
          <p className="text-gray-600 text-sm mb-8">{prediction.error}</p>
          <button 
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-gray-800 transition-colors shadow-lg"
          >
            Tutup
          </button>
        </div>
      </div>
    );
  }

  // --- KONDISI 2: Jika Tahap 1 Menolak (Bukan Kucing) ---
  if (prediction.is_cat === false) {
    return (
      <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 animate-fade-in">
        <div className="w-full max-w-xs text-center">
          <div className="w-20 h-20 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
            ⚠️
          </div>
          <h2 className="text-2xl font-black text-gray-800 mb-2 tracking-tight">Bukan Suara Kucing</h2>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            {prediction.message || "Sistem mendeteksi bahwa suara ini bukan berasal dari kucing. Silakan coba lagi."}
          </p>
          <button 
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-amber-500 text-white font-bold text-sm hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/30"
          >
            Coba Rekam Ulang
          </button>
        </div>
      </div>
    );
  }

  // --- KONDISI 3: Normal (Model Emosi Berjalan) ---
  return (
    <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-xs text-center">
        <h2 className="text-xs text-gray-400 uppercase tracking-widest mb-4">Kucingmu Merasa</h2>
        
        <div className="bg-indigo-50 rounded-3xl p-6 mb-6 border border-indigo-100 shadow-inner">
          <div className="text-5xl font-black text-indigo-600 mb-2 drop-shadow-sm tracking-tight">
            {prediction.prediction}
          </div>
          <div className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wide">
            Tingkat Akurasi: {prediction.confidence}
          </div>
        </div>

        <div className="space-y-4 w-full text-left px-2">
          {prediction.scores && Object.entries(prediction.scores).map(([label, score]) => (
            <div key={label}>
              <div className="flex justify-between text-xs text-gray-500 mb-1 font-bold">
                <span>{label}</span>
                <span>{(score * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    label === prediction.prediction ? 'bg-indigo-500' : 'bg-gray-300'
                  }`}
                  style={{ width: `${score * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={onClose}
          className="mt-10 w-full py-3 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-gray-800 transition-colors shadow-lg"
        >
          Kembali
        </button>
      </div>
    </div>
  );
}