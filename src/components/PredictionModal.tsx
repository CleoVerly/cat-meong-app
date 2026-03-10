import { type PredictionResponse } from '../types';

interface PredictionModalProps {
  prediction: PredictionResponse;
  onClose: () => void;
}

export default function PredictionModal({ prediction, onClose }: PredictionModalProps) {
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