import { useState, useEffect, useRef } from 'react';

export const useAudioRecorder = (maxRecordingTime: number) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaBlobUrl, setMediaBlobUrl] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(maxRecordingTime / 1000);
  const [recordingError, setRecordingError] = useState<string>("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      setMediaBlobUrl(null);
      setRecordingError("");
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        } 
      });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setMediaBlobUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Gagal akses mikrofon:", err);
      setRecordingError("Gagal mengakses mikrofon. Izinkan akses di browser.");
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

  // Efek untuk Auto Stop & Hitung Mundur
  useEffect(() => {
    let timer: number;
    let countdownInterval: number;

    if (isRecording) {
      setTimeLeft(maxRecordingTime / 1000);
      timer = setTimeout(() => stopRecording(), maxRecordingTime);
      countdownInterval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
    };
  }, [isRecording, maxRecordingTime]);

  return {
    isRecording,
    mediaBlobUrl,
    timeLeft,
    recordingError,
    startRecording,
    stopRecording,
    clearBlobUrl
  };
};