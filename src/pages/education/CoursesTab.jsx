import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, Modal, Drawer, Form, Input, message, Skeleton, Row, Col, Progress, Alert } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getEducationList, createEducation, updateEducation, deleteEducation } from '../../services/educationService';
import { LocalFileUploadField } from '../../components/educationHub/LocalFileUploadField';
import { usePublishWithUpload } from '../../hooks/usePublishWithUpload';

const { TextArea } = Input;
const CATEGORY = 'course';

const initialMediaFiles = () => ({ contentLink: null, thumbnail: null });

export default function CoursesTab() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [mediaFiles, setMediaFiles] = useState(initialMediaFiles);
  const [form] = Form.useForm();

  const load = () => {
    setLoading(true);
    getEducationList({ category: CATEGORY })
      .then(setData)
      .catch(() => message.error('Failed to load'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleAdd = () => {
    setEditingId(null);
    setMediaFiles(initialMediaFiles());
    form.resetFields();
    setDrawerOpen(true);
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    setMediaFiles({
      contentLink: record.contentLink || null,
      thumbnail: record.thumbnail || null,
    });
    form.setFieldsValue({
      title: record.title,
      description: record.description,
      duration: record.duration,
    });
    setDrawerOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete course?',
      okType: 'danger',
      onOk: () =>
        deleteEducation(id)
          .then(() => {
            setData((prev) => prev.filter((r) => r.id !== id));
            message.success('Deleted.');
          })
          .catch((err) => message.error(err.message)),
    });
  };

  const getTempFiles = useCallback(() => {
    const list = [];
    if (mediaFiles.contentLink instanceof File) {
      list.push({ key: 'contentLink', file: mediaFiles.contentLink, resourceType: 'video' });
    }
    if (mediaFiles.thumbnail instanceof File) {
      list.push({ key: 'thumbnail', file: mediaFiles.thumbnail, resourceType: 'image' });
    }
    return list;
  }, [mediaFiles]);

  const validateTempFiles = useCallback(() => {
    if (editingId) return;
    if (!(mediaFiles.contentLink instanceof File) && !mediaFiles.contentLink) {
      throw new Error('Please upload course video');
    }
    if (!(mediaFiles.thumbnail instanceof File) && !mediaFiles.thumbnail) {
      throw new Error('Please upload thumbnail');
    }
  }, [editingId, mediaFiles]);

  const buildPayload = useCallback(
    (values, urlMap) => ({
      ...values,
      category: CATEGORY,
      contentLink: urlMap.contentLink ?? (typeof mediaFiles.contentLink === 'string' ? mediaFiles.contentLink : undefined),
      thumbnail: urlMap.thumbnail ?? (typeof mediaFiles.thumbnail === 'string' ? mediaFiles.thumbnail : undefined),
    }),
    [mediaFiles]
  );

  const { handlePublish, uploadProgress, uploadStatus, errorMessage, resetUploadState, isUploading } = usePublishWithUpload({
    form,
    getTempFiles,
    buildPayload,
    validateTempFiles,
    submitApi: createEducation,
    updateApi: updateEducation,
    isEdit: !!editingId,
    editId: editingId,
    onSuccess: () => {
      message.success(editingId ? 'Updated.' : 'Created.');
      setDrawerOpen(false);
      setMediaFiles(initialMediaFiles());
      form.resetFields();
      resetUploadState();
      load();
    },
    onError: (msg) => message.error(msg),
  });

  const handleCancel = () => {
    setDrawerOpen(false);
    setMediaFiles(initialMediaFiles());
    form.resetFields();
    resetUploadState();
  };

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Duration', dataIndex: 'duration', key: 'duration', width: 120 },
    { title: 'Description', dataIndex: 'description', key: 'description', ellipsis: true },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  const publishFooter = (
    <Space direction="vertical" style={{ width: '100%' }} size="small">
      {errorMessage && <Alert type="error" message={errorMessage} showIcon />}
      {isUploading && (
        <>
          <Progress percent={uploadProgress} size="small" status="active" />
          <span style={{ fontSize: 12, color: '#666' }}>
            {uploadStatus === 'uploading' ? `Uploading media... ${uploadProgress}%` : 'Upload complete. Publishing course...'}
          </span>
        </>
      )}
      <Space style={{ justifyContent: 'flex-end', width: '100%' }}>
        <Button onClick={handleCancel} disabled={isUploading}>
          Cancel
        </Button>
        <Button type="primary" onClick={handlePublish} loading={isUploading}>
          Publish
        </Button>
      </Space>
    </Space>
  );

  return (
    <>
      <Space style={{ marginBottom: 16, justifyContent: 'flex-end', width: '100%' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Create course
        </Button>
      </Space>
      {loading ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : (
        <Table dataSource={data} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
      )}
      <Drawer
        title={editingId ? 'Edit course' : 'Create course'}
        placement="right"
        open={drawerOpen}
        onClose={handleCancel}
        width={560}
        getContainer={() => document.body}
        rootClassName="admin-education-drawer"
        destroyOnClose
        footer={publishFooter}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input placeholder="Course title" />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <TextArea rows={3} placeholder="Course description" />
          </Form.Item>
          <Form.Item label="Media" style={{ marginBottom: 0 }}>
            <div style={{ border: '1px solid #d9d9d9', borderRadius: 8, padding: 16, background: '#fafafa' }}>
              <Row gutter={16}>
                <Col span={12}>
                  <LocalFileUploadField
                    form={form}
                    name="contentLink"
                    label="Course video"
                    resourceType="video"
                    accept="video/mp4,.mp4"
                    placeholder="Upload MP4"
                    required
                    value={mediaFiles.contentLink}
                    onChange={(file) => setMediaFiles((prev) => ({ ...prev, contentLink: file }))}
                    disabled={isUploading}
                  />
                </Col>
                <Col span={12}>
                  <LocalFileUploadField
                    form={form}
                    name="thumbnail"
                    label="Thumbnail"
                    resourceType="image"
                    accept="image/jpeg,image/png,.jpg,.jpeg,.png"
                    required
                    value={mediaFiles.thumbnail}
                    onChange={(file) => setMediaFiles((prev) => ({ ...prev, thumbnail: file }))}
                    disabled={isUploading}
                  />
                </Col>
              </Row>
            </div>
          </Form.Item>
          <Form.Item name="duration" label="Duration">
            <Input placeholder="e.g. 2 hours" />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}
