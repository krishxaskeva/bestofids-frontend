import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Row, Col, Card, Button, Tabs, Tag, Spin, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import Section from './Section';
import Breadcrumb from './Breadcrumb';
import SectionHeading from './SectionHeading';
import Spacing from './Spacing';
import { pageTitle } from '../utils/PageTitle';
import { useAuth } from '../store/hooks';
import { getBlogs, createBlogOrder, verifyBlogPayment } from '../services/blogService';
import { loadRazorpayScript, openRazorpayCheckout } from '../utils/razorpayCheckout';
import { getPurchasedBlogs } from '../services/userService';
import { config, getAssetUrl } from '../config';
import LoginModal from './auth/LoginModal';
import dayjs from 'dayjs';

const SITE_TEAL = '#117574';

export default function BlogList() {
  pageTitle('Blog');
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, isSuperAdmin } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [purchasedBlogs, setPurchasedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [payingBlogId, setPayingBlogId] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    getBlogs()
      .then(setBlogs)
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, []);

  // Preload Razorpay script so the modal can open right after createOrder (reduces popup-blocking).
  useEffect(() => {
    loadRazorpayScript().catch(() => {});
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

  const handleBuyClick = async (blog) => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }
    setPayingBlogId(blog.id);
    try {
      const { orderId, amount, currency, keyId } = await createBlogOrder(blog.id);
      await loadRazorpayScript();
      const key = keyId || config.razorpayKey;
      if (!key) {
        setPayingBlogId(null);
        message.error('Payment is not configured.');
        return;
      }
      openRazorpayCheckout({
        key,
        amount,
        currency,
        orderId,
        description: blog.title || 'Blog',
        onSuccess: (response) => handlePaymentSuccess(blog.id, response),
        onFailure: () => {
          setPayingBlogId(null);
          message.error('Payment failed or was cancelled.');
        },
      });
    } catch (err) {
      setPayingBlogId(null);
      message.error(err.message || 'Could not start payment.');
    }
  };

  const handlePaymentSuccess = async (blogId, response) => {
    try {
      await verifyBlogPayment(blogId, {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      });
      setPayingBlogId(null);
      message.success('Purchase complete! You can read the blog now.');
      getPurchasedBlogs()
        .then((list) => setPurchasedBlogs(Array.isArray(list) ? list : []))
        .catch(() => {});
    } catch (err) {
      setPayingBlogId(null);
      message.error(err.message || 'Payment verification failed.');
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
                loading={payingBlogId === blog.id}
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
    </>
  );
}
