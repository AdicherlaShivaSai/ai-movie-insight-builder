import { NextResponse } from "next/server";
import {
  getMovieByImdbId,
  getMovieReviews,
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

    // Convert IMDb → TMDB
    const movie = await getMovieByImdbId(imdbId);

    if (!movie) {
      return NextResponse.json(
        { error: "Movie not found" },
        { status: 404 }
      );
    }

    // Fetch reviews
    const reviewsData = await getMovieReviews(movie.id);

    // Extract only review content
    const reviews = reviewsData.results
      .slice(0, 5) // limit to 5 reviews
      .map((review: any) => review.content);

    return NextResponse.json({ reviews });

  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}