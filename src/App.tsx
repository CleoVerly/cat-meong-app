import { useState, useEffect } from 'react';
import axios from 'axios';
import type { PredictionResponse } from './types';
import TranslatorView from './views/TranslatorView';
import { useAudioRecorder } from './hooks/useAudioRecorder';
import { useHistory } from './hooks/useHistory';

const API_URL = import.meta.env.VITE_API_URL;
const MAX_RECORDING_TIME = 4000; 

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>("");
  const [inputType, setInputType] = useState<"record" | "upload">("record");
  
  const { 
    isRecording, 
    mediaBlobUrl, 
    timeLeft, 
    recordingError, 
    startRecording, 
    stopRecording, 
    clearBlobUrl 
  } = useAudioRecorder(MAX_RECORDING_TIME);

  // Panggil   useHistory
  const { history, addHistoryItem, deleteHistoryItems, clearHistory } = useHistory();

  useEffect(() => {
    setPrediction(null);
    setApiError("");
  }, [file, mediaBlobUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setInputType("upload");
      clearBlobUrl();
    }
  };

  const handleRetake = () => {
    setInputType("record");
    startRecording();
  };

  const handleTranslate = async () => {
    setLoading(true);
    setApiError("");
    setPrediction(null);
    const formData = new FormData();

    try {
      if (inputType === "record" && mediaBlobUrl) {
        const audioBlob = await fetch(mediaBlobUrl).then((r) => r.blob());
        formData.append("file", audioBlob, "recording.wav");
      } else if (inputType === "upload" && file) {
        formData.append("file", file);
      } else {
        setApiError("Rekam suara atau upload file terlebih dahulu!");
        setLoading(false);
        return;
      }

      const response = await axios.post<PredictionResponse>(`${API_URL}/predict`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.error) throw new Error(response.data.error);
      
      setPrediction(response.data);
      
      // Simpan Ke Riwayat jika sukses
      addHistoryItem({
        prediction: response.data.prediction,
        confidence: response.data.confidence,
      });

    } catch (err: any) {
      setApiError(err.response?.data?.detail || err.message || "Gagal memproses suara. Pastikan server aktif.");
    } finally {
      setLoading(false);
    }
  };

  const displayError = recordingError || apiError;

  return (
    <TranslatorView
      isRecording={isRecording}
      timeLeft={timeLeft}
      mediaBlobUrl={mediaBlobUrl}
      file={file}
      loading={loading}
      displayError={displayError}
      prediction={prediction}
      
      // Props History Baru
      history={history}
      onDeleteHistory={deleteHistoryItems}
      onClearHistory={clearHistory}
      
      onToggleRecord={isRecording ? stopRecording : startRecording}
      onRetake={handleRetake}
      onTranslate={handleTranslate}
      onFileChange={handleFileChange}
      onClosePrediction={() => setPrediction(null)}
    />
  );
}

export default App;