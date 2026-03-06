import React, { useState, useCallback } from 'react';
import { Drawer, Form, Button, message } from 'antd';
import PatientCareForm from '../../components/patientCare/PatientCareForm';

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

export default function CreatePatientCare({ open, onClose, onSuccess }) {
  const [form] = Form.useForm();
  const [thumbnailFileList, setThumbnailFileList] = useState([]);
  const [thumbnailDataUrl, setThumbnailDataUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleThumbnailChange = useCallback(({ fileList }) => {
    setThumbnailFileList(fileList.slice(-1));
    if (fileList.length && fileList[0].originFileObj) {
      getBase64(fileList[0].originFileObj).then(setThumbnailDataUrl);
    } else {
      setThumbnailDataUrl('');
    }
  }, []);

  const handleSubmit = useCallback(() => {
    form.validateFields().then((values) => {
      setSubmitting(true);
      const payload = {
        ...values,
        thumbnailUrl: thumbnailDataUrl || undefined,
        status: 'published',
        publishDate: new Date().toISOString().slice(0, 10),
        createdAt: new Date().toISOString().slice(0, 10),
        showInWebsite: values.showInWebsite !== false,
      };
      Promise.resolve(onSuccess(payload))
        .then(() => {
          form.resetFields();
          setThumbnailFileList([]);
          setThumbnailDataUrl('');
          message.success('Post published.');
          onClose();
        })
        .catch((err) => {
          message.error(err?.message || 'Failed to create');
        })
        .finally(() => setSubmitting(false));
    }).catch(() => {});
  }, [form, thumbnailDataUrl, onSuccess, onClose]);

  const handleClose = useCallback(() => {
    form.resetFields();
    setThumbnailFileList([]);
    setThumbnailDataUrl('');
    onClose();
  }, [form, onClose]);

  return (
    <Drawer
      title="Create Patient Care Post"
      placement="right"
      width={520}
      open={open}
      onClose={handleClose}
      destroyOnClose
      getContainer={() => document.body}
      rootClassName="admin-education-drawer"
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button style={{ marginRight: 8 }} onClick={handleClose}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleSubmit} loading={submitting}>
            Publish Post
          </Button>
        </div>
      }
    >
      {open && (
        <PatientCareForm
          form={form}
          thumbnailFileList={thumbnailFileList}
          onThumbnailChange={handleThumbnailChange}
        />
      )}
    </Drawer>
  );
}
