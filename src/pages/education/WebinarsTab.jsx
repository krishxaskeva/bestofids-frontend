import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Drawer, Form, Input, Select, message, Skeleton } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getEducationList, createEducation, updateEducation, deleteEducation } from '../../services/educationService';
import { CloudinaryUploadField } from '../../components/educationHub/CloudinaryUploadField';

const { TextArea } = Input;
const CATEGORY = 'webinar';

const TYPE_OPTIONS = [
  { value: 'live', label: 'Live' },
  { value: 'recording', label: 'Recording' },
];
const PLATFORM_OPTIONS = [
  { value: 'zoom', label: 'Zoom' },
  { value: 'google_meet', label: 'Google Meet' },
  { value: 'microsoft_teams', label: 'Microsoft Teams' },
  { value: 'youtube_live', label: 'YouTube Live' },
  { value: 'other', label: 'Other' },
];

function toDateTimeLocal(isoOrDate) {
  if (!isoOrDate) return undefined;
  const d = new Date(isoOrDate);
  if (Number.isNaN(d.getTime())) return undefined;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${day}T${h}:${min}`;
}

export default function WebinarsTab() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  const load = () => {
    setLoading(true);
    getEducationList({ category: CATEGORY }).then(setData).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleAdd = () => { setEditingId(null); form.resetFields(); setDrawerOpen(true); };
  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue({
      title: record.title,
      description: record.description,
      contentLink: record.contentLink,
      thumbnail: record.thumbnail,
      type: record.type || 'recording',
      platform: record.platform,
      scheduledAt: record.scheduledAt ? toDateTimeLocal(record.scheduledAt) : undefined,
    });
    setDrawerOpen(true);
  };
  const handleDelete = (id) => {
    Modal.confirm({ title: 'Delete webinar?', okType: 'danger', onOk: () => deleteEducation(id).then(() => { setData((prev) => prev.filter((r) => r.id !== id)); message.success('Deleted.'); }).catch((e) => message.error(e.message)) });
  };
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const { scheduledAt, ...rest } = values;
      const payload = { ...rest, category: CATEGORY, scheduledAt: scheduledAt || undefined };
      if (editingId) {
        updateEducation(editingId, payload).then((updated) => { setData((prev) => prev.map((r) => (r.id === editingId ? { ...updated, id: editingId } : r))); message.success('Updated.'); setDrawerOpen(false); }).catch((e) => message.error(e.message));
      } else {
        createEducation(payload).then((created) => { setData((prev) => [{ ...created }, ...prev]); message.success('Created.'); setDrawerOpen(false); form.resetFields(); }).catch((e) => message.error(e.message));
      }
    });
  };

  const typeValue = Form.useWatch('type', form);
  const isLive = typeValue === 'live';

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Type', dataIndex: 'type', key: 'type', width: 90, render: (v) => (v === 'live' ? 'Live' : 'Recording') },
    { title: 'Scheduled', dataIndex: 'scheduledAt', key: 'scheduledAt', width: 150 },
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
      <Space style={{ marginBottom: 16, justifyContent: 'flex-end', width: '100%' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Create webinar</Button>
      </Space>
      {loading ? <Skeleton active paragraph={{ rows: 8 }} /> : <Table dataSource={data} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />}
      <Drawer
        title={editingId ? 'Edit webinar' : 'Create webinar'}
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
          <Form.Item name="title" label="Title" rules={[{ required: true }]}><Input placeholder="Webinar title" /></Form.Item>
          <Form.Item name="description" label="Description"><TextArea rows={3} placeholder="Description" /></Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true }]} initialValue="recording">
            <Select options={TYPE_OPTIONS} />
          </Form.Item>
          <Form.Item name="platform" label="Platform">
            <Select placeholder="For live webinars" allowClear options={PLATFORM_OPTIONS} />
          </Form.Item>
          {isLive ? (
            <Form.Item name="contentLink" label="Join link" rules={[{ required: true, message: 'Paste the live webinar join link' }]}>
              <Input placeholder="Paste join link (Zoom, Meet, Teams, etc.)" />
            </Form.Item>
          ) : (
            <CloudinaryUploadField form={form} name="contentLink" label="Recording video" resourceType="video" accept="video/mp4,.mp4" placeholder="Upload recording (MP4)" required />
          )}
          <Form.Item name="scheduledAt" label="Scheduled date & time" rules={isLive ? [{ required: true, message: 'Required for Live' }] : []}>
            <Input type="datetime-local" />
          </Form.Item>
          <CloudinaryUploadField form={form} name="thumbnail" label="Thumbnail" resourceType="image" accept="image/jpeg,image/png,.jpg,.jpeg,.png" />
        </Form>
      </Drawer>
    </>
  );
}
