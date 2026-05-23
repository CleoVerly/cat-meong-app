export interface PredictionResponse {
  status?: string;
  is_cat?: boolean;
  prediction?: string;
  confidence?: string;
  scores?: Record<string, number>;
  message?: string;
  error?: string;
}

export interface HistoryItem {
  id: string;
  date: string;
  prediction: string;
  confidence: string;
}