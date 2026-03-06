import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Input, Select, Tag, Drawer, Descriptions, message, Skeleton, List } from 'antd';
import { SearchOutlined, EyeOutlined, BookOutlined, FileTextOutlined } from '@ant-design/icons';
import { getUsers, getUserEnrollments, getUserPurchasedBlogs } from '../../services/apiService';
import dayjs from 'dayjs';

export default function UsersPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState(undefined);
  const [roleTypeFilter, setRoleTypeFilter] = useState(undefined);
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [purchasedBlogs, setPurchasedBlogs] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);

  const ROLE_TYPE_LABELS = {
    student: 'Student',
    doctor: 'Doctor',
    patient: 'Patient',
    health_professional: 'Health Professional',
  };

  useEffect(() => {
    getUsers()
      .then(setData)
      .catch(() => message.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedUser?.id || !drawerOpen) {
      setEnrollments([]);
      setPurchasedBlogs([]);
      return;
    }
    setDetailLoading(true);
    Promise.all([
      getUserEnrollments(selectedUser.id).catch(() => []),
      getUserPurchasedBlogs(selectedUser.id).catch(() => []),
    ])
      .then(([enr, blogs]) => {
        setEnrollments(enr);
        setPurchasedBlogs(blogs);
      })
      .finally(() => setDetailLoading(false));
  }, [selectedUser?.id, drawerOpen]);

  const filteredData = data.filter((row) => {
    const matchSearch =
      !searchText ||
      (row.name && row.name.toLowerCase().includes(searchText.toLowerCase())) ||
      (row.email && row.email.toLowerCase().includes(searchText.toLowerCase()));
    const matchRole = roleFilter == null || row.role === roleFilter;
    const matchRoleType = roleTypeFilter == null || row.roleType === roleTypeFilter;
    const matchStatus = statusFilter == null || (row.status || 'active') === statusFilter;
    return matchSearch && matchRole && matchRoleType && matchStatus;
  }).map((row) => ({ ...row, joinedDate: row.createdAt, status: row.status || 'active' }));

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name', sorter: (a, b) => (a.name || '').localeCompare(b.name || '') },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Role',
      key: 'role',
      width: 140,
      render: (_, record) => {
        if (record.role === 'admin') return <Tag color="blue">Admin</Tag>;
        const label = record.roleType ? ROLE_TYPE_LABELS[record.roleType] || record.roleType : 'User';
        return <Tag color="default">{label}</Tag>;
      },
    },
    { title: 'Joined Date', dataIndex: 'joinedDate', key: 'joinedDate', width: 120 },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>{status}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => { setSelectedUser(record); setDrawerOpen(true); }}>View</Button>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24, fontWeight: 600 }}>Users</h2>
      <Card>
        <Space wrap style={{ marginBottom: 16 }}>
          <Input
            placeholder="Search by name or email"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 220 }}
            allowClear
          />
          <Select
            placeholder="Role"
            allowClear
            style={{ width: 120 }}
            value={roleFilter}
            onChange={setRoleFilter}
          >
            <Select.Option value="user">User</Select.Option>
            <Select.Option value="admin">Admin</Select.Option>
          </Select>
          <Select
            placeholder="Role type"
            allowClear
            style={{ width: 160 }}
            value={roleTypeFilter}
            onChange={setRoleTypeFilter}
          >
            <Select.Option value="student">Student</Select.Option>
            <Select.Option value="doctor">Doctor</Select.Option>
            <Select.Option value="patient">Patient</Select.Option>
            <Select.Option value="health_professional">Health Professional</Select.Option>
          </Select>
          <Select
            placeholder="Status"
            allowClear
            style={{ width: 120 }}
            value={statusFilter}
            onChange={setStatusFilter}
          >
            <Select.Option value="active">Active</Select.Option>
            <Select.Option value="blocked">Blocked</Select.Option>
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
      </Card>
      <Drawer
        title="User profile"
        placement="right"
        width={480}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {selectedUser && (
          <>
            <Descriptions column={1} bordered size="small" style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Name">{selectedUser.name}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedUser.email}</Descriptions.Item>
              <Descriptions.Item label="Role">
                {selectedUser.role === 'admin' ? 'Admin' : (ROLE_TYPE_LABELS[selectedUser.roleType] || selectedUser.roleType || 'User')}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">{selectedUser.phone || '—'}</Descriptions.Item>
              <Descriptions.Item label="Joined">{selectedUser.joinedDate}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={selectedUser.status === 'active' ? 'green' : 'red'}>{selectedUser.status}</Tag>
              </Descriptions.Item>
            </Descriptions>

            {detailLoading ? (
              <Skeleton active paragraph={{ rows: 4 }} />
            ) : (
              <>
                <h4 style={{ marginBottom: 8, fontWeight: 600 }}>
                  <BookOutlined style={{ marginRight: 6 }} />
                  Enrolled in ({enrollments.length})
                </h4>
                {enrollments.length === 0 ? (
                  <p style={{ color: '#999', marginBottom: 20 }}>No enrollments</p>
                ) : (
                  <List
                    size="small"
                    dataSource={enrollments}
                    renderItem={(e) => (
                      <List.Item>
                        <div>
                          <div style={{ fontWeight: 500 }}>{e.title || '—'}</div>
                          <div style={{ fontSize: 12, color: '#666' }}>
                            {e.category && <Tag style={{ marginRight: 4 }}>{e.category}</Tag>}
                            {e.enrollDate && dayjs(e.enrollDate).format('MMM D, YYYY')}
                          </div>
                        </div>
                      </List.Item>
                    )}
                    style={{ marginBottom: 24 }}
                  />
                )}

                <h4 style={{ marginBottom: 8, fontWeight: 600 }}>
                  <FileTextOutlined style={{ marginRight: 6 }} />
                  Purchased blogs ({purchasedBlogs.length})
                </h4>
                {purchasedBlogs.length === 0 ? (
                  <p style={{ color: '#999' }}>No blog purchases</p>
                ) : (
                  <List
                    size="small"
                    dataSource={purchasedBlogs}
                    renderItem={(p) => (
                      <List.Item>
                        <div>
                          <div style={{ fontWeight: 500 }}>{p.title || '—'}</div>
                          <div style={{ fontSize: 12, color: '#666' }}>
                            {p.amount != null && `₹${p.amount}`}
                            {p.purchaseDate && ` · ${dayjs(p.purchaseDate).format('MMM D, YYYY')}`}
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />
                )}
              </>
            )}
          </>
        )}
      </Drawer>
    </div>
  );
}
