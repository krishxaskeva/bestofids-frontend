import React, { useState, useEffect } from 'react';
import { Card, Tabs, Form, Input, Button, message, Skeleton } from 'antd';
import { getCmsPages, upsertCmsPage } from '../../services/apiService';
import { CloudinaryUploadField } from '../../components/educationHub/CloudinaryUploadField';

const { TextArea } = Input;

const pageKeys = [
  'home',
  'about',
  'contact',
  'our-services',
  'doctors',
  'gallery',
  'timetable',
  'privacy',
  'terms',
  'footer',
];

const pageLabels = {
  home: 'Home Page',
  about: 'About Us',
  contact: 'Contact Page',
  'our-services': 'Our Services',
  doctors: 'Doctor & Hospital Services',
  gallery: 'Gallery',
  timetable: 'Timetable',
  privacy: 'Privacy Policy',
  terms: 'Terms & Conditions',
  footer: 'Footer Content',
};

const defaultData = {
  title: '',
  description: '',
  content: '',
  banner: null,
  seoTitle: '',
  seoDescription: '',
};

export default function CMSPage() {
  const [content, setContent] = useState({});
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    getCmsPages()
      .then((pages) => {
        const bySlug = {};
        pages.forEach((p) => {
          bySlug[p.slug] = { ...defaultData, ...(p.data || {}) };
        });
        pageKeys.forEach((key) => {
          if (!bySlug[key]) bySlug[key] = { ...defaultData };
        });
        setContent(bySlug);
      })
      .catch(() => message.error('Failed to load CMS'))
      .finally(() => setLoading(false));
  }, []);

  const current = content[activeTab] || defaultData;

  useEffect(() => {
    form.setFieldsValue(current);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only sync when tab or content changes
  }, [activeTab, content]);

  const handleSave = () => {
    form.validateFields().then((values) => {
      upsertCmsPage({ slug: activeTab, title: values.title || activeTab, data: values })
        .then(() => message.success('Content saved.'))
        .catch((err) => message.error(err.message || 'Save failed'));
    });
  };

  const tabItems = pageKeys.map((key) => ({
    key,
    label: pageLabels[key],
    children: (
      <Form
        form={form}
        layout="vertical"
        initialValues={content[key] || defaultData}
        onValuesChange={(_, all) => {
          setContent((prev) => ({ ...prev, [activeTab]: { ...prev[activeTab], ...all } }));
        }}
      >
        <Form.Item name="title" label="Page title">
          <Input placeholder="Page title" />
        </Form.Item>
        <Form.Item name="description" label="Short description">
          <Input placeholder="Short description" />
        </Form.Item>
        <Form.Item name="content" label="Main content">
          <TextArea rows={6} placeholder="Page content (HTML or plain text)" />
        </Form.Item>
        <CloudinaryUploadField form={form} name="banner" label="Banner / Image" resourceType="image" accept="image/*" />
        <Card size="small" title="SEO Metadata" style={{ marginBottom: 16 }}>
          <Form.Item name="seoTitle" label="Meta title">
            <Input placeholder="SEO title" />
          </Form.Item>
          <Form.Item name="seoDescription" label="Meta description">
            <TextArea rows={2} placeholder="SEO description" />
          </Form.Item>
        </Card>
        <Button type="primary" onClick={handleSave}>
          Save changes
        </Button>
      </Form>
    ),
  }));

  return (
    <div>
      <h2 style={{ marginBottom: 24, fontWeight: 600 }}>CMS – Content Management System</h2>
      <Card>
        {loading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : (
          <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
        )}
      </Card>
    </div>
  );
}
