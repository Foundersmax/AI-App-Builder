
# Lumina Site Builder Deployment Guide

## 1. MongoDB Atlas (Database)
- Create a free cluster at [mongodb.com](https://www.mongodb.com/cloud/atlas).
- Get your connection string (e.g., `mongodb+srv://user:pass@cluster...`).
- Allow IP `0.0.0.0/0` in Network Access for Render.

## 2. Render (Backend)
- Connect your GitHub repo.
- Select `Node` as runtime.
- Build command: `npm install` (if you have a package.json) or just ensure `server.js` exists.
- Environment Variables:
  - `API_KEY`: Your Gemini 3 Pro Key.
  - `MONGODB_URI`: Your Atlas string.
  - `PORT`: 5000

## 3. Vercel (Frontend)
- Connect repo.
- Framework: Create React App (or Vite).
- Add a `vercel.json` if you need to proxy `/api` to your Render URL:
```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://your-render-url.onrender.com/api/:path*" }
  ]
}
```
