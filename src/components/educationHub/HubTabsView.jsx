import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import { BookOutlined, VideoCameraOutlined, PictureOutlined, SoundOutlined } from '@ant-design/icons';
import Section from '../Section';
import Breadcrumb from '../Breadcrumb';
import Spacing from '../Spacing';
import { useAuth } from '../../contexts/AuthContext';
import DescriptionBanner from './DescriptionBanner';
import TabContent from './TabContent';

const HUB_TAB_STORAGE_KEY = 'bestofids_edu_hub_active_tab';

const TABS = [
  { key: 'courses', label: 'Courses & Certification Programs', icon: <BookOutlined /> },
  { key: 'webinars', label: 'Webinars', icon: <VideoCameraOutlined /> },
  { key: 'infographics', label: 'Infographics & Visual Learning', icon: <PictureOutlined /> },
  { key: 'podcasts', label: 'Podcasts (Audio & Video)', icon: <SoundOutlined /> },
];

export default function HubTabsView() {
  const { isSuperAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const saved = localStorage.getItem(HUB_TAB_STORAGE_KEY);
      if (saved && TABS.some((t) => t.key === saved)) return saved;
    } catch (_) {}
    return 'courses';
  });

  const [webinarFilter, setWebinarFilter] = useState('all'); // 'all' | 'live' | 'recorded'

  useEffect(() => {
    try {
      localStorage.setItem(HUB_TAB_STORAGE_KEY, activeTab);
    } catch (_) {}
  }, [activeTab]);

  const tabItems = TABS.map((tab) => ({
    key: tab.key,
    label: (
      <span>
        {tab.icon}
        <span style={{ marginLeft: 8 }}>{tab.label}</span>
      </span>
    ),
    children: (
      <>
        <DescriptionBanner tabKey={tab.key} myLearningUrl={isSuperAdmin ? null : '/my-learning'} />
        <Spacing md="16" lg="14" />
        {tab.key === 'webinars' && (
          <div className="cs_edu_hub_webinar_filters">
            <span className="cs_edu_hub_filter_label">Show:</span>
            <button
              type="button"
              className={`cs_edu_hub_filter_pill ${webinarFilter === 'all' ? 'cs_edu_hub_filter_active' : ''}`}
              onClick={() => setWebinarFilter('all')}
            >
              All
            </button>
            <button
              type="button"
              className={`cs_edu_hub_filter_pill ${webinarFilter === 'live' ? 'cs_edu_hub_filter_active' : ''}`}
              onClick={() => setWebinarFilter('live')}
            >
              Live
            </button>
            <button
              type="button"
              className={`cs_edu_hub_filter_pill ${webinarFilter === 'recorded' ? 'cs_edu_hub_filter_active' : ''}`}
              onClick={() => setWebinarFilter('recorded')}
            >
              Recordings
            </button>
          </div>
        )}
        <TabContent tabKey={tab.key} webinarFilter={tab.key === 'webinars' ? webinarFilter : undefined} />
      </>
    ),
  }));

  return (
    <>
      <Section topMd={140} topLg={95} topXl={75} bottomMd={24} bottomLg={20}>
        <Breadcrumb title="ID Education & Knowledge Hub" />
      </Section>

      <Section topMd={0} topLg={0} topXl={0} bottomMd={48} bottomLg={40} bottomXl={32}>
        <div className="container">
          <div className="cs_edu_hub_tabs_wrap">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems}
              size="large"
              className="cs_edu_hub_ant_tabs"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
