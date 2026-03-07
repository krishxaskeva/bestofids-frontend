import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, Modal, Drawer, Form, Input, Skeleton, Progress, Alert, Dropdown } from 'antd';
import toast from '../../utils/adminToast';
import { PlusOutlined, EditOutlined, DeleteOutlined, EllipsisOutlined } from '@ant-design/icons';
import { getEducationList, createEducation, updateEducation, deleteEducation } from '../../services/educationService';
import { LocalFileUploadField } from '../../components/educationHub/LocalFileUploadField';
import { usePublishWithUpload } from '../../hooks/usePublishWithUpload';

const { TextArea } = Input;
const CATEGORY = 'infographic';

const initialMediaFiles = () => ({ contentLink: null });

export default function InfographicsTab() {
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
    setMediaFiles({ contentLink: record.contentLink || null });
    form.setFieldsValue({
      title: record.title,
      description: record.description,
    });
    setDrawerOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete infographic?',
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

  const getTempFiles = useCallback(() => {
    if (mediaFiles.contentLink instanceof File) {
      return [{ key: 'contentLink', file: mediaFiles.contentLink, resourceType: 'image' }];
    }
    return [];
  }, [mediaFiles]);

  const validateTempFiles = useCallback(() => {
    if (!editingId && !(mediaFiles.contentLink instanceof File) && !mediaFiles.contentLink) {
      throw new Error('Please upload infographic image');
    }
  }, [editingId, mediaFiles]);

  const buildPayload = useCallback(
    (values, urlMap) => {
      const contentLink = urlMap.contentLink ?? (typeof mediaFiles.contentLink === 'string' ? mediaFiles.contentLink : undefined);
      return {
        ...values,
        category: CATEGORY,
        contentLink,
        thumbnail: contentLink,
        previewThumbnail: contentLink,
      };
    },
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
    { title: 'Description', dataIndex: 'description', key: 'description', ellipsis: true, width: 220 },
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
            {uploadStatus === 'uploading' ? `Uploading media... ${uploadProgress}%` : 'Upload complete. Publishing infographic...'}
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
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Add infographic</Button>
      </Space>
      {loading ? <Skeleton active paragraph={{ rows: 8 }} /> : <Table dataSource={data} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />}
      <Drawer
        title={editingId ? 'Edit infographic' : 'Add infographic'}
        placement="right"
        open={drawerOpen}
        onClose={handleCancel}
        width={540}
        getContainer={() => document.body}
        rootClassName="admin-education-drawer"
        destroyOnClose
        footer={publishFooter}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}><Input placeholder="Infographic title" /></Form.Item>
          <Form.Item name="description" label="Description"><TextArea rows={3} placeholder="Brief description" /></Form.Item>
          <LocalFileUploadField
            form={form}
            name="contentLink"
            label="Infographic image"
            resourceType="image"
            accept="image/jpeg,image/png,.jpg,.jpeg,.png"
            placeholder="Upload image (also used as thumbnail)"
            required
            value={mediaFiles.contentLink}
            onChange={(file) => setMediaFiles((prev) => ({ ...prev, contentLink: file }))}
            disabled={isUploading}
          />
        </Form>
      </Drawer>
    </>
  );
}
