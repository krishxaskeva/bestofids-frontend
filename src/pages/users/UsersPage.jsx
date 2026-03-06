import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Input, Select, Tag, Drawer, Descriptions, message, Modal, Skeleton } from 'antd';
import { SearchOutlined, EyeOutlined, StopOutlined, CheckCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { getUsers } from '../../services/apiService';

export default function UsersPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState(undefined);
  const [roleTypeFilter, setRoleTypeFilter] = useState(undefined);
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

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

  const handleBlock = (record) => {
    setData((prev) => prev.map((r) => (r.id === record.id ? { ...r, status: 'blocked' } : r)));
    message.info('Block action (implement API if needed).');
    setDrawerOpen(false);
  };

  const handleUnblock = (record) => {
    setData((prev) => prev.map((r) => (r.id === record.id ? { ...r, status: 'active' } : r)));
    message.info('Unblock action (implement API if needed).');
    setDrawerOpen(false);
  };

  const handleDelete = (record) => {
    setData((prev) => prev.filter((r) => r.id !== record.id));
    message.info('Delete action (implement API if needed).');
    setDrawerOpen(false);
  };

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
      width: 180,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => { setSelectedUser(record); setDrawerOpen(true); }} />
          {record.status === 'active' ? (
            <Button type="link" size="small" icon={<StopOutlined />} onClick={() => handleBlock(record)}>Block</Button>
          ) : (
            <Button type="link" size="small" icon={<CheckCircleOutlined />} onClick={() => handleUnblock(record)}>Unblock</Button>
          )}
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => { Modal.confirm({ title: 'Delete user?', okType: 'danger', onOk: () => handleDelete(record) }); }} />
        </Space>
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
        width={400}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        extra={
          selectedUser && (
            <Space>
              {selectedUser.status === 'active' ? (
                <Button size="small" icon={<StopOutlined />} onClick={() => handleBlock(selectedUser)}>Block</Button>
              ) : (
                <Button size="small" icon={<CheckCircleOutlined />} onClick={() => handleUnblock(selectedUser)}>Unblock</Button>
              )}
              <Button size="small" danger icon={<DeleteOutlined />} onClick={() => { handleDelete(selectedUser); }}>Delete</Button>
            </Space>
          )
        }
      >
        {selectedUser && (
          <Descriptions column={1} bordered size="small">
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
        )}
      </Drawer>
    </div>
  );
}
