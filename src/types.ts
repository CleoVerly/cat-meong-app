export interface PredictionResponse {
  prediction: string;
  confidence: string;
  scores: Record<string, number>;
  error?: string;
}