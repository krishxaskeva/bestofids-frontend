import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Drawer, Form, Input, message, Skeleton, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getEducationList, createEducation, updateEducation, deleteEducation } from '../../services/educationService';
import { CloudinaryUploadField } from '../../components/educationHub/CloudinaryUploadField';

const { TextArea } = Input;
const CATEGORY = 'course';

export default function CoursesTab() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
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
    form.resetFields();
    setDrawerOpen(true);
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue({
      title: record.title,
      description: record.description,
      contentLink: record.contentLink,
      thumbnail: record.thumbnail,
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

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const payload = { ...values, category: CATEGORY };
      if (editingId) {
        updateEducation(editingId, payload)
          .then((updated) => {
            setData((prev) => prev.map((r) => (r.id === editingId ? { ...updated, id: editingId } : r)));
            message.success('Updated.');
            setDrawerOpen(false);
          })
          .catch((err) => message.error(err.message));
      } else {
        createEducation(payload)
          .then((created) => {
            setData((prev) => [{ ...created }, ...prev]);
            message.success('Created.');
            setDrawerOpen(false);
            form.resetFields();
          })
          .catch((err) => message.error(err.message));
      }
    });
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
        onClose={() => setDrawerOpen(false)}
        width={560}
        getContainer={() => document.body}
        rootClassName="admin-education-drawer"
        destroyOnClose
        footer={
          <Space style={{ justifyContent: 'flex-end', width: '100%' }}>
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleSubmit}>Publish</Button>
          </Space>
        }
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
                  <CloudinaryUploadField form={form} name="contentLink" label="Course video" resourceType="video" accept="video/mp4,.mp4" placeholder="Upload MP4" required />
                </Col>
                <Col span={12}>
                  <CloudinaryUploadField form={form} name="thumbnail" label="Thumbnail" resourceType="image" accept="image/jpeg,image/png,.jpg,.jpeg,.png" required />
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
