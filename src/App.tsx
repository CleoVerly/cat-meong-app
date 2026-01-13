import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Mic, Square, Upload, RotateCcw, PlayCircle } from 'lucide-react';

// URL API Backend
const API_URL = "https://cleoverly-meong-api.hf.space";

// Durasi maksimal rekaman (dalam milidetik) -> 4 Detik
const MAX_RECORDING_TIME = 4000; 

interface PredictionResponse {
  prediction: string;
  confidence: string;
  scores: Record<string, number>;
  error?: string;
}

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [inputType, setInputType] = useState<"record" | "upload">("record");
  const [isRecording, setIsRecording] = useState(false);
  const [mediaBlobUrl, setMediaBlobUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // State untuk hitungan mundur visual
  const [timeLeft, setTimeLeft] = useState<number>(MAX_RECORDING_TIME / 1000);

  // --- LOGIKA PEREKAMAN MANUAL (Native Browser API) ---
  const startRecording = async () => {
    try {
      setMediaBlobUrl(null); // Reset rekaman sebelumnya
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setMediaBlobUrl(url);
        
        // Matikan semua track agar icon mic di browser mati
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError("");
    } catch (err) {
      console.error("Gagal akses mikrofon:", err);
      setError("Gagal mengakses mikrofon. Izinkan akses di browser.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const clearBlobUrl = () => {
    if (mediaBlobUrl) {
      URL.revokeObjectURL(mediaBlobUrl);
    }
    setMediaBlobUrl(null);
  };

  // --- LOGIKA AUTO STOP & COUNTDOWN ---
  useEffect(() => {
    let timer: number;
    let countdownInterval: number;

    if (isRecording) {
      setTimeLeft(MAX_RECORDING_TIME / 1000);
      timer = setTimeout(() => {
        stopRecording();
      }, MAX_RECORDING_TIME);
      countdownInterval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    // Cleanup
    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
    };
  }, [isRecording]);

  // Reset error/prediction saat ganti input
  useEffect(() => {
    setPrediction(null);
    setError("");
  }, [file, mediaBlobUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setInputType("upload");
      clearBlobUrl();
    }
  };

  const handleTranslate = async () => {
    setLoading(true);
    setError("");
    setPrediction(null);

    const formData = new FormData();

    try {
      if (inputType === "record" && mediaBlobUrl) {
        const audioBlob = await fetch(mediaBlobUrl).then((r) => r.blob());
        // Nama file wav penting agar backend tahu formatnya
        formData.append("file", audioBlob, "recording.wav");
      } else if (inputType === "upload" && file) {
        formData.append("file", file);
      } else {
        setError("Rekam suara atau upload file dulu!");
        setLoading(false);
        return;
      }

      const response = await axios.post<PredictionResponse>(`${API_URL}/predict`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.error) throw new Error(response.data.error);
      setPrediction(response.data);

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || err.message || "Gagal memproses suara.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2 tracking-tight">🐱 Meow Translate</h1>
          <p className="text-gray-500 text-sm">Tekan mic saat kucingmu mengeong!</p>
        </div>

        {/* --- AREA UTAMA: TOMBOL RECORD --- */}
        <div className="flex flex-col items-center justify-center mb-8 relative">
          
          {/* Circular Progress (Visual Hiasan) */}
          <div className="relative">
            {isRecording && (
               <>
                <span className="absolute inset-0 rounded-full bg-red-400 opacity-20 animate-ping"></span>
                <span className="absolute inset-0 rounded-full border-4 border-red-500 opacity-50 animate-pulse"></span>
               </>
            )}
            
            <button
              onClick={isRecording ? stopRecording : startRecording}
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
          
          <p className="mt-5 font-medium text-gray-600 text-center h-6">
            {isRecording 
              ? <span className="text-red-500 animate-pulse font-bold">Merekam suara kucing...</span> 
              : "Ketuk Mic untuk Mulai"}
          </p>
        </div>

        {/* Audio Preview */}
        {mediaBlobUrl && !isRecording && (
          <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-200 animate-fade-in-up">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase">Preview Suara</span>
              <button onClick={() => { setInputType("record"); startRecording(); }} className="text-xs text-red-500 flex items-center hover:underline font-bold">
                <RotateCcw className="mr-1" size={12} /> Rekam Ulang
              </button>
            </div>
            <audio src={mediaBlobUrl} controls className="w-full h-8" />
          </div>
        )}

        {/* --- TOMBOL AKSI TERJEMAHKAN --- */}
        <button
          onClick={handleTranslate}
          disabled={loading || (!isRecording && !mediaBlobUrl && !file)}
          className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg mb-8 transition-all transform ${
            loading || (!isRecording && !mediaBlobUrl && !file)
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-xl hover:-translate-y-1 active:scale-95 active:translate-y-0"
          }`}
        >
          {loading ? "Sedang Menganalisis..." : "Terjemahkan Sekarang 🐾"}
        </button>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-center text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Divider Upload */}
        <div className="relative flex py-2 items-center mb-4">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink-0 mx-4 text-gray-300 text-[10px] uppercase tracking-widest">Opsi Lain</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* --- AREA SEKUNDER: UPLOAD FILE --- */}
        <div className="text-center">
          <label className="cursor-pointer inline-flex items-center justify-center w-full py-3 px-4 rounded-xl text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 transition-all border border-dashed border-indigo-200 hover:border-indigo-400">
            <Upload className="text-lg mr-2" size={18}/>
            <span className="text-sm font-medium">{file ? `File: ${file.name}` : "Upload file .wav manual"}</span>
            <input 
              type="file" 
              accept=".wav" 
              onChange={handleFileChange} 
              className="hidden" 
            />
          </label>
        </div>

        {/* Hasil Prediksi (Overlay Card) */}
        {prediction && (
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
                  onClick={() => setPrediction(null)}
                  className="mt-10 w-full py-3 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-gray-800 transition-colors shadow-lg"
                >
                  Kembali
                </button>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;