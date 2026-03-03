"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface MovieData {
  title: string;
  poster: string;
  releaseYear: string;
  rating: number;
  plot: string;
  cast: {
    name: string;
    character: string;
  }[];
}

interface AIResult {
  summary: string;
  sentiment: "Positive" | "Mixed" | "Negative";
}

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

      // 1️⃣ Fetch movie details
      const movieRes = await fetch(`/api/movie?imdbId=${imdbId}`);
      const movieData = await movieRes.json();

      if (!movieRes.ok) throw new Error(movieData.error);

      setMovie(movieData);

      // 2️⃣ Fetch reviews
      const reviewsRes = await fetch(`/api/reviews?imdbId=${imdbId}`);
      const reviewsData = await reviewsRes.json();

      if (!reviewsRes.ok) throw new Error(reviewsData.error);

      // 3️⃣ Analyze reviews
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

        {loading && (
          <div className="text-center py-6 animate-pulse">
            <p className="text-gray-400">Analyzing movie with AI...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-300 p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}

        {movie && (
          <motion.div
            key={movie.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-gray-800 p-6 rounded mb-6"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-40 rounded"
              />
              <div>
                <h2 className="text-2xl font-semibold">{movie.title}</h2>
                <p>Year: {movie.releaseYear}</p>
                <p>Rating: ⭐ {movie.rating}</p>
                <p className="mt-3 text-gray-300">{movie.plot}</p>

                <div className="mt-4">
                  <h3 className="font-semibold">Top Cast:</h3>
                  <ul className="text-gray-300">
                    {movie.cast.map((actor, index) => (
                      <li key={index}>
                        {actor.name} as {actor.character}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {aiResult && (
          <div className="bg-gray-800 p-6 rounded mt-6">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-xl font-semibold">Audience Sentiment:</h3>
              <span
                className={`px-3 py-1 rounded text-sm ${
                  aiResult.sentiment === "Positive"
                    ? "bg-green-600"
                    : aiResult.sentiment === "Mixed"
                      ? "bg-yellow-600"
                      : "bg-red-600"
                }`}
              >
                {aiResult.sentiment}
              </span>
            </div>

            <p className="text-gray-300 leading-relaxed">{aiResult.summary}</p>
          </div>
        )}
      </div>
    </main>
  );
}
