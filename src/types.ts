export interface PredictionResponse {
  prediction: string;
  confidence: string;
  scores: Record<string, number>;
  error?: string;
}

export interface HistoryItem {
  id: string;
  date: string;
  prediction: string;
  confidence: string;
}