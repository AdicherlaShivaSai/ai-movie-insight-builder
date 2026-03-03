export type Sentiment = "Positive" | "Mixed" | "Negative";

export interface AIResult {
  summary: string;
  sentiment: Sentiment;
}