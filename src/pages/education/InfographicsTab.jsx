import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Drawer, Form, Input, message, Skeleton } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getEducationList, createEducation, updateEducation, deleteEducation } from '../../services/educationService';
import { CloudinaryUploadField } from '../../components/educationHub/CloudinaryUploadField';

const { TextArea } = Input;
const CATEGORY = 'infographic';

export default function InfographicsTab() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  const load = () => { setLoading(true); getEducationList({ category: CATEGORY }).then(setData).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const handleAdd = () => { setEditingId(null); form.resetFields(); setDrawerOpen(true); };
  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue({
      title: record.title,
      description: record.description,
      contentLink: record.contentLink,
    });
    setDrawerOpen(true);
  };
  const handleDelete = (id) => {
    Modal.confirm({ title: 'Delete infographic?', okType: 'danger', onOk: () => deleteEducation(id).then(() => { setData((prev) => prev.filter((r) => r.id !== id)); message.success('Deleted.'); }).catch((e) => message.error(e.message)) });
  };
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const { contentLink, ...rest } = values;
      const payload = { ...rest, contentLink, category: CATEGORY };
      if (contentLink) {
        payload.thumbnail = contentLink;
        payload.previewThumbnail = contentLink;
      }
      if (editingId) updateEducation(editingId, payload).then((updated) => { setData((prev) => prev.map((r) => (r.id === editingId ? { ...updated, id: editingId } : r))); message.success('Updated.'); setDrawerOpen(false); }).catch((e) => message.error(e.message));
      else createEducation(payload).then((created) => { setData((prev) => [{ ...created }, ...prev]); message.success('Created.'); setDrawerOpen(false); form.resetFields(); }).catch((e) => message.error(e.message));
    });
  };

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Description', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: 'Actions', key: 'actions', width: 120, render: (_, record) => (
      <Space>
        <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
        <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
      </Space>
    ) },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16, justifyContent: 'flex-end', width: '100%' }}><Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Add infographic</Button></Space>
      {loading ? <Skeleton active paragraph={{ rows: 8 }} /> : <Table dataSource={data} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />}
      <Drawer
        title={editingId ? 'Edit infographic' : 'Add infographic'}
        placement="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={540}
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
          <Form.Item name="title" label="Title" rules={[{ required: true }]}><Input placeholder="Infographic title" /></Form.Item>
          <Form.Item name="description" label="Description"><TextArea rows={3} placeholder="Brief description" /></Form.Item>
          <CloudinaryUploadField form={form} name="contentLink" label="Infographic image" resourceType="image" accept="image/jpeg,image/png,.jpg,.jpeg,.png" placeholder="Upload image (also used as thumbnail)" required />
        </Form>
      </Drawer>
    </>
  );
}
