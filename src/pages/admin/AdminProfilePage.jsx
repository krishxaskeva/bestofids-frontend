import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Descriptions, Spin, Empty } from 'antd';
import { GlobalOutlined, HomeOutlined } from '@ant-design/icons';
import { useAuth } from '../../store/hooks';
import { getMe } from '../../services/authService';
import dayjs from 'dayjs';

export default function AdminProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then(setProfile)
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, []);

  const displayName = profile?.name || user?.name || 'Admin';
  const displayEmail = profile?.email || user?.email || '—';
  const displayPhone = profile?.phone || user?.phone || '—';
  const joinedDate = profile?.createdAt || user?.createdAt
    ? dayjs(profile?.createdAt || user?.createdAt).format('MMMM D, YYYY')
    : '—';

  if (loading) {
    return (
      <div className="admin-module-page" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 280 }}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (!user && !profile) {
    return (
      <div className="admin-module-page" style={{ padding: 24 }}>
        <Card title="Admin Profile">
          <Empty description="Could not load profile." />
        </Card>
      </div>
    );
  }

  return (
    <div className="admin-module-page" style={{ padding: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 24 }}>Admin Profile</h1>

      <Card title="Account" className="mb-4" style={{ maxWidth: 560 }}>
        <Descriptions column={1} size="small">
          <Descriptions.Item label="Name">{displayName}</Descriptions.Item>
          <Descriptions.Item label="Email">{displayEmail}</Descriptions.Item>
          <Descriptions.Item label="Role">Super Admin</Descriptions.Item>
          <Descriptions.Item label="Phone">{displayPhone}</Descriptions.Item>
          <Descriptions.Item label="Joined">{joinedDate}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Quick links" style={{ maxWidth: 560 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <HomeOutlined /> Dashboard
          </Link>
          <Link to="/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <GlobalOutlined /> Website (open in new tab)
          </Link>
        </div>
      </Card>
    </div>
  );
}
