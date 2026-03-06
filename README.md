# Cloudinary uploads (courses, images, videos)

The app uses Cloudinary for client-side uploads. Configure in `.env`:

- **REACT_APP_CLOUDINARY_CLOUD_NAME** – Your Cloudinary cloud name (already set to `dgifgbzdl` if you use the same account as the static assets).
- **REACT_APP_CLOUDINARY_UPLOAD_PRESET** – Name of an **unsigned** upload preset.

## Create an unsigned upload preset

1. Open [Cloudinary Console](https://console.cloudinary.com/) → **Settings** (gear) → **Upload** tab.
2. Under **Upload presets**, click **Add upload preset**.
3. Give it a name (e.g. `bestofids_unsigned`).
4. Set **Signing Mode** to **Unsigned**.
5. Save.
6. Copy the preset name into `.env`:  
   `REACT_APP_CLOUDINARY_UPLOAD_PRESET=bestofids_unsigned`
7. Restart the dev server (`npm start`).

After that, course/media uploads should work.
