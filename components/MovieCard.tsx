"use client";

import { motion } from "framer-motion";
import { MovieData } from "@/types/movie";

interface Props {
  movie: MovieData;
}

export default function MovieCard({ movie }: Props) {
  return (
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
  );
}