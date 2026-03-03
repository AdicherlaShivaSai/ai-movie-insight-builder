# 🎬 AI Movie Insight Builder

Live Demo: https://ai-movie-insight-builder-nu.vercel.app/

## 📌 Overview

AI Movie Insight Builder is a full-stack web application that allows users to enter an IMDb movie ID and retrieve:

- Movie title and poster
- Release year and rating
- Cast list
- Plot summary
- AI-generated audience sentiment summary
- Overall sentiment classification (Positive / Mixed / Negative)

The application integrates real movie metadata and audience reviews with AI-powered analysis to provide meaningful insights.

---

## 🛠 Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (for animations)

### Backend
- Next.js API Routes (Node.js runtime)
- TMDB API (Movie data + Reviews)
- Groq LLM API (AI sentiment analysis)

---

## 🧠 Tech Stack Rationale

- **Next.js**: Enables full-stack development with built-in API routes and easy deployment.
- **TypeScript**: Ensures type safety and reduces runtime errors.
- **TMDB API**: Reliable and well-documented movie metadata provider.
- **Groq LLM API**: Cost-efficient AI model for summarization and sentiment classification.
- **Tailwind CSS**: Rapid UI development with responsive design support.

---

## 🗂 Project Structure
```
src/
 ├── app/
 │    ├── page.tsx                → Main UI & state management
 │    ├── api/
 │    │    ├── movie/route.ts     → Fetch movie details from TMDB
 │    │    ├── reviews/route.ts   → Fetch audience reviews
 │    │    └── analyze/route.ts   → AI summary & sentiment classification
 │
 ├── components/
 │    ├── MovieCard.tsx           → Movie details UI component
 │    ├── SentimentCard.tsx       → AI sentiment display
 │    └── Loader.tsx              → Loading indicator
 │
 ├── lib/
 │    ├── tmdb.ts                 → TMDB API integration
 │    └── openai.ts               → Groq AI integration
 │
 ├── types/
 │    ├── movie.ts                → Movie-related TypeScript interfaces
 │    └── ai.ts                   → AI response types
```

### Structure Rationale
- **Separation of Concerns**: API logic, UI components, and types are modularized.
- **Scalability**: Components and types are reusable for future feature expansion.
- **Maintainability**: Centralized types reduce duplication and runtime errors.
- **Security**: AI and third-party API calls handled server-side only.
---

## ⚙️ Setup Instructions

1. Clone the repository
2. Install dependencies

```bash
npm install
```
3. Create `.env.local` file:

```
TMDB_API_KEY=your_tmdb_api_key
GROQ_API_KEY=your_groq_api_key
```
4. Run development server:
```
npm run dev
```
5. Visit http://localhost:3000
---

## 🧩 Architecture Overview
- Frontend → Next.js Client Components
- Backend → Next.js API Routes

Flow:

- User Input → `/api/movie` → TMDB
- User Input → `/api/reviews` → TMDB
- Reviews → `/api/analyze` → Groq AI
- AI Response → Parsed & Returned → UI
---

## 🔒 Security Considerations
- API keys stored in environment variables
- AI calls handled server-side
- Input validation implemented for IMDb ID format
- Defensive JSON parsing for AI responses

---

## 📝 Assumptions
- IMDb ID follows format: tt + 7–8 digits
- TMDB has matching records for given IMDb ID
- Limited to top 5 reviews for cost efficiency
- AI output constrained to structured JSON format

---
## 🚀 Future Improvements
- Caching movie results for performance optimization
- Adding loading skeletons
- Unit testing with Jest
- Adding streaming AI responses
- Supporting multiple AI providers

