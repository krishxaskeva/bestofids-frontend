import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import toast from '../../utils/adminToast';
import { getEnrollmentsAll } from '../../services/educationService';
import dayjs from 'dayjs';

const columns = [
  { title: 'User', key: 'user', width: 240, ellipsis: true, render: (_, r) => (r.userName || r.userEmail) ? `${r.userName || ''} (${r.userEmail || ''})` : '—' },
  { title: 'Education', dataIndex: 'educationTitle', key: 'educationTitle', ellipsis: true, width: 260 },
  { title: 'Enrolled', dataIndex: 'enrollDate', key: 'enrollDate', width: 120, render: (v) => v ? dayjs(v).format('MMM D, YYYY') : '—' },
];

export default function EnrollmentsTab() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getEnrollmentsAll()
      .then(setData)
      .catch(() => toast.error('Failed to load enrollments'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <p className="text-secondary mb-3">All user enrollments across courses, webinars, infographics, and podcasts.</p>
      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 20 }}
      />
    </div>
  );
}
