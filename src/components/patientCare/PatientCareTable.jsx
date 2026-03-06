import React from 'react';
import { Table, Button, Space, Input, Select, Tag, Image, Skeleton } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

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
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  categories = [],
}) {

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
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
      title: 'Thumbnail',
      dataIndex: 'thumbnailUrl',
      key: 'thumbnail',
      width: 80,
      render: (url) =>
        url ? (
          <Image src={url} alt="" width={48} height={48} style={{ objectFit: 'cover', borderRadius: 4 }} />
        ) : (
          <span style={{ color: '#999' }}>—</span>
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
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <Space wrap>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => onPreview(record)}
          >
            View
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record)}
          >
            Delete
          </Button>
        </Space>
      ),
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
          placeholder="Status"
          allowClear
          style={{ width: 130 }}
          value={statusFilter}
          onChange={onStatusFilterChange}
        >
          <Select.Option value="published">Published</Select.Option>
          <Select.Option value="draft">Draft</Select.Option>
        </Select>
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
