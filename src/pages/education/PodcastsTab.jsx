import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Drawer, Form, Input, Select, InputNumber, message, Skeleton } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getEducationList, createEducation, updateEducation, deleteEducation } from '../../services/educationService';
import { CloudinaryUploadField } from '../../components/educationHub/CloudinaryUploadField';

const { TextArea } = Input;
const CATEGORY = 'podcast';

const MEDIA_OPTIONS = [
  { value: 'audio', label: 'Audio' },
  { value: 'video', label: 'Video' },
];
const PLATFORM_OPTIONS = [
  { value: 'spotify', label: 'Spotify' },
  { value: 'apple_podcasts', label: 'Apple Podcasts' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'soundcloud', label: 'SoundCloud' },
  { value: 'direct_upload', label: 'Direct Upload' },
  { value: 'other', label: 'Other' },
];

export default function PodcastsTab() {
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
      thumbnail: record.thumbnail,
      mediaType: record.mediaType,
      podcastPlatform: record.podcastPlatform,
      episodeNumber: record.episodeNumber,
    });
    setDrawerOpen(true);
  };
  const handleDelete = (id) => {
    Modal.confirm({ title: 'Delete podcast?', okType: 'danger', onOk: () => deleteEducation(id).then(() => { setData((prev) => prev.filter((r) => r.id !== id)); message.success('Deleted.'); }).catch((e) => message.error(e.message)) });
  };
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const payload = { ...values, category: CATEGORY };
      if (editingId) updateEducation(editingId, payload).then((updated) => { setData((prev) => prev.map((r) => (r.id === editingId ? { ...updated, id: editingId } : r))); message.success('Updated.'); setDrawerOpen(false); }).catch((e) => message.error(e.message));
      else createEducation(payload).then((created) => { setData((prev) => [{ ...created }, ...prev]); message.success('Created.'); setDrawerOpen(false); form.resetFields(); }).catch((e) => message.error(e.message));
    });
  };

  const platformValue = Form.useWatch('podcastPlatform', form);
  const isDirectUpload = platformValue === 'direct_upload';
  const mediaTypeValue = Form.useWatch('mediaType', form);

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Type', dataIndex: 'mediaType', key: 'mediaType', width: 80 },
    { title: 'Platform', dataIndex: 'podcastPlatform', key: 'podcastPlatform', width: 110 },
    { title: 'Ep #', dataIndex: 'episodeNumber', key: 'episodeNumber', width: 60 },
    { title: 'Actions', key: 'actions', width: 120, render: (_, record) => (
      <Space>
        <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
        <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
      </Space>
    ) },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16, justifyContent: 'flex-end', width: '100%' }}><Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Add podcast</Button></Space>
      {loading ? <Skeleton active paragraph={{ rows: 8 }} /> : <Table dataSource={data} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />}
      <Drawer
        title={editingId ? 'Edit podcast' : 'Add podcast'}
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
          <Form.Item name="title" label="Title" rules={[{ required: true }]}><Input placeholder="Episode title" /></Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}><TextArea rows={3} placeholder="Description" /></Form.Item>
          <Form.Item name="mediaType" label="Type" rules={[{ required: true }]}>
            <Select options={MEDIA_OPTIONS} />
          </Form.Item>
          <Form.Item name="podcastPlatform" label="Platform">
            <Select placeholder="Select platform" allowClear options={PLATFORM_OPTIONS} />
          </Form.Item>
          {isDirectUpload ? (
            <CloudinaryUploadField
              form={form}
              name="contentLink"
              label={mediaTypeValue === 'video' ? 'Video file' : 'Audio file'}
              resourceType={mediaTypeValue === 'video' ? 'video' : 'raw'}
              accept={mediaTypeValue === 'video' ? 'video/mp4,.mp4' : 'audio/mpeg,audio/mp3,.mp3'}
              placeholder={mediaTypeValue === 'video' ? 'Upload MP4' : 'Upload MP3'}
            />
          ) : (
            <Form.Item name="contentLink" label="Platform URL"><Input placeholder="Link to Spotify, YouTube, etc." /></Form.Item>
          )}
          <Form.Item name="episodeNumber" label="Episode number"><InputNumber min={1} style={{ width: '100%' }} placeholder="Optional" /></Form.Item>
          <CloudinaryUploadField form={form} name="thumbnail" label="Thumbnail" resourceType="image" accept="image/jpeg,image/png,.jpg,.jpeg,.png" />
        </Form>
      </Drawer>
    </>
  );
}
