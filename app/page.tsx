"use client";

import { useState } from "react";
import MovieCard from "@/components/MovieCard";
import SentimentCard from "@/components/SentimentCard";
import Loader from "@/components/Loader";
import { MovieData } from "@/types/movie";
import { AIResult } from "@/types/ai";


export default function Home() {
  const [imdbId, setImdbId] = useState("");
  const [movie, setMovie] = useState<MovieData | null>(null);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getSentimentColor = (sentiment: string) => {
    if (sentiment === "Positive") return "bg-green-600";
    if (sentiment === "Mixed") return "bg-yellow-600";
    return "bg-red-600";
  };

  const handleSearch = async () => {
    if (!imdbId) {
      setError("Please enter IMDb ID");
      return;
    }

    const imdbPattern = /^tt\d{7,8}$/;

    if (!imdbPattern.test(imdbId)) {
      setError("Invalid IMDb ID format (example: tt0133093)");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMovie(null);
      setAiResult(null);

      // Fetch movie details
      const movieRes = await fetch(`/api/movie?imdbId=${imdbId}`);
      const movieData = await movieRes.json();

      if (!movieRes.ok) throw new Error(movieData.error);

      setMovie(movieData);

      // Fetch reviews
      const reviewsRes = await fetch(`/api/reviews?imdbId=${imdbId}`);
      const reviewsData = await reviewsRes.json();

      if (!reviewsRes.ok) throw new Error(reviewsData.error);

      // Analyze reviews
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reviews: reviewsData.reviews }),
      });

      const analyzeData = await analyzeRes.json();

      if (!analyzeRes.ok) throw new Error(analyzeData.error);

      setAiResult(analyzeData);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">
          🎬 AI Movie Insight Builder
        </h1>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter IMDb ID (e.g., tt0133093)"
            value={imdbId}
            onChange={(e) => setImdbId(e.target.value)}
            className="flex-1 p-3 rounded bg-gray-800 border border-gray-700"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-600 px-4 py-3 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "Search"}
          </button>
        </div>

        {!movie && !loading && !error && (
          <div className="text-center text-gray-500 mt-10">
            Enter an IMDb ID to analyze movie insights.
          </div>
        )}

        {loading && <Loader />}

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-300 p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}

        {movie && <MovieCard movie={movie} />}

        {aiResult && <SentimentCard result={aiResult} />}
      </div>
    </main>
  );
}
