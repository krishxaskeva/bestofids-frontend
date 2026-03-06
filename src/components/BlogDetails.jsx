import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Section from './Section';
import Breadcrumb from './Breadcrumb';
import Spacing from './Spacing';
import Post from './ui/Post';
import Sidebar from './Sidebar';
import { pageTitle } from '../utils/PageTitle';
import { useAuth } from '../contexts/AuthContext';
import { getBlogById, checkBlogPurchase, createBlogOrder, verifyBlogPayment, getBlogs } from '../services/blogService';
import { Button, message } from 'antd';
import dayjs from 'dayjs';
import htmlReactParser from 'html-react-parser';
import { getAssetUrl } from '../config';

const SITE_TEAL = '#117574';

export default function BlogDetails() {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, isSuperAdmin } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchased, setPurchased] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

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

  useEffect(() => {
    if (!blogId) {
      setLoading(false);
      setError('Invalid blog');
      return;
    }
    setLoading(true);
    setError(null);
    getBlogById(blogId)
      .then((data) => {
        setBlog(data);
        pageTitle(data.title || 'Blog');
        if (isSuperAdmin) {
          setPurchased(true);
        } else if (data.price > 0 && isLoggedIn) {
          checkBlogPurchase(blogId).then(setPurchased);
        } else if (data.price === 0) {
          setPurchased(true);
        }
      })
      .catch((err) => {
        setError(err.message || 'Blog not found');
        setBlog(null);
      })
      .finally(() => setLoading(false));
  }, [blogId, isLoggedIn, isSuperAdmin]);

  useEffect(() => {
    getBlogs()
      .then((list) => {
        const related = list.filter((b) => b.id !== blogId).slice(0, 3);
        setRelatedBlogs(
          related.map((b) => ({
            title: b.title,
            thumbUrl: b.coverImage,
            date: b.createdAt ? dayjs(b.createdAt).format('MMM D, YYYY') : '',
            href: `/blog/${b.id}`,
          }))
        );
      })
      .catch(() => setRelatedBlogs([]));
  }, [blogId]);

  const handleBuyClick = async () => {
    if (!blogId || !blog) return;
    setPaymentLoading(true);
    try {
      const { orderId, amount, currency, keyId } = await createBlogOrder(blogId);
      const { config } = await import('../config');
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
          handlePaymentSuccess(response);
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        setPaymentLoading(false);
        message.error('Payment failed or was cancelled.');
      });
      rzp.open();
    } catch (err) {
      message.error(err.message || 'Could not start payment.');
      setPaymentLoading(false);
    }
  };

  const handlePaymentSuccess = async (response) => {
    try {
      await verifyBlogPayment(blogId, {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      });
      setPurchased(true);
      setPaymentLoading(false);
      message.success('Purchase complete. You can now download the PDF.');
    } catch (err) {
      setPaymentLoading(false);
      message.error(err.message || 'Payment verification failed.');
    }
  };

  const canAccessContent = blog && (blog.price === 0 || purchased);
  const showBuyCta = blog && blog.price > 0 && !purchased && isLoggedIn && !isSuperAdmin;
  const showLoginPrompt = blog && blog.price > 0 && !purchased && !isLoggedIn;

  if (loading) {
    return (
      <>
        <Section topMd={140} topLg={95} topXl={75} bottomMd={16} bottomLg={14}>
          <Breadcrumb title="Blog" />
        </Section>
        <div className="container text-center py-5">
          <p className="cs_heading_color">Loading...</p>
        </div>
      </>
    );
  }

  if (error || !blog) {
    return (
      <>
        <Section topMd={140} topLg={95} topXl={75} bottomMd={16} bottomLg={14}>
          <Breadcrumb title="Blog" />
        </Section>
        <div className="container text-center py-5">
          <p className="cs_heading_color">{error || 'Blog not found.'}</p>
          <Link to="/">Back to Home</Link>
        </div>
      </>
    );
  }

  const tags = Array.isArray(blog.tags) && blog.tags.length > 0
    ? blog.tags.map((tag) => ({ tag, href: `/blog/${blogId}` }))
    : [];

  return (
    <>
      <Section topMd={140} topLg={95} topXl={75} bottomMd={16} bottomLg={14}>
        <Breadcrumb title={blog.title} />
      </Section>
      <div className="container">
        <div className="cs_blog_details_info">
          <div className="cs_blog_details_info_left">
            {tags.length > 0 && (
              <div className="cs_blog_details_tags">
                {tags.map((item, index) => (
                  <Link key={index} to={item.href}>
                    {item.tag}
                  </Link>
                ))}
              </div>
            )}
            {(blog.createdAt || blog.author) && (
              <div className="cs_blog_details_date">
                {blog.createdAt ? dayjs(blog.createdAt).format('MMMM D, YYYY') : ''}
                {blog.createdAt && blog.author ? ' | ' : ''}
                {blog.author || ''}
              </div>
            )}
          </div>
        </div>
        <Spacing md="36" />

        {blog.coverImage && (
          <>
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-100 cs_radius_20"
            />
            <Spacing md="20" />
          </>
        )}

        {showLoginPrompt && (
          <div className="cs_white_bg cs_radius_20 p-4 mb-4" style={{ boxShadow: '0 4px 20px rgba(0,0,0,.08)' }}>
            <p className="cs_heading_color mb-3">Please log in to purchase this article.</p>
            <Button
              type="primary"
              size="large"
              style={{ backgroundColor: SITE_TEAL, borderColor: SITE_TEAL }}
              onClick={() => navigate(`/login?redirect=${encodeURIComponent(`/blog/${blogId}`)}`)}
            >
              Log in
            </Button>
          </div>
        )}

        {showBuyCta && (
          <div className="cs_white_bg cs_radius_20 p-4 mb-4" style={{ boxShadow: '0 4px 20px rgba(0,0,0,.08)' }}>
            <p className="mb-3" style={{ fontSize: 18, fontWeight: 600, color: SITE_TEAL }}>₹{blog.price}</p>
            <Button
              type="primary"
              size="large"
              style={{ backgroundColor: SITE_TEAL, borderColor: SITE_TEAL }}
              onClick={handleBuyClick}
              loading={paymentLoading}
            >
              Buy — ₹{blog.price}
            </Button>
          </div>
        )}

        {canAccessContent && (
          <>
            {blog.pdfUrl && (
              <div className="mb-4">
                <a
                  href={blog.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cs_btn cs_style_1"
                >
                  <span>Download PDF</span>
                  <i>
                    <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" aria-hidden />
                    <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" aria-hidden />
                  </i>
                </a>
              </div>
            )}
          </>
        )}

        <div className="row">
          <div className="col-lg-8">
            {canAccessContent && (
              <div className="cs_blog_details">
                {blog.content ? htmlReactParser(blog.content) : (
                  blog.description ? <p className="cs_heading_color">{blog.description}</p> : null
                )}
              </div>
            )}
            <Spacing md="52" />
          </div>
          <div className="col-lg-4">
            <Sidebar />
          </div>
        </div>
        <Spacing md="80" lg="64" />
        {relatedBlogs.length > 0 && (
          <>
            <h2 className="mb-0 cs_fs_40 cs_medium">Related Articles</h2>
            <Spacing md="36" />
            <div className="row cs_gap_y_40">
              {relatedBlogs.map((item, index) => (
                <div className="col-xl-4 col-md-6" key={index}>
                  <Post {...item} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <Spacing md="80" xl="64" lg="52" />

    </>
  );
}
