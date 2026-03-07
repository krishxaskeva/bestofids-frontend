import React, { useState, useEffect } from 'react';
import { Layout, ConfigProvider, message } from 'antd';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { adminTheme } from '../theme/adminTheme';

const { Content } = Layout;

const MOBILE_BREAKPOINT = 991;

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= MOBILE_BREAKPOINT);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const mainMarginLeft = isMobile ? 0 : (collapsed ? 80 : 260);

  useEffect(() => {
    const root = document.getElementById('admin-message-root');
    if (!root) return;
    message.config({
      getContainer: () => root,
      top: 24,
      duration: 3,
      maxCount: 5,
    });
    return () => {
      message.config({ getContainer: () => document.body, top: 24, duration: 3 });
    };
  }, []);

  return (
    <ConfigProvider theme={adminTheme}>
      <Layout
        style={{ minHeight: '100vh', display: 'flex', flexDirection: 'row' }}
        className={`admin-layout-wrapper ${isMobile ? 'admin-layout-mobile' : ''}`}
      >
        <AdminSidebar collapsed={collapsed} />
        <Layout
          style={{
            marginLeft: mainMarginLeft,
            transition: 'margin-left 0.2s',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
          }}
          className="admin-main-layout"
        >
          <AdminHeader collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
          <Content className="admin-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div
              id="admin-message-root"
              className="admin-message-root"
              aria-live="polite"
            />
            <Outlet />
          </Content>
        </Layout>
        {isMobile && !collapsed && (
          <div
            className="admin-sidebar-overlay"
            role="button"
            tabIndex={0}
            onClick={() => setCollapsed(true)}
            onKeyDown={(e) => e.key === 'Escape' && setCollapsed(true)}
            aria-label="Close menu"
          />
        )}
      </Layout>
    </ConfigProvider>
  );
}
