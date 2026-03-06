import { useState, useCallback } from 'react';
import { uploadToCloudinaryWithProgress } from '../utils/cloudinaryUpload';

/**
 * Shared publish flow: validate → upload temp files with progress → call API → success/error.
 * Use for Education (Courses, Webinars, etc.) and Blog so content is only saved after Publish.
 *
 * @param {Object} options
 * @param {import('antd').FormInstance} options.form - Ant Design form instance
 * @param {() => Array<{ key: string, file: File, resourceType: 'image'|'video'|'raw' }>} options.getTempFiles - Return list of { key, file, resourceType } to upload (only File objects; skip existing URLs)
 * @param {(values: Object, urlMap: Record<string, string>) => Object} options.buildPayload - (form values, { contentLink: url, thumbnail: url, ... }) => API payload
 * @param {(payload: Object) => Promise<any>} options.submitApi - createEducation(payload) or createBlog(payload), etc.
 * @param {() => void} options.onSuccess - e.g. close drawer, refresh list
 * @param {(message: string) => void} options.onError - e.g. message.error
 * @param {boolean} [options.isEdit] - If true, submitApi is update (id, payload); getTempFiles can return empty for unchanged files
 * @param {string} [options.editId] - Required when isEdit true
 * @param {(id: string, payload: Object) => Promise<any>} [options.updateApi] - updateEducation(id, payload), etc.
 * @param {() => void} [options.validateTempFiles] - Optional. Throw if required temp files missing (e.g. check mediaFiles state).
 */
export function usePublishWithUpload({
  form,
  getTempFiles,
  buildPayload,
  submitApi,
  onSuccess,
  onError,
  isEdit = false,
  editId = null,
  updateApi = null,
  validateTempFiles = null,
}) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle | uploading | publishing | done | error
  const [errorMessage, setErrorMessage] = useState('');

  const handlePublish = useCallback(async () => {
    setErrorMessage('');
    try {
      const values = await form.validateFields();
      if (typeof validateTempFiles === 'function') validateTempFiles();
      const tempFiles = getTempFiles();
      const urlMap = {};

      if (tempFiles.length > 0) {
        setUploadStatus('uploading');
        const total = tempFiles.length;
        for (let i = 0; i < tempFiles.length; i++) {
          const { key, file, resourceType } = tempFiles[i];
          const fileIndex = i;
          const url = await uploadToCloudinaryWithProgress(
            file,
            resourceType || 'image',
            (percent) => {
              const overall = Math.round((fileIndex / total) * 100 + (percent / total));
              setUploadProgress(Math.min(overall, 100));
            }
          );
          urlMap[key] = url;
          setUploadProgress(Math.round(((fileIndex + 1) / total) * 100));
        }
      }

      setUploadStatus('publishing');
      setUploadProgress(100);

      const payload = buildPayload(values, urlMap);
      if (isEdit && editId && updateApi) {
        await updateApi(editId, payload);
      } else {
        await submitApi(payload);
      }
      setUploadStatus('done');
      onSuccess();
    } catch (err) {
      setUploadStatus('error');
      const msg = err?.message || 'Publish failed';
      setErrorMessage(msg);
      onError(msg);
    }
  }, [form, getTempFiles, buildPayload, submitApi, onSuccess, onError, isEdit, editId, updateApi, validateTempFiles]);

  const resetUploadState = useCallback(() => {
    setUploadProgress(0);
    setUploadStatus('idle');
    setErrorMessage('');
  }, []);

  return {
    handlePublish,
    uploadProgress,
    uploadStatus,
    errorMessage,
    resetUploadState,
    isUploading: uploadStatus === 'uploading' || uploadStatus === 'publishing',
  };
}
