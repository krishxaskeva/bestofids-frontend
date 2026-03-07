import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, Modal, Drawer, Form, Input, Select, Skeleton, Progress, Alert, Dropdown } from 'antd';
import toast from '../../utils/adminToast';
import { PlusOutlined, EditOutlined, DeleteOutlined, EllipsisOutlined } from '@ant-design/icons';
import { getEducationList, createEducation, updateEducation, deleteEducation } from '../../services/educationService';
import { LocalFileUploadField } from '../../components/educationHub/LocalFileUploadField';
import { usePublishWithUpload } from '../../hooks/usePublishWithUpload';

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

const initialMediaFiles = () => ({ contentLink: null, thumbnail: null });

export default function WebinarsTab() {
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
      type: record.type || 'recording',
      platform: record.platform,
      contentLink: record.type === 'live' ? record.contentLink : undefined,
      scheduledAt: record.scheduledAt ? toDateTimeLocal(record.scheduledAt) : undefined,
    });
    setDrawerOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete webinar?',
      okType: 'danger',
      onOk: () =>
        deleteEducation(id)
          .then(() => {
            setData((prev) => prev.filter((r) => r.id !== id));
            toast.success('Deleted.');
          })
          .catch((e) => toast.error(e.message)),
    });
  };

  const typeValue = Form.useWatch('type', form);
  const isLive = typeValue === 'live';

  const getTempFiles = useCallback(() => {
    const list = [];
    if (!isLive && mediaFiles.contentLink instanceof File) {
      list.push({ key: 'contentLink', file: mediaFiles.contentLink, resourceType: 'video' });
    }
    if (mediaFiles.thumbnail instanceof File) {
      list.push({ key: 'thumbnail', file: mediaFiles.thumbnail, resourceType: 'image' });
    }
    return list;
  }, [mediaFiles, isLive]);

  const validateTempFiles = useCallback(() => {
    if (isLive) return; // contentLink is join link from form
    if (!editingId && !(mediaFiles.contentLink instanceof File) && !mediaFiles.contentLink) {
      throw new Error('Please upload recording video');
    }
  }, [isLive, editingId, mediaFiles]);

  const buildPayload = useCallback(
    (values, urlMap) => {
      const { scheduledAt, ...rest } = values;
      return {
        ...rest,
        category: CATEGORY,
        scheduledAt: scheduledAt || undefined,
        contentLink: isLive
          ? values.contentLink
          : urlMap.contentLink ?? (typeof mediaFiles.contentLink === 'string' ? mediaFiles.contentLink : undefined),
        thumbnail: urlMap.thumbnail ?? (typeof mediaFiles.thumbnail === 'string' ? mediaFiles.thumbnail : undefined),
      };
    },
    [mediaFiles, isLive]
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
      toast.success(editingId ? 'Updated.' : 'Created.');
      setDrawerOpen(false);
      setMediaFiles(initialMediaFiles());
      form.resetFields();
      resetUploadState();
      load();
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
    { title: 'Type', dataIndex: 'type', key: 'type', width: 100, render: (v) => (v === 'live' ? 'Live' : 'Recording') },
    { title: 'Scheduled', dataIndex: 'scheduledAt', key: 'scheduledAt', width: 160 },
    { title: 'Description', dataIndex: 'description', key: 'description', ellipsis: true, width: 200 },
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
              { key: 'delete', icon: <DeleteOutlined />, label: 'Delete', danger: true, onClick: () => handleDelete(record.id) },
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
            {uploadStatus === 'uploading' ? `Uploading media... ${uploadProgress}%` : 'Upload complete. Publishing webinar...'}
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
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Create webinar</Button>
      </Space>
      {loading ? <Skeleton active paragraph={{ rows: 8 }} /> : <Table dataSource={data} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />}
      <Drawer
        title={editingId ? 'Edit webinar' : 'Create webinar'}
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
            <LocalFileUploadField
              form={form}
              name="contentLink"
              label="Recording video"
              resourceType="video"
              accept="video/mp4,.mp4"
              placeholder="Upload recording (MP4)"
              required
              value={mediaFiles.contentLink}
              onChange={(file) => setMediaFiles((prev) => ({ ...prev, contentLink: file }))}
              disabled={isUploading}
            />
          )}
          <Form.Item name="scheduledAt" label="Scheduled date & time" rules={isLive ? [{ required: true, message: 'Required for Live' }] : []}>
            <Input type="datetime-local" />
          </Form.Item>
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
