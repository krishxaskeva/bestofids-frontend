import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Modal, Drawer, Form, Input, Select, Tag, InputNumber, message, Skeleton } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  getBlogsAdmin,
  createBlog,
  updateBlog,
  deleteBlog as deleteBlogApi,
} from '../../services/blogService';
import { CloudinaryUploadField } from '../../components/educationHub/CloudinaryUploadField';
import dayjs from 'dayjs';

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
};

export default function BlogPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
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
    form.resetFields();
    setDrawerOpen(true);
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue({
      title: record.title,
      description: record.description,
      author: record.author,
      tags: record.tags,
      content: record.content,
      price: record.price ?? 0,
      coverImage: record.coverImage,
      pdfUrl: record.pdfUrl,
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

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const payload = {
        ...values,
        coverImage: values.coverImage || undefined,
        pdfUrl: values.pdfUrl || undefined,
        status: 'published',
      };
      if (editingId) {
        updateBlog(editingId, payload)
          .then((updated) => {
            setData((prev) => prev.map((r) => (r.id === editingId ? { ...updated, id: editingId } : r)));
            message.success('Post updated.');
            setDrawerOpen(false);
            form.resetFields();
          })
          .catch((err) => message.error(err.message || 'Update failed'));
      } else {
        createBlog(payload)
          .then((created) => {
            setData((prev) => [{ ...created }, ...prev]);
            message.success('Post created.');
            setDrawerOpen(false);
            form.resetFields();
          })
          .catch((err) => message.error(err.message || 'Create failed'));
      }
    });
  };

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title', ellipsis: true },
    { title: 'Author', dataIndex: 'author', key: 'author', width: 100 },
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
        onClose={() => setDrawerOpen(false)}
        width={640}
        getContainer={() => document.body}
        rootClassName="admin-education-drawer"
        destroyOnClose
        footer={
          <Space style={{ justifyContent: 'flex-end', width: '100%' }}>
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleSubmit}>Save</Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input placeholder="Blog title" />
          </Form.Item>
          <Form.Item name="description" label="Short Description">
            <Input.TextArea rows={3} placeholder="Short description" />
          </Form.Item>
          <Form.Item name="author" label="Author" rules={[{ required: true }]}>
            <Input placeholder="Author name" />
          </Form.Item>
          <Form.Item name="price" label="Price in INR" rules={[{ required: true }]} initialValue={0}>
            <InputNumber min={0} style={{ width: '100%' }} placeholder="0 for free" />
          </Form.Item>
          <Form.Item name="tags" label="Tags">
            <Select mode="tags" placeholder="Add tags" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="content" label="Content" rules={[{ required: true }]}>
            <ReactQuill theme="snow" modules={quillModules} placeholder="Write content..." style={{ minHeight: 200 }} />
          </Form.Item>
          <CloudinaryUploadField
            form={form}
            name="coverImage"
            label="Cover Image"
            resourceType="image"
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            placeholder="Upload cover image"
          />
          <CloudinaryUploadField
            form={form}
            name="pdfUrl"
            label="PDF File"
            resourceType="raw"
            accept=".pdf,application/pdf"
            placeholder="Upload PDF"
          />
        </Form>
      </Drawer>
    </div>
  );
}
