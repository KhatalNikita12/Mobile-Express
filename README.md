# Mobile Xpress

React (Create React App) frontend + Express API running as a **Netlify serverless function**, with Supabase for data and image storage.

## Structure

- `src/` – React app
- `app.js` – the Express app (shared by local dev and Netlify)
- `netlify/functions/api.js` – wraps `app.js` with `serverless-http` -> the serverless function
- `server.js` – local development only (`node server.js`)
- `product.js`, `services.js`, `categories.js`, `brands.js`, `offers.js`, `aboutGallery.js`, `auth.js` – API routes
- `netlify.toml` – build settings + `/api/*` redirect to the function

## Deploy on Netlify

1. Push this folder to GitHub/GitLab and import it in Netlify (build settings come from `netlify.toml`).
2. Add these under **Site configuration > Environment variables**:
   - `SUPABASE_URL`
   - `SUPABASE_SECRET_KEY`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
3. Do **not** set `REACT_APP_API_URL` – the app calls `/api` by default, which Netlify redirects to the function.
4. Deploy, then open `https://YOUR-SITE.netlify.app/api/health` – it should return `{"status":"ok", ...}` with both Supabase flags `true`.

Notes:
- Images are uploaded to the Supabase Storage bucket `product-images` (must exist and be public).
- Netlify functions accept request bodies up to ~6 MB, so keep uploaded product photos small (a few images under ~1 MB each).

## Local development

```bash
cp .env.example .env     # fill in the values
npm install
npm start                # API on :5000 + React on :3000 (CRA proxies to the API)
```
