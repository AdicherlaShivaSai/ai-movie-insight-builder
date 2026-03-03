import { NextResponse } from "next/server";
import { analyzeReviews } from "@/lib/openai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const reviews = body.reviews;

    if (!reviews || !Array.isArray(reviews)) {
      return NextResponse.json(
        { error: "Reviews array is required" },
        { status: 400 },
      );
    }

    const aiResponse = await analyzeReviews(reviews);

    // 🧠 Parse AI response safely
    let parsedResult;

    try {
      // Remove possible markdown formatting
      const cleaned = aiResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      parsedResult = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 },
      );
    }

    return NextResponse.json(parsedResult);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "AI analysis failed" },
      { status: 500 },
    );
  }
}
