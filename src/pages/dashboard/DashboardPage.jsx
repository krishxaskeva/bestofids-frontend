import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Statistic, Skeleton } from 'antd';
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
      getStats().catch(() => null),
      getUsers().then((u) => u.slice(0, 5)).catch(() => []),
      getPayments().then((p) => p.slice(0, 5)).catch(() => []),
    ]).then(([s, u, p]) => {
      setStats(s || {});
      setRecentUsers(u.map((x, i) => ({ id: x.id || i, name: x.name, email: x.email, date: x.createdAt })));
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
    { title: 'Total Users', value: stats.totalUsers ?? 0, icon: UserOutlined },
    { title: 'Total Blogs Sold', value: stats.totalBlogsSold ?? 0, icon: ShoppingOutlined },
    { title: 'Total Enrollments', value: stats.totalEnrollments ?? 0, icon: BookOutlined },
    { title: 'Patient Care Posts', value: stats.totalPatientCare ?? 0, icon: HeartOutlined },
    { title: 'Total Revenue', value: stats.totalRevenue ?? 0, icon: DollarOutlined, prefix: '₹' },
  ] : [];

  const userColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Joined', dataIndex: 'date', key: 'date', width: 120 },
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
    <div>
      <h2 className="admin-page-title">Dashboard</h2>
      <Row gutter={[16, 16]}>
        {loading ? (
          [1, 2, 3, 4, 5].map((i) => (
            <Col xs={24} sm={12} lg={8} key={i}>
              <Card bordered={false} className="admin-kpi-card">
                <Skeleton active paragraph={{ rows: 1 }} />
              </Card>
            </Col>
          ))
        ) : (
          kpiData.map((item) => (
            <Col xs={24} sm={12} lg={8} key={item.title}>
              <Card bordered={false} className="admin-kpi-card">
                <Statistic
                  title={item.title}
                  value={item.value}
                  prefix={item.prefix || (item.icon && React.createElement(item.icon, { style: { color: BRAND_PRIMARY } }))}
                />
              </Card>
            </Col>
          ))
        )}
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={14}>
          <Card title="Revenue" bordered={false}>
            {loading ? <Skeleton active paragraph={{ rows: 1 }} /> : <Statistic title="Total Revenue" value={stats?.totalRevenue ?? 0} prefix="₹" />}
          </Card>
        </Col>
        <Col xs={24} lg={10}>
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
