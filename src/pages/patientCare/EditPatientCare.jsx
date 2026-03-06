import React, { useState, useCallback, useEffect } from 'react';
import { Drawer, Form, Button, message } from 'antd';
import PatientCareForm from '../../components/patientCare/PatientCareForm';

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

export default function EditPatientCare({ post, open, onClose, onSuccess }) {
  const [form] = Form.useForm();
  const [thumbnailFileList, setThumbnailFileList] = useState([]);
  const [thumbnailDataUrl, setThumbnailDataUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !post) return;
    form.setFieldsValue({
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      category: post.category,
      showInWebsite: post.showInWebsite !== false,
    });
    setThumbnailDataUrl(post.thumbnailUrl || '');
    setThumbnailFileList(
      post.thumbnailUrl
        ? [{ uid: '-1', name: 'thumb', status: 'done', url: post.thumbnailUrl }]
        : []
    );
  }, [open, post, form]);

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
        thumbnailUrl: thumbnailDataUrl || post.thumbnailUrl || undefined,
        showInWebsite: values.showInWebsite !== false,
        publishDate: post.publishDate || undefined,
        status: post.status || 'draft',
      };
      Promise.resolve(onSuccess(post.id, payload))
        .then(() => {
          message.success('Post updated.');
          onClose();
        })
        .catch((err) => {
          message.error(err?.message || 'Update failed');
        })
        .finally(() => setSubmitting(false));
    }).catch(() => {});
  }, [form, thumbnailDataUrl, post, onSuccess, onClose]);

  const handleClose = useCallback(() => {
    form.resetFields();
    setThumbnailFileList([]);
    setThumbnailDataUrl('');
    onClose();
  }, [form, onClose]);

  if (!post) return null;

  return (
    <Drawer
      title="Edit Patient Care Post"
      placement="right"
      width={520}
      open={open}
      onClose={handleClose}
      destroyOnClose
      extra={
        <Button type="primary" onClick={handleSubmit} loading={submitting}>
          Save Changes
        </Button>
      }
    >
      <PatientCareForm
        form={form}
        thumbnailFileList={thumbnailFileList}
        onThumbnailChange={handleThumbnailChange}
      />
    </Drawer>
  );
}
