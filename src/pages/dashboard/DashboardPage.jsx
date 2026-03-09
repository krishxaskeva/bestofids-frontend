import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Statistic, Skeleton } from 'antd';
import toast from '../../utils/adminToast';
import {
  UserOutlined,
  BookOutlined,
  HeartOutlined,
  DollarOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import { getStats, getUsers } from '../../services/apiService';
import { getPayments } from '../../services/apiService';

const BRAND_PRIMARY = '#117574';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);

  useEffect(() => {
    Promise.all([
      getStats().catch((e) => { toast.error('Failed to load stats'); return null; }),
      getUsers().then((u) => u.slice(0, 5)).catch(() => []),
      getPayments().then((p) => p.slice(0, 5)).catch(() => []),
    ]).then(([s, u, p]) => {
      setStats(s || {});
      setRecentUsers(u.map((x, i) => ({
        id: x.id || i,
        name: x.name,
        email: x.email,
        role: x.role,
        roleType: x.roleType,
        phone: x.phone,
        status: x.status || 'active',
        createdAt: x.createdAt,
      })));
      setRecentPayments(p.map((x, _i) => ({
        id: x.id,
        type: x.type,
        user: x.userName || x.userId,
        amount: x.amount,
        status: x.status,
        date: x.date || x.createdAt,
      })));
    }).finally(() => setLoading(false));
  }, []);

  const kpiData = stats ? [
    { title: 'Total Revenue', value: stats.totalRevenue ?? 0, icon: DollarOutlined, prefix: '₹' },
    { title: 'Total Users', value: stats.totalUsers ?? 0, icon: UserOutlined },
    { title: 'Total Blogs Sold', value: stats.totalBlogsSold ?? 0, icon: ShoppingOutlined },
    { title: 'Total Enrollments', value: stats.totalEnrollments ?? 0, icon: BookOutlined },
    { title: 'Patient Care Posts', value: stats.totalPatientCare ?? 0, icon: HeartOutlined },
  ] : [];

  const ROLE_TYPE_LABELS = { student: 'Student', doctor: 'Doctor', patient: 'Patient', health_professional: 'Health Professional' };

  const userColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: 'Email', dataIndex: 'email', key: 'email', ellipsis: true },
    { title: 'Role', dataIndex: 'role', key: 'role', width: 90, render: (v) => (v === 'admin' ? 'Admin' : 'User') },
    { title: 'Role Type', dataIndex: 'roleType', key: 'roleType', width: 130, render: (v) => (v ? ROLE_TYPE_LABELS[v] || v : '—') },
    { title: 'Phone', dataIndex: 'phone', key: 'phone', width: 120, render: (v) => v || '—' },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 90, render: (v) => (v === 'active' ? 'Active' : v || '—') },
    { title: 'Joined', dataIndex: 'createdAt', key: 'createdAt', width: 120, render: (d) => (d ? new Date(d).toLocaleDateString() : '—') },
  ];

  const paymentColumns = [
    { title: 'Type', dataIndex: 'type', key: 'type', width: 100, render: (v) => (v === 'blog_purchase' ? 'Blog' : 'Payment') },
    { title: 'ID', dataIndex: 'id', key: 'id', width: 100, render: (v) => (v ? String(v).slice(-8) : '—') },
    { title: 'User', dataIndex: 'user', key: 'user' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (v) => (v != null ? `₹${v}` : '—') },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Date', dataIndex: 'date', key: 'date', width: 110, render: (d) => (d ? new Date(d).toLocaleDateString() : '—') },
  ];

  return (
    <div className="admin-module-page">
      <h2 className="admin-page-title">Dashboard</h2>
      <div className="admin-dashboard-stats">
        {loading ? (
          [1, 2, 3, 4, 5].map((i) => (
            <Card bordered={false} className="admin-kpi-card" key={i}>
              <Skeleton active paragraph={{ rows: 1 }} />
            </Card>
          ))
        ) : (
          kpiData.map((item) => (
            <Card bordered={false} className="admin-kpi-card" key={item.title}>
              <Statistic
                title={item.title}
                value={item.value}
                prefix={item.prefix || (item.icon && React.createElement(item.icon, { style: { color: BRAND_PRIMARY } }))}
              />
            </Card>
          ))
        )}
      </div>
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={24}>
          <Card title="Recent Users" bordered={false}>
            {loading ? (
              <Skeleton active paragraph={{ rows: 5 }} />
            ) : (
              <Table
                dataSource={recentUsers}
                columns={userColumns}
                rowKey="id"
                pagination={false}
                size="small"
              />
            )}
          </Card>
        </Col>
      </Row>
      <Row style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="Recent Payments" bordered={false}>
            {loading ? (
              <Skeleton active paragraph={{ rows: 5 }} />
            ) : (
              <Table
                dataSource={recentPayments}
                columns={paymentColumns}
                rowKey={(r) => (r.type ? `${r.type}-${r.id}` : r.id)}
                pagination={{ pageSize: 5 }}
                size="small"
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
