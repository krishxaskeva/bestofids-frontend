import React from 'react';
import { Card, Tabs } from 'antd';
import { BookOutlined, VideoCameraOutlined, PictureOutlined, SoundOutlined, TeamOutlined } from '@ant-design/icons';
import CoursesTab from './CoursesTab';
import WebinarsTab from './WebinarsTab';
import InfographicsTab from './InfographicsTab';
import PodcastsTab from './PodcastsTab';
import EnrollmentsTab from './EnrollmentsTab';

const tabs = [
  { key: 'courses', label: 'Courses', children: <CoursesTab />, icon: <BookOutlined /> },
  { key: 'webinars', label: 'Webinars', children: <WebinarsTab />, icon: <VideoCameraOutlined /> },
  { key: 'infographics', label: 'Infographics', children: <InfographicsTab />, icon: <PictureOutlined /> },
  { key: 'podcasts', label: 'Podcasts', children: <PodcastsTab />, icon: <SoundOutlined /> },
  { key: 'enrollments', label: 'Enrollments', children: <EnrollmentsTab />, icon: <TeamOutlined /> },
];

export default function EducationPage() {
  return (
    <div>
      <h2 style={{ marginBottom: 24, fontWeight: 600 }}>Education & Knowledge Hub</h2>
      <Card>
        <Tabs
          defaultActiveKey="courses"
          items={tabs.map((t) => ({
            key: t.key,
            label: (
              <span>
                {t.icon}
                <span style={{ marginLeft: 8 }}>{t.label}</span>
              </span>
            ),
            children: t.children,
          }))}
        />
      </Card>
    </div>
  );
}
