import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Section from '../../components/Section';
import Breadcrumb from '../../components/Breadcrumb';
import SectionHeading from '../../components/SectionHeading';
import Spacing from '../../components/Spacing';
import { pageTitle } from '../../utils/PageTitle';
import { useAuth } from '../../store/hooks';
import { getProfile, getUserEnrollments, getPurchasedBlogs } from '../../services/userService';
import { Card, Spin, Descriptions, Empty, Row, Col, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getAssetUrl } from '../../config';

const ROLE_LABELS = {
  student: 'Student',
  doctor: 'Doctor',
  patient: 'Patient',
  health_professional: 'Health Professional',
};

export default function ProfilePage() {
  pageTitle('Profile');
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [purchasedBlogs, setPurchasedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProfile().catch(() => null),
      getUserEnrollments().catch(() => []),
      getPurchasedBlogs().catch(() => []),
    ]).then(([p, e, b]) => {
      setProfile(p || null);
      setEnrollments(Array.isArray(e) ? e : []);
      setPurchasedBlogs(Array.isArray(b) ? b : []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <Section topMd={140} topLg={95} topXl={75} bottomMd={24} bottomLg={20}>
          <Breadcrumb title="Profile" />
        </Section>
        <div className="container text-center py-5">
          <Spin size="large" />
        </div>
      </>
    );
  }

  const displayName = profile?.name || user?.name || 'User';
  const displayEmail = profile?.email || user?.email || '';
  const displayRole = profile?.roleType ? ROLE_LABELS[profile.roleType] || profile.roleType : (user?.roleType && ROLE_LABELS[user.roleType]) || user?.roleType || '—';
  const joinedDate = profile?.createdAt ? dayjs(profile.createdAt).format('MMMM D, YYYY') : (user?.createdAt && dayjs(user.createdAt).format('MMMM D, YYYY')) || '—';

  return (
    <>
      <Section topMd={140} topLg={95} topXl={75} bottomMd={24} bottomLg={20}>
        <Breadcrumb title="Profile" />
      </Section>
      <Section topMd={0} topLg={0} topXl={0} bottomMd={72} bottomLg={60} bottomXl={50}>
        <div className="container">
          <SectionHeading title="My Profile" subTitle="Your account and activity." center />
          <Spacing md="36" lg="28" />

          <Card title="Account" className="mb-4" style={{ maxWidth: 560 }}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Name">{displayName}</Descriptions.Item>
              <Descriptions.Item label="Email">{displayEmail}</Descriptions.Item>
              <Descriptions.Item label="Role">{displayRole}</Descriptions.Item>
              <Descriptions.Item label="Phone">{profile?.phone || user?.phone || '—'}</Descriptions.Item>
              <Descriptions.Item label="Joined">{joinedDate}</Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="My Enrollments" className="mb-4">
            {enrollments.length > 0 ? (
              <ul className="list-unstyled mb-0">
                {enrollments.map((e) => (
                  <li key={e.id} className="mb-2">
                    <Link to="/id-education-knowledge-hub">
                      {e.title || 'Course'}
                    </Link>
                    {e.contentLink && (
                      <a
                        href={e.contentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ms-2 small"
                      >
                        View content →
                      </a>
                    )}
                    <span className="text-muted small ms-2">
                      Enrolled {e.enrollDate ? dayjs(e.enrollDate).format('MMM D, YYYY') : ''}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty description="No enrollments yet." />
            )}
          </Card>

          <Card title="My Purchased Blogs" className="mb-4">
            {purchasedBlogs.length > 0 ? (
              <Row gutter={[24, 24]}>
                {purchasedBlogs.map((p) => {
                  const href = `/blog/${p.blogId}`;
                  const coverUrl = p.coverImage || getAssetUrl('/images/blog/post_1.jpeg');
                  return (
                    <Col xs={24} sm={12} lg={8} key={p.id}>
                      <Card
                        hoverable
                        style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
                        cover={
                          <Link to={href}>
                            <img
                              alt={p.title}
                              src={coverUrl.startsWith('http') ? coverUrl : getAssetUrl(coverUrl)}
                              style={{ width: '100%', height: 180, objectFit: 'cover' }}
                            />
                          </Link>
                        }
                        bodyStyle={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column' }}
                      >
                        <h3 className="cs_semibold m-0" style={{ fontSize: 16, marginBottom: 8, lineHeight: 1.3 }}>
                          <Link to={href}>{p.title || 'Blog'}</Link>
                        </h3>
                        <p className="cs_heading_color m-0 small" style={{ marginBottom: 12 }}>
                          {p.author || 'Author'} · Purchased {p.purchaseDate ? dayjs(p.purchaseDate).format('MMM D, YYYY') : ''}
                        </p>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          <Button type="primary" size="small" onClick={() => navigate(href)}>
                            Read Now
                          </Button>
                          {p.pdfUrl && (
                            <Button
                              size="small"
                              icon={<DownloadOutlined />}
                              href={p.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                            >
                              Download PDF
                            </Button>
                          )}
                        </div>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            ) : (
              <Empty description="No purchased blogs yet." />
            )}
          </Card>

          <Card title="Account Settings">
            <p className="cs_heading_color mb-0">
              Password and security settings can be updated here in a future release.
            </p>
          </Card>
        </div>
      </Section>
      <Spacing md="200" lg="150" xl="110" />
    </>
  );
}
