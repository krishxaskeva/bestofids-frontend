import React, { useState, useEffect } from 'react';
import { Layout, ConfigProvider, message } from 'antd';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { adminTheme } from '../theme/adminTheme';

const { Content } = Layout;

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const root = document.getElementById('admin-message-root');
    if (!root) return;
    message.config({
      getContainer: () => root,
      top: 80,
      duration: 4,
      maxCount: 3,
    });
    return () => {
      message.config({ getContainer: () => document.body, top: 24, duration: 3 });
    };
  }, []);

  return (
    <ConfigProvider theme={adminTheme}>
      <Layout style={{ minHeight: '100vh' }}>
        <AdminSidebar collapsed={collapsed} />
        <Layout style={{ marginLeft: collapsed ? 80 : 260, transition: 'margin-left 0.2s' }}>
          <AdminHeader collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
          <Content className="admin-content">
            <div
              id="admin-message-root"
              className="admin-message-root"
              aria-live="polite"
            />
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
