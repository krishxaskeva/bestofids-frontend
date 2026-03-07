# Cloudinary uploads (courses, images, videos)

The app uses Cloudinary for client-side uploads. Configure in `.env`:

- **VITE_CLOUDINARY_CLOUD_NAME** – Your Cloudinary cloud name (e.g. `dgifgbzdl`).
- **VITE_CLOUDINARY_UPLOAD_PRESET** – Name of an **unsigned** upload preset (e.g. `bestofids_unsigned`).
- **VITE_ASSETS_BASE** – Optional. When set to your Cloudinary base URL, static assets (logos, icons, etc.) load from Cloudinary instead of the `public` folder. Example: `https://res.cloudinary.com/dgifgbzdl/image/upload/bestofids/public`

## Deploying to Vercel (Cloudinary images in production)

Vite replaces `VITE_*` variables **at build time**. If you don't set them in Vercel, the production build will not have your Cloudinary base URL and will fall back to the `public` folder (so Cloudinary images won't show).

**If images and logos don’t show on Vercel (but work locally):**

1. **Static files** – This repo includes a `vercel.json` that rewrites only non-asset paths to `index.html`, so `/images/*` and `/assets/*` are served from the build. Redeploy after pulling the latest code.
2. **Load from Cloudinary** – In Vercel → **Settings** → **Environment Variables**, set **VITE_ASSETS_BASE** to your Cloudinary base URL. Then **redeploy**. All `getAssetUrl()` URLs will then point to Cloudinary and work even if static file rewrites were wrong.

Steps for Cloudinary (optional but recommended for production):

1. In Vercel: open your project → **Settings** → **Environment Variables**.
2. Add these (for **Production**, and optionally **Preview**):
   - **VITE_ASSETS_BASE** = `https://res.cloudinary.com/dgifgbzdl/image/upload/bestofids/public`  
     (Use your own cloud name and folder if different.)
   - **VITE_CLOUDINARY_CLOUD_NAME** = your cloud name (e.g. `dgifgbzdl`)
   - **VITE_CLOUDINARY_UPLOAD_PRESET** = `bestofids_unsigned`
   - Plus any other `VITE_*` you use (e.g. `VITE_API_URL`, `VITE_BACKEND_URL` for your production API).
3. **Redeploy** the project (e.g. trigger a new deployment or push a commit) so the build runs with these variables.

After redeploy, `getAssetUrl()` will resolve to Cloudinary URLs in production and your Cloudinary images will show.

## Create an unsigned upload preset

1. Open [Cloudinary Console](https://console.cloudinary.com/) → **Settings** (gear) → **Upload** tab.
2. Under **Upload presets**, click **Add upload preset**.
3. Give it a name (e.g. `bestofids_unsigned`).
4. Set **Signing Mode** to **Unsigned**.
5. Save.
6. Copy the preset name into `.env`:  
   `VITE_CLOUDINARY_UPLOAD_PRESET=bestofids_unsigned`
7. Restart the dev server (`npm run dev`).

After that, course/media uploads should work.
