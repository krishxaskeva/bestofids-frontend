import React, { useState, useEffect, useCallback } from 'react';
import { Card, Table, Button, Space, Modal, Drawer, Form, Input, Select, InputNumber, message, Skeleton, Tag, Progress, Alert } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  getBlogsAdmin,
  createBlog,
  updateBlog,
  deleteBlog as deleteBlogApi,
} from '../../services/blogService';
import { LocalFileUploadField } from '../../components/educationHub/LocalFileUploadField';
import { usePublishWithUpload } from '../../hooks/usePublishWithUpload';
import QuillWithTooltips from '../../components/QuillWithTooltips';

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
};

const initialMediaFiles = () => ({ coverImage: null, pdfUrl: null });

export default function BlogPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [mediaFiles, setMediaFiles] = useState(initialMediaFiles);
  const [form] = Form.useForm();

  const loadBlogs = () => {
    setLoading(true);
    getBlogsAdmin()
      .then(setData)
      .catch(() => {
        message.error('Failed to load blogs');
        setData([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleAdd = () => {
    setEditingId(null);
    setMediaFiles(initialMediaFiles());
    form.resetFields();
    setDrawerOpen(true);
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    setMediaFiles({
      coverImage: record.coverImage || null,
      pdfUrl: record.pdfUrl || null,
    });
    form.setFieldsValue({
      title: record.title,
      description: record.description,
      tags: record.tags,
      content: record.content,
      price: record.price ?? 0,
    });
    setDrawerOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete blog post?',
      okType: 'danger',
      onOk: () => {
        deleteBlogApi(id)
          .then(() => {
            setData((prev) => prev.filter((r) => r.id !== id));
            message.success('Post deleted.');
          })
          .catch((err) => message.error(err.message || 'Delete failed'));
      },
    });
  };

  const getTempFiles = useCallback(() => {
    const list = [];
    if (mediaFiles.coverImage instanceof File) {
      list.push({ key: 'coverImage', file: mediaFiles.coverImage, resourceType: 'image' });
    }
    if (mediaFiles.pdfUrl instanceof File) {
      list.push({ key: 'pdfUrl', file: mediaFiles.pdfUrl, resourceType: 'raw' });
    }
    return list;
  }, [mediaFiles]);

  const buildPayload = useCallback(
    (values, urlMap) => ({
      ...values,
      coverImage: urlMap.coverImage ?? (typeof mediaFiles.coverImage === 'string' ? mediaFiles.coverImage : undefined),
      pdfUrl: urlMap.pdfUrl ?? (typeof mediaFiles.pdfUrl === 'string' ? mediaFiles.pdfUrl : undefined),
      status: 'published',
    }),
    [mediaFiles]
  );

  const { handlePublish, uploadProgress, uploadStatus, errorMessage, resetUploadState, isUploading } = usePublishWithUpload({
    form,
    getTempFiles,
    buildPayload,
    submitApi: createBlog,
    updateApi: updateBlog,
    isEdit: !!editingId,
    editId: editingId,
    onSuccess: () => {
      message.success(editingId ? 'Post updated.' : 'Post created.');
      setDrawerOpen(false);
      setMediaFiles(initialMediaFiles());
      form.resetFields();
      resetUploadState();
      loadBlogs();
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
    { title: 'Title', dataIndex: 'title', key: 'title', ellipsis: true },
    { title: 'Price', dataIndex: 'price', key: 'price', width: 80, render: (v) => (v != null ? `₹${v}` : '—') },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      width: 180,
      render: (tags) => (Array.isArray(tags) ? tags.map((t) => <Tag key={t}>{t}</Tag>) : '—'),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 110,
      render: (v) => (v ? dayjs(v).format('MMM D, YYYY') : '—'),
    },
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
            {uploadStatus === 'uploading' ? `Uploading media... ${uploadProgress}%` : 'Upload complete. Publishing...'}
          </span>
        </>
      )}
      <Space style={{ justifyContent: 'flex-end', width: '100%' }}>
        <Button onClick={handleCancel} disabled={isUploading}>Cancel</Button>
        <Button type="primary" onClick={handlePublish} loading={isUploading}>Publish</Button>
      </Space>
    </Space>
  );

  return (
    <div>
      <h2 style={{ marginBottom: 24, fontWeight: 600 }}>Blog</h2>
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Create blog
          </Button>
        </Space>
        {loading ? (
          <Skeleton active paragraph={{ rows: 8 }} />
        ) : (
          <Table
            dataSource={data}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>
      <Drawer
        title={editingId ? 'Edit blog post' : 'Create blog post'}
        placement="right"
        open={drawerOpen}
        onClose={handleCancel}
        width={640}
        getContainer={() => document.body}
        rootClassName="admin-education-drawer"
        destroyOnClose
        footer={publishFooter}
        styles={{ body: { paddingBottom: 24 } }}
      >
        {drawerOpen && (
          <Form form={form} layout="vertical">
            <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Enter title' }]}>
              <Input placeholder="Blog title" />
            </Form.Item>
            <Form.Item name="description" label="Short Description">
              <Input.TextArea rows={3} placeholder="Short description" />
            </Form.Item>
            <LocalFileUploadField
              form={form}
              name="pdfUrl"
              label="PDF File"
              resourceType="raw"
              accept=".pdf,application/pdf"
              placeholder="Upload PDF"
              value={mediaFiles.pdfUrl}
              onChange={(file) => setMediaFiles((prev) => ({ ...prev, pdfUrl: file }))}
              disabled={isUploading}
            />
            <LocalFileUploadField
              form={form}
              name="coverImage"
              label="Cover Image"
              resourceType="image"
              accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
              placeholder="Upload cover image"
              value={mediaFiles.coverImage}
              onChange={(file) => setMediaFiles((prev) => ({ ...prev, coverImage: file }))}
              disabled={isUploading}
            />
            <Form.Item name="price" label="Price in INR" rules={[{ required: true, message: 'Enter price' }]} initialValue={0}>
              <InputNumber min={0} style={{ width: '100%' }} placeholder="0 for free" />
            </Form.Item>
            <Form.Item name="tags" label="Tags">
              <Select mode="tags" placeholder="Add tags" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="content" label="Content" rules={[{ required: true, message: 'Enter content' }]}>
              <QuillWithTooltips theme="snow" modules={quillModules} placeholder="Write content..." style={{ minHeight: 200 }} />
            </Form.Item>
          </Form>
        )}
      </Drawer>
    </div>
  );
}
