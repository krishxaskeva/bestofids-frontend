# Deploy now — step-by-step

Your code is in two GitHub repos:
- **Frontend:** https://github.com/krishxaskeva/bestofids-frontend  
- **Backend:** https://github.com/krishxaskeva/bestofids-backend  

Deploy **backend first**, then **frontend**, then connect them with env vars.

---

## Step 1: Deploy backend on Render

1. Go to [render.com](https://render.com) and sign in (or sign up).
2. **New** → **Web Service**.
3. Connect **GitHub** and select the repo **`bestofids-backend`** (or `krishxaskeva/bestofids-backend`).
4. Settings:
   - **Name:** e.g. `bestofids-api`
   - **Root Directory:** leave blank (repo root is the backend).
   - **Runtime:** Node.
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js` or `npm start` (whatever your backend uses — check `backend/package.json` scripts).
   - **Instance type:** Free (or paid if you prefer).
5. Click **Advanced** → **Add Environment Variable**. Add every variable from your backend `.env` (or from `backend/.env.example`). At minimum:
   - `NODE_ENV` = `production`
   - `PORT` = `5000` (Render can override this; you can still set it)
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = a long random string (e.g. 32+ characters)
   - `JWT_EXPIRE` = `30d`
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` = your Cloudinary values
   - `FRONTEND_URL` = leave as `http://localhost:3000` for now (you’ll set the real Vercel URL in Step 4)
   - `ADMIN_URL` = leave as `http://localhost:3000/admin` for now
6. Click **Create Web Service**. Wait for the first deploy to finish.
7. Copy your backend URL, e.g. **`https://bestofids-api.onrender.com`** (no `/api` at the end). You’ll need it for the frontend.

---

## Step 2: Deploy frontend on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (or sign up with GitHub).
2. **Add New** → **Project**.
3. Import the repo **`bestofids-frontend`** (or `krishxaskeva/bestofids-frontend`).
4. Settings (Vercel often detects them automatically):
   - **Framework Preset:** Vite
   - **Root Directory:** leave blank (repo root is the frontend).
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. **Deploy** (you can add env vars in the next step and redeploy).
6. When the deploy finishes, copy your frontend URL, e.g. **`https://bestofids-frontend.vercel.app`**.

---

## Step 3: Connect frontend to backend (Vercel env vars)

1. In **Vercel**, open your project → **Settings** → **Environment Variables**.
2. Add these for **Production** (and **Preview** if you use branch deploys):

   | Name | Value |
   |------|--------|
   | `VITE_API_URL` | `https://YOUR-RENDER-URL.onrender.com/api` (e.g. `https://bestofids-api.onrender.com/api`) |
   | `VITE_BACKEND_URL` | `https://YOUR-RENDER-URL.onrender.com` (same URL **without** `/api`) |
   | `VITE_ASSETS_BASE` | `https://res.cloudinary.com/dgifgbzdl/image/upload/bestofids/public` (or your Cloudinary base — so images/logos load) |
   | `VITE_CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name (e.g. `dgifgbzdl`) |
   | `VITE_CLOUDINARY_UPLOAD_PRESET` | `bestofids_unsigned` |
   | `VITE_SITE_NAME` | `Best of IDS` |
   | `VITE_ADMIN_PATH` | `/admin` |

   Replace `YOUR-RENDER-URL` with the backend URL you copied in Step 1 (e.g. `bestofids-api.onrender.com`).

3. Save, then go to **Deployments** → open the **⋯** on the latest deployment → **Redeploy** so the new env vars are used.

---

## Step 4: Point backend to frontend (Render env vars)

1. In **Render**, open your backend service → **Environment**.
2. Set:
   - **FRONTEND_URL** = your Vercel frontend URL, e.g. `https://bestofids-frontend.vercel.app` (no trailing slash).
   - **ADMIN_URL** = same URL + `/admin`, e.g. `https://bestofids-frontend.vercel.app/admin`
3. Save. Render will redeploy the backend automatically so CORS and redirects work with your real frontend URL.

---

## Step 5: Check that everything works

1. Open your **Vercel URL** in the browser. You should see the app and images/logos (from Cloudinary if `VITE_ASSETS_BASE` is set, or from the `public` folder).
2. Log in, open a page that calls the API (e.g. blog, patient care). If something fails, check the browser **Network** tab and **Render logs** for errors.
3. If images still don’t show, confirm **VITE_ASSETS_BASE** is set in Vercel and **Redeploy** the frontend once.

---

## Quick reference

- **Frontend repo:** https://github.com/krishxaskeva/bestofids-frontend  
- **Backend repo:** https://github.com/krishxaskeva/bestofids-backend  
- **Full env list:** see `DEPLOYMENT.md` in the project root (or frontend `README.md` and backend `.env.example`).
