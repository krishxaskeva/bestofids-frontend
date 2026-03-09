import React, { useState, useCallback, useEffect } from 'react';
import { Card, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import toast from '../../utils/adminToast';
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
  const [categoryFilter, setCategoryFilter] = useState(undefined);

  const loadPosts = useCallback(() => {
    setLoading(true);
    console.log('Fetching patient care posts...');
    getPatientCareAdmin()
      .then(setPosts)
      .catch((err) => {
        console.error('Component error (PatientCareList loadPosts):', err);
        toast.error('Failed to load posts');
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
    const matchCategory = categoryFilter == null || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const handleCreateSuccess = useCallback(
    (payload) => {
      return createPatientCarePost(payload)
        .then((created) => {
          setPosts((prev) => [{ ...created }, ...prev]);
          setCreateOpen(false);
          toast.success('Post created.');
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
          toast.success('Post updated.');
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
                toast.success(record.title ? `"${record.title}" deleted.` : 'Post deleted.');
              })
            .catch((err) => toast.error(err.message || 'Delete failed'));
        },
      });
    },
    []
  );

  return (
    <div className="admin-module-page">
      <h2 className="admin-page-title">Patient Care</h2>
      <Card>
        <div className="admin-toolbar">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateOpen(true)}
          >
            Create Post
          </Button>
        </div>
        <div className="admin-data-table">
          <PatientCareTable
          dataSource={filteredData}
          loading={loading}
          onEdit={setEditPost}
          onDelete={handleDelete}
          onPreview={setPreviewPost}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          categories={CATEGORIES}
        />
        </div>
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
