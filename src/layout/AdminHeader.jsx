import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Layout, Popover, Dropdown, Badge, Avatar, Space } from 'antd';
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
import { getNotifications, getUnreadCount, markAllNotificationsRead } from '../services/notificationService';

const { Header } = Layout;

/** Build full URL for avatar (backend path or external URL). */
function getAvatarUrl(avatar) {
  if (!avatar || typeof avatar !== 'string') return undefined;
  if (avatar.startsWith('http')) return avatar;
  const base = config.backendUrl || config.apiUrl?.replace(/\/api\/?$/, '') || '';
  return base + (avatar.startsWith('/') ? avatar : `/${avatar}`);
}

// No mock – use API
function formatNotificationTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  return d.toLocaleDateString();
}

export default function AdminHeader({ collapsed, onToggle }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [notifVisible, setNotifVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifLoading, setNotifLoading] = useState(false);
  const avatarUrl = getAvatarUrl(user?.avatar);
  const notifRef = useRef(null);

  const fetchUnreadCount = useCallback(() => {
    getUnreadCount()
      .then(setUnreadCount)
      .catch(() => setUnreadCount(0));
  }, []);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  useEffect(() => {
    if (notifVisible) {
      setNotifLoading(true);
      getNotifications()
        .then(setNotifications)
        .catch(() => setNotifications([]))
        .finally(() => setNotifLoading(false));
    }
  }, [notifVisible]);

  const handleMarkAllRead = useCallback(() => {
    markAllNotificationsRead()
      .then(() => {
        setUnreadCount(0);
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setNotifVisible(false);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!notifVisible) return;
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        const trigger = document.querySelector('.admin-header .ant-badge');
        if (trigger && trigger.contains(e.target)) return;
        setNotifVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notifVisible]);

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
    <div ref={notifRef} style={{ width: 320, maxWidth: 'calc(100vw - 24px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <span style={{ fontWeight: 600, fontSize: 15 }}>Notifications</span>
        {unreadCount > 0 && (
          <button type="button" className="admin-notification-dropdown-mark-all" onClick={handleMarkAllRead}>
            Mark all as read
          </button>
        )}
      </div>
      <div style={{ maxHeight: 360, overflowY: 'auto' }}>
        {notifLoading ? (
          <div style={{ padding: '24px 16px', textAlign: 'center', color: '#6b7c85', fontSize: 14 }}>Loading…</div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: '24px 16px', textAlign: 'center', color: '#6b7c85', fontSize: 14 }}>No notifications</div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
                borderLeft: n.read ? 'none' : '3px solid #117574',
                paddingLeft: n.read ? 16 : 13,
                background: n.read ? 'transparent' : 'rgba(17, 117, 116, 0.03)',
                opacity: n.read ? 0.85 : 1,
              }}
            >
              <div style={{ fontWeight: n.read ? 500 : 600, fontSize: 14, color: '#3d4f5c' }}>{n.message}</div>
              <div style={{ fontSize: 12, color: '#6b7c85', marginTop: 4 }}>{formatNotificationTime(n.createdAt)}</div>
            </div>
          ))
        )}
      </div>
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
      <div className="admin-header-right-actions">
        <div className="admin-header-icon-wrap">
          <Popover
            content={notifContent}
            trigger="click"
            open={notifVisible}
            onOpenChange={setNotifVisible}
            placement="bottomRight"
            getPopupContainer={() => document.body}
          >
            <Badge count={unreadCount} size="small" offset={[-2, 2]} className="admin-header-notif-badge">
              <span className="admin-header-bell-wrap">
                <BellOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
              </span>
            </Badge>
          </Popover>
        </div>
        <div className="admin-header-icon-wrap">
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }} size="small">
              <Avatar src={avatarUrl} icon={<UserOutlined />} alt="" size={32} />
              <span>{user?.name || 'Admin'}</span>
            </Space>
          </Dropdown>
        </div>
      </div>
    </Header>
  );
}
