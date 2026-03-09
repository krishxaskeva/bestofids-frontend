import React, { useEffect, useState } from 'react';
import { Form, Upload, Button } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';

/**
 * Stores file in local state only (no Cloudinary upload). Parent keeps temp files in state until Publish.
 * Shows preview for image/video; shows file name for others.
 * value: File | string (existing URL when editing) — controlled by parent via form or mediaFiles state.
 * onChange(file | null): when user selects file or removes it.
 */
export function LocalFileUploadField({
  name,
  label,
  form,
  resourceType = 'image',
  accept,
  placeholder,
  required,
  value,        // File object or string URL (edit mode)
  onChange,     // (file: File | null) => void — when using controlled mediaFiles state
  disabled,
}) {
  const isControlled = onChange != null;
  const displayValue = value;
  const isUrl = typeof displayValue === 'string' && displayValue.startsWith('http');
  const isFile = displayValue instanceof File;

  const [objectUrl, setObjectUrl] = useState(null);
  useEffect(() => {
    if (isFile && displayValue) {
      const url = URL.createObjectURL(displayValue);
      setObjectUrl(url);
      return () => {
        URL.revokeObjectURL(url);
        setObjectUrl(null);
      };
    }
    setObjectUrl(null);
  }, [isFile, displayValue]);

  const previewSrc = isFile && objectUrl ? objectUrl : isUrl ? displayValue : null;

  const handleFile = (file) => {
    if (isControlled) {
      onChange(file);
    } else {
      form?.setFieldValue(name, file);
    }
  };

  const handleRemove = () => {
    if (isControlled) {
      onChange(null);
    } else {
      form?.setFieldValue(name, null);
    }
  };

  return (
    <Form.Item
      name={isControlled ? undefined : name}
      label={label}
      rules={!isControlled && required ? [{ required: true, message: `Please upload ${label.toLowerCase()}` }] : []}
      validateTrigger={['onSubmit']}
    >
      <div>
        {(isFile || isUrl) && (
          <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {resourceType === 'image' && previewSrc && (
              <img
                src={previewSrc}
                alt=""
                style={{ maxWidth: 120, maxHeight: 80, objectFit: 'contain', border: '1px solid #d9d9d9', borderRadius: 4 }}
              />
            )}
            {resourceType === 'video' && previewSrc && (
              <video
                src={previewSrc}
                controls
                style={{ maxWidth: 160, maxHeight: 90, border: '1px solid #d9d9d9', borderRadius: 4 }}
              />
            )}
            {resourceType !== 'image' && resourceType !== 'video' && (
              <span style={{ fontSize: 12 }}>{isFile ? displayValue.name : 'Uploaded file'}</span>
            )}
            {!disabled && (
              <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={handleRemove}>
                Remove
              </Button>
            )}
          </div>
        )}
        {(!displayValue || disabled) && (
          <Upload
            accept={accept}
            showUploadList={false}
            disabled={disabled}
            beforeUpload={(f) => {
              handleFile(f);
              return false;
            }}
          >
            <Button icon={<UploadOutlined />} disabled={disabled}>
              {placeholder || `Choose ${label}`}
            </Button>
          </Upload>
        )}
      </div>
    </Form.Item>
  );
}
