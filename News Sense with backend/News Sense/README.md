# NewsSense AI: Personalized Industry Insight Generator

A frontend-only React app that aggregates real-time news from NewsAPI and delivers personalized insights, preferences, bookmarks, history, and dark mode without a custom backend.

## Features

- Simulated authentication with LocalStorage
- Top headlines, search, filters, category news and recommendations
- Bookmarks, viewing history, user settings and theme persistence
- Tailwind CSS responsive UI
- NewsAPI integration with environment-based API key
- Optional OpenAI summarization when `VITE_OPENAI_API_KEY` is provided

## Quick start

1. Copy `.env.example` to `.env`
2. Add your NewsAPI key: `VITE_NEWSAPI_KEY=your_api_key`
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run development server:
   ```bash
   npm run dev
   ```

## Project structure

- `src/` — React components, pages, context, and helpers
- `public/` — static assets
- `index.html` — app entry

## Environment variables

- `VITE_NEWSAPI_KEY` — required for news fetching
- `VITE_OPENAI_API_KEY` — optional for article summarization

## Notes

- All user data is stored in LocalStorage.
- The app is intentionally frontend-only: no backend server or database.
