import React, { useState } from 'react';
import { Form, Upload, Button, message } from 'antd';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import { uploadToCloudinary } from '../../utils/cloudinaryUpload';

/**
 * Uploads file to Cloudinary and sets form field to secure_url.
 * resourceType: 'image' | 'video' | 'raw'
 */
export function CloudinaryUploadField({ name, label, form, resourceType = 'image', accept, placeholder, required }) {
  const [uploading, setUploading] = useState(false);
  const value = Form.useWatch(name, form);

  const handleFile = async (file) => {
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, resourceType);
      form.setFieldValue(name, url);
      message.success('Uploaded');
    } catch (err) {
      message.error(err?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form.Item
      name={name}
      label={label}
      rules={required ? [{ required: true, message: `Please upload ${label.toLowerCase()}` }] : []}
    >
      <div>
        {value && (
          <div style={{ marginBottom: 8 }}>
            {resourceType === 'image' && (
              <img src={value} alt="" style={{ maxWidth: 120, maxHeight: 80, objectFit: 'contain', border: '1px solid #d9d9d9', borderRadius: 4 }} />
            )}
            {resourceType !== 'image' && (
              <a href={value} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12 }}>Uploaded file</a>
            )}
          </div>
        )}
        <Upload
          accept={accept}
          showUploadList={false}
          beforeUpload={(f) => {
            handleFile(f);
            return false;
          }}
        >
          <Button icon={uploading ? <LoadingOutlined /> : <UploadOutlined />} loading={uploading}>
            {placeholder || `Upload ${label}`}
          </Button>
        </Upload>
      </div>
    </Form.Item>
  );
}
