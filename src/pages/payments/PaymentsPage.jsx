import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Select, DatePicker, Drawer, Descriptions, Skeleton, Tabs } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getPayments, getBlogPurchases } from '../../services/apiService';

const { RangePicker } = DatePicker;

export default function PaymentsPage() {
  const [data, setData] = useState([]);
  const [blogPurchases, setBlogPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [blogPurchasesLoading, setBlogPurchasesLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [dateRange, setDateRange] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [activeTab, setActiveTab] = useState('payments');

  useEffect(() => {
    getPayments()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (activeTab !== 'blog-purchases') return;
    setBlogPurchasesLoading(true);
    getBlogPurchases()
      .then(setBlogPurchases)
      .catch(() => setBlogPurchases([]))
      .finally(() => setBlogPurchasesLoading(false));
  }, [activeTab]);

  const filteredData = data.filter((row) => {
    const status = (row.status || '').toLowerCase();
    const matchStatus = statusFilter == null || status === (statusFilter || '').toLowerCase();
    let matchDate = true;
    if (dateRange && dateRange[0] && dateRange[1]) {
      const d = row.createdAt ? dayjs(row.createdAt) : null;
      if (d) matchDate = (d.isAfter(dateRange[0]) || d.isSame(dateRange[0], 'day')) && (d.isBefore(dateRange[1]) || d.isSame(dateRange[1], 'day'));
    }
    return matchStatus && matchDate;
  }).map((row) => ({
    ...row,
    user: row.userName || row.userId || '—',
    date: row.createdAt ? dayjs(row.createdAt).format('YYYY-MM-DD') : '—',
    status: (row.status || '').charAt(0).toUpperCase() + (row.status || '').slice(1),
  }));

  const columns = [
    { title: 'Transaction ID', dataIndex: 'id', key: 'id', width: 110 },
    { title: 'User', dataIndex: 'user', key: 'user' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (v) => (v != null ? `₹${v}` : '—'), width: 90 },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status) => {
        const colors = { Completed: 'green', Pending: 'orange', Failed: 'red' };
        return <span style={{ color: colors[status] || '#000' }}>{status}</span>;
      },
    },
    { title: 'Date', dataIndex: 'date', key: 'date', width: 110 },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      render: (_, record) => (
        <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => { setSelectedPayment(record); setDrawerOpen(true); }} />
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24, fontWeight: 600 }}>Payments</h2>
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'payments',
              label: 'Payments',
              children: (
                <>
                  <Space wrap style={{ marginBottom: 16 }}>
                    <RangePicker value={dateRange} onChange={setDateRange} />
                    <Select
                      placeholder="Payment status"
                      allowClear
                      style={{ width: 140 }}
                      value={statusFilter}
                      onChange={setStatusFilter}
                    >
                      <Select.Option value="Completed">Completed</Select.Option>
                      <Select.Option value="Pending">Pending</Select.Option>
                      <Select.Option value="Failed">Failed</Select.Option>
                    </Select>
                  </Space>
                  {loading ? (
                    <Skeleton active paragraph={{ rows: 8 }} />
                  ) : (
                    <Table
                      dataSource={filteredData}
                      columns={columns}
                      rowKey="id"
                      pagination={{ pageSize: 10, showSizeChanger: true }}
                    />
                  )}
                </>
              ),
            },
            {
              key: 'blog-purchases',
              label: 'Blog Purchases',
              children: blogPurchasesLoading ? (
                <Skeleton active paragraph={{ rows: 8 }} />
              ) : (
                <Table
                  dataSource={blogPurchases.map((row) => ({
                    ...row,
                    purchaseDateFormatted: row.purchaseDate ? dayjs(row.purchaseDate).format('MMM D, YYYY') : '—',
                  }))}
                  columns={[
                    { title: 'User Name', dataIndex: 'userName', key: 'userName' },
                    { title: 'User Email', dataIndex: 'userEmail', key: 'userEmail' },
                    { title: 'Blog Title', dataIndex: 'blogTitle', key: 'blogTitle', ellipsis: true },
                    { title: 'Amount (₹)', dataIndex: 'amount', key: 'amount', width: 100, render: (v) => (v != null ? `₹${v}` : '—') },
                    { title: 'Razorpay Payment ID', dataIndex: 'razorpayPaymentId', key: 'razorpayPaymentId', ellipsis: true },
                    { title: 'Purchase Date', dataIndex: 'purchaseDateFormatted', key: 'purchaseDate', width: 120 },
                  ]}
                  rowKey="id"
                  pagination={{ pageSize: 10, showSizeChanger: true }}
                />
              ),
            },
          ]}
        />
      </Card>
      <Drawer
        title="Payment details"
        placement="right"
        width={380}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {selectedPayment && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Transaction ID">{String(selectedPayment.id).slice(-12)}</Descriptions.Item>
            <Descriptions.Item label="User">{selectedPayment.user}</Descriptions.Item>
            <Descriptions.Item label="Amount">₹{selectedPayment.amount}</Descriptions.Item>
            <Descriptions.Item label="Status">{selectedPayment.status}</Descriptions.Item>
            <Descriptions.Item label="Date">{selectedPayment.date}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </div>
  );
}
