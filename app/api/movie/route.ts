import { NextResponse } from "next/server";
import {
  getMovieByImdbId,
  getMovieDetails,
  getMovieCredits,
} from "@/lib/tmdb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const imdbId = searchParams.get("imdbId");

    if (!imdbId) {
      return NextResponse.json(
        { error: "IMDb ID is required" },
        { status: 400 }
      );
    }

    // 1️⃣ Convert IMDb → TMDB
    const movie = await getMovieByImdbId(imdbId);

    if (!movie) {
      return NextResponse.json(
        { error: "Movie not found" },
        { status: 404 }
      );
    }

    // 2️⃣ Get details + cast
    const details = await getMovieDetails(movie.id);
    const credits = await getMovieCredits(movie.id);

    return NextResponse.json({
      title: details.title,
      poster: `https://image.tmdb.org/t/p/w500${details.poster_path}`,
      releaseYear: details.release_date?.split("-")[0],
      rating: details.vote_average,
      plot: details.overview,
      cast: credits.cast.slice(0, 5).map((actor: any) => ({
        name: actor.name,
        character: actor.character,
      })),
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
