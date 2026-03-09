import React from 'react';
import { Table, Button, Space, Input, Select, Tag, Image, Skeleton, Dropdown } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, EllipsisOutlined } from '@ant-design/icons';

const categoryColorMap = {
  'Health Tips': 'green',
  'Patient Guidelines': 'blue',
  'Announcements': 'orange',
  'Awareness Campaigns': 'purple',
  'Treatment Updates': 'cyan',
};

export default function PatientCareTable({
  dataSource,
  loading,
  onEdit,
  onDelete,
  onPreview,
  searchValue,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  categories = [],
}) {

  const columns = [
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnailUrl',
      key: 'thumbnail',
      width: 90,
      render: (url) =>
        url ? (
          <Image src={url} alt="" width={48} height={48} style={{ objectFit: 'cover', borderRadius: 4 }} />
        ) : (
          <span style={{ color: '#999' }}>—</span>
        ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 220,
      ellipsis: true,
      render: (text) => text || '—',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 160,
      render: (cat) =>
        cat ? (
          <Tag color={categoryColorMap[cat] || 'default'}>{cat}</Tag>
        ) : (
          '—'
        ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (s) => (
        <Tag color={s === 'published' ? 'green' : 'default'}>{s || 'draft'}</Tag>
      ),
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      fixed: 'right',
      render: (_, record) => {
        const menuItems = [
          { key: 'view', icon: <EyeOutlined />, label: 'View', onClick: () => onPreview(record) },
          { key: 'edit', icon: <EditOutlined />, label: 'Edit', onClick: () => onEdit(record) },
          { key: 'delete', icon: <DeleteOutlined />, label: 'Delete', danger: true, onClick: () => onDelete(record) },
        ];
        return (
          <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
            <Button
              type="text"
              size="small"
              icon={<EllipsisOutlined style={{ fontSize: 18, transform: 'rotate(90deg)' }} />}
              aria-label="Actions"
            />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <>
      <Space wrap style={{ marginBottom: 16 }} className="patient-care-filters">
        <Input.Search
          placeholder="Search by title"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          onSearch={onSearchChange}
          allowClear
          style={{ width: 220 }}
        />
        <Select
          placeholder="Category"
          allowClear
          style={{ width: 180 }}
          value={categoryFilter}
          onChange={onCategoryFilterChange}
        >
          {categories.map((c) => (
            <Select.Option key={c.value} value={c.value}>
              {c.label}
            </Select.Option>
          ))}
        </Select>
      </Space>
      {loading ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : (
      <Table
        className="patient-care-table"
        dataSource={dataSource}
        columns={columns}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} posts`,
        }}
        scroll={{ x: 900 }}
      />
      )}
    </>
  );
}
