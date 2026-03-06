import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, Modal, Drawer, Form, Input, Select, InputNumber, message, Skeleton, Progress, Alert } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getEducationList, createEducation, updateEducation, deleteEducation } from '../../services/educationService';
import { LocalFileUploadField } from '../../components/educationHub/LocalFileUploadField';
import { usePublishWithUpload } from '../../hooks/usePublishWithUpload';

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

const initialMediaFiles = () => ({ contentLink: null, thumbnail: null });

export default function PodcastsTab() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [mediaFiles, setMediaFiles] = useState(initialMediaFiles);
  const [form] = Form.useForm();

  const load = () => {
    setLoading(true);
    getEducationList({ category: CATEGORY }).then(setData).catch(() => {}).finally(() => setLoading(false));
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
      mediaType: record.mediaType,
      podcastPlatform: record.podcastPlatform,
      episodeNumber: record.episodeNumber,
    });
    setDrawerOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete podcast?',
      okType: 'danger',
      onOk: () =>
        deleteEducation(id)
          .then(() => {
            setData((prev) => prev.filter((r) => r.id !== id));
            message.success('Deleted.');
          })
          .catch((e) => message.error(e.message)),
    });
  };

  const platformValue = Form.useWatch('podcastPlatform', form);
  const isDirectUpload = platformValue === 'direct_upload';
  const mediaTypeValue = Form.useWatch('mediaType', form);

  const getTempFiles = useCallback(() => {
    const list = [];
    if (isDirectUpload && mediaFiles.contentLink instanceof File) {
      const resourceType = mediaTypeValue === 'video' ? 'video' : 'raw';
      list.push({ key: 'contentLink', file: mediaFiles.contentLink, resourceType });
    }
    if (mediaFiles.thumbnail instanceof File) {
      list.push({ key: 'thumbnail', file: mediaFiles.thumbnail, resourceType: 'image' });
    }
    return list;
  }, [mediaFiles, isDirectUpload, mediaTypeValue]);

  const validateTempFiles = useCallback(() => {
    if (!isDirectUpload) return;
    if (!editingId && !(mediaFiles.contentLink instanceof File) && !mediaFiles.contentLink) {
      throw new Error(mediaTypeValue === 'video' ? 'Please upload video file' : 'Please upload audio file');
    }
  }, [isDirectUpload, editingId, mediaFiles, mediaTypeValue]);

  const buildPayload = useCallback(
    (values, urlMap) => ({
      ...values,
      category: CATEGORY,
      contentLink: isDirectUpload
        ? (urlMap.contentLink ?? (typeof mediaFiles.contentLink === 'string' ? mediaFiles.contentLink : undefined))
        : values.contentLink,
      thumbnail: urlMap.thumbnail ?? (typeof mediaFiles.thumbnail === 'string' ? mediaFiles.thumbnail : undefined),
    }),
    [mediaFiles, isDirectUpload]
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
    { title: 'Type', dataIndex: 'mediaType', key: 'mediaType', width: 80 },
    { title: 'Platform', dataIndex: 'podcastPlatform', key: 'podcastPlatform', width: 110 },
    { title: 'Ep #', dataIndex: 'episodeNumber', key: 'episodeNumber', width: 60 },
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
            {uploadStatus === 'uploading' ? `Uploading media... ${uploadProgress}%` : 'Upload complete. Publishing podcast...'}
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
    <>
      <Space style={{ marginBottom: 16, justifyContent: 'flex-end', width: '100%' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Add podcast</Button>
      </Space>
      {loading ? <Skeleton active paragraph={{ rows: 8 }} /> : <Table dataSource={data} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />}
      <Drawer
        title={editingId ? 'Edit podcast' : 'Add podcast'}
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
          <Form.Item name="title" label="Title" rules={[{ required: true }]}><Input placeholder="Episode title" /></Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}><TextArea rows={3} placeholder="Description" /></Form.Item>
          <Form.Item name="mediaType" label="Type" rules={[{ required: true }]}>
            <Select options={MEDIA_OPTIONS} />
          </Form.Item>
          <Form.Item name="podcastPlatform" label="Platform">
            <Select placeholder="Select platform" allowClear options={PLATFORM_OPTIONS} />
          </Form.Item>
          {isDirectUpload ? (
            <LocalFileUploadField
              form={form}
              name="contentLink"
              label={mediaTypeValue === 'video' ? 'Video file' : 'Audio file'}
              resourceType={mediaTypeValue === 'video' ? 'video' : 'raw'}
              accept={mediaTypeValue === 'video' ? 'video/mp4,.mp4' : 'audio/mpeg,audio/mp3,.mp3'}
              placeholder={mediaTypeValue === 'video' ? 'Upload MP4' : 'Upload MP3'}
              value={mediaFiles.contentLink}
              onChange={(file) => setMediaFiles((prev) => ({ ...prev, contentLink: file }))}
              disabled={isUploading}
            />
          ) : (
            <Form.Item name="contentLink" label="Platform URL"><Input placeholder="Link to Spotify, YouTube, etc." /></Form.Item>
          )}
          <Form.Item name="episodeNumber" label="Episode number"><InputNumber min={1} style={{ width: '100%' }} placeholder="Optional" /></Form.Item>
          <LocalFileUploadField
            form={form}
            name="thumbnail"
            label="Thumbnail"
            resourceType="image"
            accept="image/jpeg,image/png,.jpg,.jpeg,.png"
            value={mediaFiles.thumbnail}
            onChange={(file) => setMediaFiles((prev) => ({ ...prev, thumbnail: file }))}
            disabled={isUploading}
          />
        </Form>
      </Drawer>
    </>
  );
}
