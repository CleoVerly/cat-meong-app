// src/hooks/useHistory.ts
import { useState, useEffect } from 'react';
import type { HistoryItem } from '../types';

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Ambil riwayat dari local storage saat aplikasi dimuat
  useEffect(() => {
    const savedHistory = localStorage.getItem('meow_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Gagal membaca riwayat dari cache", e);
      }
    }
  }, []);

  // Tambah riwayat baru
  const addHistoryItem = (item: Omit<HistoryItem, 'id' | 'date'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: Date.now().toString(), // Gunakan timestamp sebagai ID unik
      date: new Date().toISOString()
    };
    
    setHistory(prev => {
      const updatedHistory = [newItem, ...prev]; // Yang terbaru di atas
      localStorage.setItem('meow_history', JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  };

  // Hapus item spesifik berdasarkan ID
  const deleteHistoryItems = (ids: string[]) => {
    setHistory(prev => {
      const updatedHistory = prev.filter(item => !ids.includes(item.id));
      localStorage.setItem('meow_history', JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  };

  // Bersihkan semua riwayat
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('meow_history');
  };

  return { history, addHistoryItem, deleteHistoryItems, clearHistory };
}