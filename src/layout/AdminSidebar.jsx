import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  BookOutlined,
  HeartOutlined,
  UserOutlined,
  DollarOutlined,
  FileTextOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const menuItems = [
  { key: '/admin', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/admin/patient-care', icon: <HeartOutlined />, label: 'Patient Care' },
  { key: '/admin/blog', icon: <FileTextOutlined />, label: 'Blog' },
  { key: '/admin/education', icon: <BookOutlined />, label: 'Education & Knowledge Hub' },
  { key: '/admin/users', icon: <UserOutlined />, label: 'Users' },
  { key: '/admin/payments', icon: <DollarOutlined />, label: 'Payments' },
];

export default function AdminSidebar({ collapsed }) {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedKey = location.pathname === '/admin' ? '/admin' : location.pathname;

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={260}
      className="admin-sidebar"
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1000,
      }}
    >
      <div
        className={`admin-sidebar-brand ${collapsed ? 'collapsed' : ''}`}
        style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
      >
        {collapsed ? 'AD' : 'Admin Panel'}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        style={{ borderRight: 0 }}
      />
    </Sider>
  );
}

export { MenuFoldOutlined, MenuUnfoldOutlined };
