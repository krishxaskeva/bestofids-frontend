/**
 * Client-side upload to Cloudinary using unsigned upload preset.
 * Requires VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.
 * Cloud name can also be derived from VITE_ASSETS_BASE when it is a Cloudinary URL.
 * @param {File} file - File from input
 * @param {'image'|'video'|'raw'} resourceType - Cloudinary resource type (image, video, or raw for PDF/audio)
 * @returns {Promise<string>} secure_url from Cloudinary response
 */
function getCloudName() {
  const fromEnv = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  if (fromEnv && fromEnv.trim()) return fromEnv.trim();
  const assetsBase = import.meta.env.VITE_ASSETS_BASE || '';
  const match = assetsBase.match(/^https?:\/\/res\.cloudinary\.com\/([^/]+)/);
  return match ? match[1] : '';
}

export async function uploadToCloudinary(file, resourceType = 'image') {
  const cloudName = getCloudName();
  const uploadPreset = (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '').trim();
  if (!cloudName || !uploadPreset) {
    const missing = [!cloudName && 'VITE_CLOUDINARY_CLOUD_NAME (or set VITE_ASSETS_BASE to a Cloudinary URL)', !uploadPreset && 'VITE_CLOUDINARY_UPLOAD_PRESET'].filter(Boolean);
    throw new Error(
      `Cloudinary is not configured. Set ${missing.join(' and ')}. ` +
      'For upload preset: Cloudinary Dashboard → Settings → Upload → Add upload preset → set to Unsigned, then add its name to .env.'
    );
  }
  console.log('Uploading file to Cloudinary', { resourceType, name: file?.name });
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  const res = await fetch(url, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error('Cloudinary upload failed:', err.error?.message || res.status);
    throw new Error(err.error?.message || `Upload failed: ${res.status}`);
  }
  const data = await res.json();
  if (!data.secure_url) {
    console.error('Cloudinary upload failed: no URL in response');
    throw new Error('Upload did not return a URL');
  }
  console.log('Upload success:', data.secure_url);
  return data.secure_url;
}

/**
 * Upload with progress callback (0-100 per file). Uses XMLHttpRequest for progress events.
 * @param {File} file
 * @param {'image'|'video'|'raw'} resourceType
 * @param {(percent: number) => void} onProgress - 0 to 100
 * @returns {Promise<string>} secure_url
 */
export function uploadToCloudinaryWithProgress(file, resourceType = 'image', onProgress) {
  const cloudName = getCloudName();
  const uploadPreset = (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '').trim();
  if (!cloudName || !uploadPreset) {
    const missing = [!cloudName && 'VITE_CLOUDINARY_CLOUD_NAME', !uploadPreset && 'VITE_CLOUDINARY_UPLOAD_PRESET'].filter(Boolean);
    return Promise.reject(new Error(`Cloudinary not configured. Set ${missing.join(' and ')}.`));
  }
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && typeof onProgress === 'function') {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(Math.min(percent, 100));
      }
    });
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          if (data.secure_url) {
            if (typeof onProgress === 'function') onProgress(100);
            console.log('Cloudinary upload success:', data.secure_url);
            resolve(data.secure_url);
          } else reject(new Error('Upload did not return a URL'));
        } catch (err) {
          console.error('Cloudinary upload error: invalid response');
          reject(new Error('Invalid response'));
        }
      } else {
        try {
          const err = JSON.parse(xhr.responseText);
          console.error('Cloudinary upload failed:', err.error?.message || xhr.status);
          reject(new Error(err.error?.message || `Upload failed: ${xhr.status}`));
        } catch {
          reject(new Error(`Upload failed: ${xhr.status}`));
        }
      }
    });
    xhr.addEventListener('error', () => {
      console.error('Cloudinary upload error: network error');
      reject(new Error('Network error'));
    });
    xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));
    xhr.open('POST', url);
    xhr.send(formData);
  });
}
