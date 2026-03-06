import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Select, DatePicker, Drawer, Descriptions, Skeleton } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getPayments } from '../../services/apiService';

const { RangePicker } = DatePicker;

export default function PaymentsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [typeFilter, setTypeFilter] = useState(undefined);
  const [dateRange, setDateRange] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    setLoading(true);
    getPayments()
      .then(setData)
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredData = data.filter((row) => {
    const status = (row.status || '').toLowerCase();
    const matchStatus = statusFilter == null || status === (statusFilter || '').toLowerCase();
    const matchType = typeFilter == null || row.type === typeFilter;
    let matchDate = true;
    if (dateRange && dateRange[0] && dateRange[1]) {
      const d = row.date ? dayjs(row.date) : null;
      if (d) matchDate = (d.isAfter(dateRange[0]) || d.isSame(dateRange[0], 'day')) && (d.isBefore(dateRange[1]) || d.isSame(dateRange[1], 'day'));
    }
    return matchStatus && matchType && matchDate;
  }).map((row) => ({
    ...row,
    user: row.userName || row.userId || '—',
    dateFormatted: row.date ? dayjs(row.date).format('YYYY-MM-DD') : '—',
    statusDisplay: (row.status || '').charAt(0).toUpperCase() + (row.status || '').slice(1),
    typeDisplay: row.type === 'blog_purchase' ? 'Blog Purchase' : 'Payment',
  }));

  const columns = [
    { title: 'Type', dataIndex: 'typeDisplay', key: 'typeDisplay', width: 120 },
    { title: 'Transaction ID', dataIndex: 'id', key: 'id', width: 110, render: (id) => (id ? String(id).slice(-12) : '—') },
    { title: 'User', dataIndex: 'user', key: 'user', ellipsis: true },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', width: 90, render: (v) => (v != null ? `₹${v}` : '—') },
    {
      title: 'Status',
      dataIndex: 'statusDisplay',
      key: 'status',
      width: 110,
      render: (status) => {
        const colors = { Completed: 'green', Pending: 'orange', Failed: 'red', Refunded: 'default' };
        return <span style={{ color: colors[status] || '#000' }}>{status}</span>;
      },
    },
    { title: 'Date', dataIndex: 'dateFormatted', key: 'date', width: 110 },
    {
      title: 'Blog / Reference',
      key: 'blogOrRef',
      ellipsis: true,
      render: (_, record) => record.type === 'blog_purchase' ? (record.blogTitle || '—') : (record.referenceId || '—'),
    },
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
        <Space wrap style={{ marginBottom: 16 }}>
          <RangePicker value={dateRange} onChange={setDateRange} />
          <Select
            placeholder="Type"
            allowClear
            style={{ width: 140 }}
            value={typeFilter}
            onChange={setTypeFilter}
          >
            <Select.Option value="payment">Payment</Select.Option>
            <Select.Option value="blog_purchase">Blog Purchase</Select.Option>
          </Select>
          <Select
            placeholder="Status"
            allowClear
            style={{ width: 140 }}
            value={statusFilter}
            onChange={setStatusFilter}
          >
            <Select.Option value="completed">Completed</Select.Option>
            <Select.Option value="pending">Pending</Select.Option>
            <Select.Option value="failed">Failed</Select.Option>
            <Select.Option value="refunded">Refunded</Select.Option>
          </Select>
        </Space>
        {loading ? (
          <Skeleton active paragraph={{ rows: 8 }} />
        ) : (
          <Table
            dataSource={filteredData}
            columns={columns}
            rowKey={(r) => `${r.type}-${r.id}`}
            pagination={{ pageSize: 10, showSizeChanger: true }}
          />
        )}
      </Card>
      <Drawer
        title="Payment details"
        placement="right"
        width={400}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {selectedPayment && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Type">{selectedPayment.typeDisplay}</Descriptions.Item>
            <Descriptions.Item label="Transaction ID">{String(selectedPayment.id).slice(-12)}</Descriptions.Item>
            <Descriptions.Item label="User">{selectedPayment.user}</Descriptions.Item>
            {selectedPayment.userEmail && <Descriptions.Item label="Email">{selectedPayment.userEmail}</Descriptions.Item>}
            <Descriptions.Item label="Amount">₹{selectedPayment.amount}</Descriptions.Item>
            <Descriptions.Item label="Status">{selectedPayment.statusDisplay}</Descriptions.Item>
            <Descriptions.Item label="Date">{selectedPayment.dateFormatted}</Descriptions.Item>
            {selectedPayment.type === 'blog_purchase' && (
              <>
                {selectedPayment.blogTitle && <Descriptions.Item label="Blog">{selectedPayment.blogTitle}</Descriptions.Item>}
                {selectedPayment.razorpayPaymentId && <Descriptions.Item label="Razorpay Payment ID">{selectedPayment.razorpayPaymentId}</Descriptions.Item>}
              </>
            )}
            {selectedPayment.type === 'payment' && selectedPayment.referenceId && (
              <Descriptions.Item label="Reference">{selectedPayment.referenceId}</Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Drawer>
    </div>
  );
}
