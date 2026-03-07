import React, { useState } from 'react';
import { Layout, Dropdown, Badge, Avatar, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  BellOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useAuth } from '../store/hooks';
import { config } from '../config';

const { Header } = Layout;

/** Build full URL for avatar (backend path or external URL). */
function getAvatarUrl(avatar) {
  if (!avatar || typeof avatar !== 'string') return undefined;
  if (avatar.startsWith('http')) return avatar;
  const base = config.backendUrl || config.apiUrl?.replace(/\/api\/?$/, '') || '';
  return base + (avatar.startsWith('/') ? avatar : `/${avatar}`);
}

const notifications = [
  { id: 1, title: 'New user registered', time: '2 min ago' },
  { id: 2, title: 'Payment received', time: '15 min ago' },
  { id: 3, title: 'New blog comment', time: '1 hour ago' },
];

export default function AdminHeader({ collapsed, onToggle }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [notifVisible, setNotifVisible] = useState(false);
  const avatarUrl = getAvatarUrl(user?.avatar);

  const handleLogout = () => {
    logout();
    navigate('/login/admin', { replace: true });
  };

  const userMenuItems = [
    { key: 'website', icon: <GlobalOutlined />, label: 'Website', onClick: () => navigate('/') },
    { key: 'profile', icon: <UserOutlined />, label: 'Profile' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', danger: true, onClick: handleLogout },
  ];

  const notifContent = (
    <div style={{ width: 320, maxHeight: 400, overflow: 'auto' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', fontWeight: 600 }}>
        Notifications
      </div>
      {notifications.map((n) => (
        <div
          key={n.id}
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid #f0f0f0',
            cursor: 'pointer',
          }}
        >
          <div>{n.title}</div>
          <div style={{ fontSize: 12, color: '#999' }}>{n.time}</div>
        </div>
      ))}
    </div>
  );

  return (
    <Header
      className="admin-header"
      style={{
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 999,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
          style: { fontSize: 18, cursor: 'pointer' },
          onClick: onToggle,
        })}
      </div>
      <Space size="large">
        <Dropdown
          dropdownRender={() => notifContent}
          trigger={['click']}
          open={notifVisible}
          onOpenChange={setNotifVisible}
        >
          <Badge count={notifications.length} size="small">
            <BellOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
          </Badge>
        </Dropdown>
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Space style={{ cursor: 'pointer' }}>
            <Avatar src={avatarUrl} icon={<UserOutlined />} alt="" />
            <span>{user?.name || 'Admin'}</span>
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
}
