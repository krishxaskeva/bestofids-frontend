import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Tabs, Tag, Spin, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import Section from './Section';
import Breadcrumb from './Breadcrumb';
import SectionHeading from './SectionHeading';
import Spacing from './Spacing';
import { pageTitle } from '../utils/PageTitle';
import { useAuth } from '../contexts/AuthContext';
import { getBlogs, createBlogOrder, verifyBlogPayment } from '../services/blogService';
import { getPurchasedBlogs } from '../services/userService';
import { config, getAssetUrl } from '../config';
import dayjs from 'dayjs';

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => resolve();
    document.body.appendChild(script);
  });
}

export default function BlogList() {
  pageTitle('Blog');
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [purchasedBlogs, setPurchasedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [payingBlogId, setPayingBlogId] = useState(null);

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

  const handleBuyClick = async (blog) => {
    if (!isLoggedIn) {
      message.info('Please log in to purchase.');
      navigate('/login');
      return;
    }
    setPayingBlogId(blog.id);
    try {
      const { orderId, amount, currency, keyId } = await createBlogOrder(blog.id);
      await loadRazorpayScript();
      const key = keyId || config.razorpayKey;
      if (!key) {
        message.error('Payment is not configured.');
        return;
      }
      const options = {
        key,
        amount,
        currency,
        order_id: orderId,
        name: 'Best of IDs',
        description: blog.title || 'Blog',
        handler(response) {
          handlePaymentSuccess(blog.id, response);
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        setPayingBlogId(null);
        message.error('Payment failed or was cancelled.');
      });
      rzp.open();
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

  const renderBlogCard = (blog, showPurchaseButton = true) => {
    const isFree = blog.price == null || Number(blog.price) === 0;
    const isPurchased = purchasedIds.has(blog.id);
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
              <Button type="primary" onClick={() => navigate(href)}>
                Read Free
              </Button>
            )}
            {!isFree && isPurchased && (
              <>
                <Button type="primary" onClick={() => navigate(href)}>
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
            {showPurchaseButton && !isFree && !isPurchased && (
              <Button
                type="primary"
                loading={payingBlogId === blog.id}
                onClick={() => handleBuyClick(blog)}
              >
                Buy — ₹{blog.price}
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
      <Section topMd={140} topLg={95} topXl={75} bottomMd={24} bottomLg={20}>
        <Breadcrumb title="Blog" />
      </Section>
      <div className="container">
        <SectionHeading title="Latest Articles" subTitle="Updates and insights from Best of IDs." center />
        <Spacing md="28" lg="24" />
        {loading ? (
          <div className="text-center py-5">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
            <Spacing md="48" lg="40" />
            {activeTab === 'all' && blogs.length === 0 && (
              <p className="text-center cs_heading_color">No blog posts yet. Check back soon.</p>
            )}
          </>
        )}
      </div>
      <Spacing md="200" xl="150" lg="110" />
    </>
  );
}
