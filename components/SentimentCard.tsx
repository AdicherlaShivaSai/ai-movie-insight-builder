"use client";

import { AIResult } from "@/types/ai";

interface Props {
  result: AIResult;
}

export default function SentimentCard({ result }: Props) {
  const getSentimentColor = () => {
    if (result.sentiment === "Positive") return "bg-green-600";
    if (result.sentiment === "Mixed") return "bg-yellow-600";
    return "bg-red-600";
  };

  return (
    <div className="bg-gray-800 p-6 rounded mt-6">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-xl font-semibold">Audience Sentiment:</h3>
        <span
          className={`px-3 py-1 rounded text-sm ${getSentimentColor()}`}
        >
          {result.sentiment}
        </span>
      </div>

      <p className="text-gray-300 leading-relaxed">
        {result.summary}
      </p>
    </div>
  );
}