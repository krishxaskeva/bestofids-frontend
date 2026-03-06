/**
 * Client-side upload to Cloudinary using unsigned upload preset.
 * Requires REACT_APP_CLOUDINARY_CLOUD_NAME and REACT_APP_CLOUDINARY_UPLOAD_PRESET.
 * @param {File} file - File from input
 * @param {'image'|'video'|'raw'} resourceType - Cloudinary resource type (image, video, or raw for PDF/audio)
 * @returns {Promise<string>} secure_url from Cloudinary response
 */
export async function uploadToCloudinary(file, resourceType = 'image') {
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary is not configured. Set REACT_APP_CLOUDINARY_CLOUD_NAME and REACT_APP_CLOUDINARY_UPLOAD_PRESET.');
  }
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
    throw new Error(err.error?.message || `Upload failed: ${res.status}`);
  }
  const data = await res.json();
  if (!data.secure_url) {
    throw new Error('Upload did not return a URL');
  }
  return data.secure_url;
}
