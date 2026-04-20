import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Row, Col, Card, Button, Tabs, Tag, Spin, message, Modal, Form, Input } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import Section from './Section';
import Breadcrumb from './Breadcrumb';
import SectionHeading from './SectionHeading';
import Spacing from './Spacing';
import { pageTitle } from '../utils/PageTitle';
import { useAuth } from '../store/hooks';
import { getBlogs } from '../services/blogService';
import { getPurchasedBlogs } from '../services/userService';
import { getAssetUrl } from '../config';
import LoginModal from './auth/LoginModal';
import dayjs from 'dayjs';
import apiClient from '../api/client';

const SITE_TEAL = '#117574';
const { TextArea } = Input;

export default function BlogList() {
  pageTitle('Blog');
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, isSuperAdmin } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [purchasedBlogs, setPurchasedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [selectedPurchaseBlog, setSelectedPurchaseBlog] = useState(null);
  const [purchaseModalError, setPurchaseModalError] = useState('');
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [paymentLinkForm] = Form.useForm();

  useEffect(() => {
    getBlogs()
      .then(setBlogs)
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setPurchasedBlogs([]);
      return;
    }
    getPurchasedBlogs()
      .then((list) => setPurchasedBlogs(Array.isArray(list) ? list : []))
      .catch(() => setPurchasedBlogs([]));
  }, [isLoggedIn]);

  const purchasedIds = new Set(purchasedBlogs.map((p) => p.blogId));
  const pdfUrlByBlogId = {};
  purchasedBlogs.forEach((p) => {
    if (p.blogId && p.pdfUrl) pdfUrlByBlogId[p.blogId] = p.pdfUrl;
  });

  const handleBuyClick = (blog) => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }
    setPurchaseModalError('');
    setSelectedPurchaseBlog(blog);
    paymentLinkForm.setFieldsValue({
      name: '',
      email: '',
      phone: '',
      message: '',
    });
    setPurchaseModalOpen(true);
  };

  const handleRequestPaymentLink = async () => {
    if (!selectedPurchaseBlog) return;
    try {
      const values = await paymentLinkForm.validateFields();
      setRequestSubmitting(true);
      await apiClient.post('/contact', {
        name: values.name?.trim(),
        email: values.email?.trim(),
        phone: values.phone?.trim() || '',
        subject: `Payment link request: ${selectedPurchaseBlog.title}`,
        message: values.message?.trim() || `Please share payment link for blog "${selectedPurchaseBlog.title}".`,
        blogTitle: selectedPurchaseBlog.title,
        amount: selectedPurchaseBlog.price,
        type: 'payment-link',
      });
      setPurchaseModalOpen(false);
      paymentLinkForm.resetFields();
      setSelectedPurchaseBlog(null);
      setPurchaseModalError('');
      message.success('Request submitted. Our team will share the payment link shortly.');
    } catch (err) {
      if (err?.errorFields) return;
      setPurchaseModalError(err?.response?.data?.message || err.message || 'Could not submit request.');
    } finally {
      setRequestSubmitting(false);
    }
  };

  const handleCardClick = (e, blog) => {
    if (e.target.closest('button')) return;
    const isFree = blog.price == null || Number(blog.price) === 0;
    const isPurchased = purchasedIds.has(blog.id) || isSuperAdmin;
    const href = `/blog/${blog.id}`;
    if (isFree) return;
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      const returnPath = location.pathname + location.search;
      navigate(`/login?redirect=${encodeURIComponent(returnPath)}`);
      return;
    }
    if (isPurchased) {
      navigate(href);
      return;
    }
    handleBuyClick(blog);
  };

  const renderBlogCard = (blog, showPurchaseButton = true) => {
    const isFree = blog.price == null || Number(blog.price) === 0;
    const isPurchased = purchasedIds.has(blog.id) || isSuperAdmin;
    const pdfUrl = pdfUrlByBlogId[blog.id];
    const href = `/blog/${blog.id}`;
    const coverUrl = blog.coverImage || getAssetUrl('/images/blog/post_1.jpeg');
    const dateStr = blog.createdAt ? dayjs(blog.createdAt).format('MMM D, YYYY') : '';

    return (
      <Col xs={24} sm={12} lg={8} key={blog.id} style={{ display: 'flex' }}>
        <Card
          className="cs_blog_card"
          hoverable
          style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
          onClickCapture={(e) => handleCardClick(e, blog)}
          cover={
            <Link to={href} className="cs_blog_card_cover">
              <img alt={blog.title} src={coverUrl.startsWith('http') ? coverUrl : getAssetUrl(coverUrl)} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
            </Link>
          }
          bodyStyle={{ padding: 20, display: 'flex', flexDirection: 'column', flex: 1 }}
        >
          <div className="cs_post_meta cs_heading_color" style={{ fontSize: 12, marginBottom: 8 }}>
            {blog.author || 'Author'} · {dateStr || '—'}
          </div>
          <h3 className="cs_post_title cs_semibold m-0" style={{ fontSize: 18, marginBottom: 8, lineHeight: 1.3 }}>
            <Link to={href}>{blog.title}</Link>
          </h3>
          <p className="cs_heading_color m-0" style={{ fontSize: 14, flex: 1, marginBottom: 12 }}>
            {blog.description || ''}
          </p>
          {Array.isArray(blog.tags) && blog.tags.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              {blog.tags.slice(0, 4).map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {isFree && (
              <Button
                type="primary"
                style={{ backgroundColor: SITE_TEAL, borderColor: SITE_TEAL }}
                onClick={() => navigate(href)}
              >
                Read Free
              </Button>
            )}
            {!isFree && isPurchased && (
              <>
                <Button
                  type="primary"
                  style={{ backgroundColor: SITE_TEAL, borderColor: SITE_TEAL }}
                  onClick={() => navigate(href)}
                >
                  Read Now
                </Button>
                {pdfUrl && (
                  <Button
                    icon={<DownloadOutlined />}
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    Download PDF
                  </Button>
                )}
              </>
            )}
            {showPurchaseButton && !isFree && !isPurchased && isLoggedIn && !isSuperAdmin && (
              <Button
                type="primary"
                style={{ backgroundColor: SITE_TEAL, borderColor: SITE_TEAL }}
                onClick={() => handleBuyClick(blog)}
              >
                Buy — ₹{blog.price}
              </Button>
            )}
            {showPurchaseButton && !isFree && !isPurchased && !isLoggedIn && (
              <Button
                type="primary"
                style={{ backgroundColor: SITE_TEAL, borderColor: SITE_TEAL }}
                onClick={() => setLoginModalOpen(true)}
              >
                Sign in
              </Button>
            )}
          </div>
        </Card>
      </Col>
    );
  };

  const allBlogsContent = (
    <Row gutter={[24, 24]}>
      {blogs.map((blog) => renderBlogCard(blog, true))}
    </Row>
  );

  const purchasedContent = (
    <Row gutter={[24, 24]}>
      {purchasedBlogs.length === 0 ? (
        <Col span={24}>
          <p className="cs_heading_color text-center py-4 m-0">No purchased blogs yet.</p>
        </Col>
      ) : (
        purchasedBlogs.map((p) => ({
          id: p.blogId,
          title: p.title,
          description: p.description,
          coverImage: p.coverImage,
          author: p.author,
          createdAt: p.purchaseDate,
          price: p.amount ?? p.price,
        })).map((blog) => renderBlogCard(blog, false))
      )}
    </Row>
  );

  const tabItems = [
    { key: 'all', label: 'All Blogs', children: allBlogsContent },
  ];
  if (isLoggedIn) {
    tabItems.push({ key: 'purchased', label: 'My Purchased Blogs', children: purchasedContent });
  }

  return (
    <>
      <Section topMd={140} topLg={95} topXl={75} bottomMd={16} bottomLg={14}>
        <Breadcrumb title="Blog" />
      </Section>
      <div className="container">
        <SectionHeading title="Latest Articles" subTitle="Updates and insights from Best of IDs." center />
        <Spacing md="20" lg="16" />
        {loading ? (
          <div className="text-center py-5">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} className="cs_blog_tabs" />
            <Spacing md="32" lg="28" />
            {activeTab === 'all' && blogs.length === 0 && (
              <p className="text-center cs_heading_color">No blog posts yet. Check back soon.</p>
            )}
          </>
        )}
      </div>
      <Spacing md="80" xl="64" lg="52" />
      <LoginModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSuccess={() => setLoginModalOpen(false)}
      />
      <Modal
        title="Request Payment Link"
        open={purchaseModalOpen}
        onCancel={() => {
          setPurchaseModalOpen(false);
          setPurchaseModalError('');
          setSelectedPurchaseBlog(null);
          paymentLinkForm.resetFields();
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setPurchaseModalOpen(false);
              setPurchaseModalError('');
              setSelectedPurchaseBlog(null);
              paymentLinkForm.resetFields();
            }}
            disabled={requestSubmitting}
          >
            Cancel
          </Button>,
          <Button
            key="request"
            type="primary"
            onClick={handleRequestPaymentLink}
            loading={requestSubmitting}
            style={{ backgroundColor: SITE_TEAL, borderColor: SITE_TEAL }}
          >
            Submit Request
          </Button>,
        ]}
        maskClosable={!requestSubmitting}
        closable={!requestSubmitting}
        destroyOnClose
      >
        {selectedPurchaseBlog && (
          <div>
            <p className="m-0 cs_heading_color">
              Fill the form below to get a payment link for:
            </p>
            <p className="m-0" style={{ fontWeight: 700, marginTop: 4 }}>
              {selectedPurchaseBlog.title}
            </p>
            <p className="m-0 cs_heading_color" style={{ marginTop: 10 }}>
              Amount: <strong>₹{selectedPurchaseBlog.price}</strong>
            </p>
            <Form form={paymentLinkForm} layout="vertical" style={{ marginTop: 14 }}>
              <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Enter your name' }]}>
                <Input placeholder="Your name" disabled={requestSubmitting} />
              </Form.Item>
              <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Enter your email' }, { type: 'email', message: 'Enter a valid email' }]}>
                <Input placeholder="your@email.com" disabled={requestSubmitting} />
              </Form.Item>
              <Form.Item name="phone" label="Phone">
                <Input placeholder="Your phone number" disabled={requestSubmitting} />
              </Form.Item>
              <Form.Item name="message" label="Message">
                <TextArea
                  rows={3}
                  placeholder={`Please share payment link for "${selectedPurchaseBlog.title}".`}
                  disabled={requestSubmitting}
                />
              </Form.Item>
            </Form>
            {purchaseModalError && (
              <p style={{ color: '#c0392b', marginTop: 12, marginBottom: 0 }}>
                {purchaseModalError}
              </p>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
