import React, { useState, useCallback, useEffect } from 'react';
import { Card, Button, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import PatientCareTable from '../../components/patientCare/PatientCareTable';
import CreatePatientCare from './CreatePatientCare';
import EditPatientCare from './EditPatientCare';
import PatientCarePreview from './PatientCarePreview';
import {
  getPatientCareAdmin,
  createPatientCarePost,
  updatePatientCarePost,
  deletePatientCarePost,
} from '../../services/patientCareService';
import { CATEGORIES } from '../../store/slices/patientCareSlice';

export default function PatientCareList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [previewPost, setPreviewPost] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [categoryFilter, setCategoryFilter] = useState(undefined);

  const loadPosts = useCallback(() => {
    setLoading(true);
    getPatientCareAdmin()
      .then(setPosts)
      .catch(() => {
        message.error('Failed to load posts');
        setPosts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const filteredData = posts.filter((p) => {
    const matchSearch =
      !searchValue ||
      (p.title && p.title.toLowerCase().includes(searchValue.toLowerCase()));
    const matchStatus = statusFilter == null || p.status === statusFilter;
    const matchCategory = categoryFilter == null || p.category === categoryFilter;
    return matchSearch && matchStatus && matchCategory;
  });

  const handleCreateSuccess = useCallback(
    (payload) => {
      return createPatientCarePost(payload)
        .then((created) => {
          setPosts((prev) => [{ ...created }, ...prev]);
          setCreateOpen(false);
          message.success('Post created.');
        });
    },
    []
  );

  const handleEditSuccess = useCallback(
    (id, payload) => {
      return updatePatientCarePost(id, payload)
        .then((updated) => {
          setPosts((prev) =>
            prev.map((p) => (p.id === id ? { ...updated, id } : p))
          );
          setEditPost(null);
          message.success('Post updated.');
        });
    },
    []
  );

  const handleDelete = useCallback(
    (record) => {
      Modal.confirm({
        title: 'Delete this post?',
        content: 'This action cannot be undone.',
        okText: 'Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: () => {
          deletePatientCarePost(record.id)
            .then(() => {
              setPosts((prev) => prev.filter((p) => p.id !== record.id));
              message.success('Post deleted.');
            })
            .catch((err) => message.error(err.message || 'Delete failed'));
        },
      });
    },
    []
  );

  return (
    <div>
      <h2 style={{ marginBottom: 24, fontWeight: 600 }}>Patient Care</h2>
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateOpen(true)}
          >
            Create Post
          </Button>
        </Space>
        <PatientCareTable
          dataSource={filteredData}
          loading={loading}
          onEdit={setEditPost}
          onDelete={handleDelete}
          onPreview={setPreviewPost}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          categories={CATEGORIES}
        />
      </Card>

      <CreatePatientCare
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <EditPatientCare
        post={editPost}
        open={!!editPost}
        onClose={() => setEditPost(null)}
        onSuccess={handleEditSuccess}
      />

      <PatientCarePreview
        post={previewPost}
        open={!!previewPost}
        onClose={() => setPreviewPost(null)}
      />
    </div>
  );
}
