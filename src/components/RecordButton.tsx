import { Mic } from 'lucide-react';

interface RecordButtonProps {
  isRecording: boolean;
  timeLeft: number;
  onToggleRecord: () => void;
}

export default function RecordButton({ isRecording, timeLeft, onToggleRecord }: RecordButtonProps) {
  return (
    <div className="flex flex-col items-center justify-center mb-8 relative">
      <div className="relative">
        {isRecording && (
           <>
            <span className="absolute inset-0 rounded-full bg-red-400 opacity-20 animate-ping"></span>
            <span className="absolute inset-0 rounded-full border-4 border-red-500 opacity-50 animate-pulse"></span>
           </> 
        )}
        
        <button
          onClick={onToggleRecord}
          className={`relative z-10 w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-300 border-4 ${
            isRecording 
              ? "bg-red-500 border-red-200 text-white scale-110" 
              : "bg-indigo-600 border-indigo-200 text-white hover:bg-indigo-700 hover:scale-105"
          }`}
        >
          {isRecording ? (
            <>
              <span className="text-3xl font-bold mb-1">{timeLeft}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider">Detik</span>
            </>
          ) : (
            <Mic size={40} />
          )}
        </button>
      </div>
      
      {/* <p className="mt-5 font-medium text-gray-600 text-center h-6">
        {isRecording 
          ? <span className="text-red-500 animate-pulse font-bold">Merekam suara kucing...</span> 
          : "Ketuk Mic untuk Mulai"}
      </p> */}
    </div>
  );
}