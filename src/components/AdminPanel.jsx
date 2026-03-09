import React from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from './Breadcrumb';
import Section from './Section';
import { useAuth } from '../store/hooks';
import { pageTitle } from '../utils/PageTitle';
import { Icon } from '@iconify/react';

export default function AdminPanel() {
  pageTitle('Admin Panel');
  const { isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isSuperAdmin) {
      navigate('/login/admin', { replace: true });
    }
  }, [isSuperAdmin, navigate]);

  if (!isSuperAdmin) {
    return null;
  }

  return (
    <>
      <Section topMd={140} topLg={95} topXl={75} bottomMd={24} bottomLg={20}>
        <Breadcrumb title="Admin Panel" />
      </Section>
      <Section topMd={60} topLg={50} topXl={40} bottomMd={120} bottomLg={100} bottomXl={80}>
        <div className="container">
          <div className="cs_admin_panel_card cs_white_bg cs_radius_30 p-4 p-lg-5">
            <h2 className="cs_heading_color cs_fs_28 cs_semibold mb-4">
              <Icon icon="mdi:cog" className="me-2" aria-hidden />
              Admin Panel
            </h2>
            <p className="cs_heading_color opacity-75 mb-0">
              Welcome to the admin panel. You are signed in as super admin. Add your admin content and tools here.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
