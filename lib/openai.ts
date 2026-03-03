const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function analyzeReviews(reviews: string[]) {
  const combinedReviews = reviews.join("\n\n");

  const prompt = `
You are a movie review analyst.

Based on the following audience reviews:

${combinedReviews}

1. Provide a short summary of overall audience sentiment (3-4 sentences).
2. Classify overall sentiment as one of: Positive, Mixed, Negative.

Respond strictly in this JSON format:
{
  "summary": "...",
  "sentiment": "Positive | Mixed | Negative"
}
`;

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a strict JSON generator. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Groq API failed");
  }

  if (!data.choices || data.choices.length === 0) {
    throw new Error("Invalid response from Groq");
  }

  return data.choices[0].message.content;
}
