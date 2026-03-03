const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const apiKey = process.env.TMDB_API_KEY;

// 1️⃣ Convert IMDb ID → TMDB Movie ID
export async function getMovieByImdbId(imdbId: string) {
  const response = await fetch(
    `${TMDB_BASE_URL}/find/${imdbId}?external_source=imdb_id&api_key=${apiKey}`
  );

  const data = await response.json();

  return data.movie_results[0]; // first match
}

// 2️⃣ Get Movie Details
export async function getMovieDetails(movieId: number) {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}?api_key=${apiKey}`
  );

  return response.json();
}

// 3️⃣ Get Movie Cast
export async function getMovieCredits(movieId: number) {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${apiKey}`
  );

  return response.json();
}

// 4️⃣ Get Movie Reviews
export async function getMovieReviews(movieId: number) {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}/reviews?api_key=${apiKey}`
  );

  return response.json();
}