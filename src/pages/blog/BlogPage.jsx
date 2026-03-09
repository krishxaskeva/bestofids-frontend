import React, { useState, useEffect, useCallback } from 'react';
import { Card, Table, Button, Space, Modal, Drawer, Form, Input, Select, InputNumber, Skeleton, Tag, Progress, Alert, Dropdown } from 'antd';
import toast from '../../utils/adminToast';
import { PlusOutlined, EditOutlined, DeleteOutlined, EllipsisOutlined } from '@ant-design/icons';
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
    console.log('Fetching blogs...');
    getBlogsAdmin()
      .then(setData)
      .catch((err) => {
        console.error('Component error (BlogPage loadBlogs):', err);
        toast.error('Failed to load blogs');
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

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Delete blog post?',
      okType: 'danger',
      onOk: () => {
        deleteBlogApi(record.id)
          .then(() => {
            setData((prev) => prev.filter((r) => r.id !== record.id));
            toast.success(record.title ? `"${record.title}" deleted.` : 'Post deleted.');
          })
          .catch((err) => toast.error(err.message || 'Delete failed'));
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
      toast.success(editingId ? 'Post updated.' : 'Post created.');
      setDrawerOpen(false);
      setMediaFiles(initialMediaFiles());
      form.resetFields();
      resetUploadState();
      loadBlogs();
    },
    onError: (msg) => toast.error(msg),
  });

  const handleCancel = () => {
    setDrawerOpen(false);
    setMediaFiles(initialMediaFiles());
    form.resetFields();
    resetUploadState();
  };

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title', ellipsis: true, width: 220 },
    { title: 'Price', dataIndex: 'price', key: 'price', width: 90, render: (v) => (v != null ? `₹${v}` : '—') },
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
      width: 120,
      render: (v) => (v ? dayjs(v).format('MMM D, YYYY') : '—'),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      align: 'center',
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              { key: 'edit', icon: <EditOutlined />, label: 'Edit', onClick: () => handleEdit(record) },
              { key: 'delete', icon: <DeleteOutlined />, label: 'Delete', danger: true, onClick: () => handleDelete(record) },
            ],
          }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Button
            type="text"
            size="small"
            icon={<EllipsisOutlined style={{ fontSize: 18, transform: 'rotate(90deg)' }} />}
            aria-label="Actions"
          />
        </Dropdown>
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
    <div className="admin-module-page">
      <h2 className="admin-page-title">Blog</h2>
      <Card>
        <div className="admin-toolbar">
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Create blog
          </Button>
        </div>
        <div className="admin-data-table">
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
        </div>
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
