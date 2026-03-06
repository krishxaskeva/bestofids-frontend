import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Section from './Section';
import Breadcrumb from './Breadcrumb';
import Banner from './BannerSection';
import { Icon } from '@iconify/react';
import Spacing from './Spacing';
import Post from './ui/Post';
import Sidebar from './Sidebar';
import AuthorWidget from './AuthorWidget';
import CommentsWidget from './CommentsWidget';
import ReplyWidget from './ReplyWidget';
import { pageTitle } from '../utils/PageTitle';
import { useAuth } from '../contexts/AuthContext';
import { getBlogById, checkBlogPurchase, createBlogOrder, verifyBlogPayment, getBlogs } from '../services/blogService';
import { Button, message} from 'antd';
import dayjs from 'dayjs';
import htmlReactParser from 'html-react-parser';
import { getAssetUrl } from '../config';

export default function BlogDetails() {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
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
        if (data.price > 0 && isLoggedIn) {
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
  }, [blogId, isLoggedIn]);

  useEffect(() => {
    getBlogs()
      .then((list) => {
        const related = list.filter((b) => b.id !== blogId).slice(0, 3);
        setRelatedBlogs(
          related.map((b) => ({
            title: b.title,
            thumbUrl: b.coverImage || '/images/blog/post_1.jpeg',
            date: b.createdAt ? dayjs(b.createdAt).format('MMM D, YYYY') : '',
            btnText: 'Learn More',
            href: `/blog/${b.id}`,
          }))
        );
      })
      .catch(() => setRelatedBlogs([]));
  }, [blogId]);

  const handleBuyClick = async () => {
    if (!isLoggedIn) {
      message.info('Please log in to purchase.');
      navigate('/login');
      return;
    }
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
  const showBuyCta = blog && blog.price > 0 && !purchased;

  if (loading) {
    return (
      <>
        <Section topMd={140} topLg={95} topXl={75} bottomMd={24} bottomLg={20}>
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
        <Section topMd={140} topLg={95} topXl={75} bottomMd={24} bottomLg={20}>
          <Breadcrumb title="Blog" />
        </Section>
        <div className="container text-center py-5">
          <p className="cs_heading_color">{error || 'Blog not found.'}</p>
          <Link to="/">Back to Home</Link>
        </div>
      </>
    );
  }

  const tags = Array.isArray(blog.tags) && blog.tags.length
    ? blog.tags.map((tag) => ({ tag, href: `/blog/${blogId}` }))
    : [{ tag: 'Blog', href: `/blog/${blogId}` }];

  return (
    <>
      <Section topMd={140} topLg={95} topXl={75} bottomMd={24} bottomLg={20}>
        <Breadcrumb title={blog.title} />
      </Section>
      <div className="container">
        <div className="cs_blog_details_info">
          <div className="cs_blog_details_info_left">
            <div className="cs_blog_details_tags">
              {tags.map((item, index) => (
                <Link key={index} to={item.href}>
                  {item.tag}
                </Link>
              ))}
            </div>
            <div className="cs_blog_details_date">
              {blog.createdAt ? dayjs(blog.createdAt).format('MMMM D, YYYY') : ''} | {blog.author || 'Admin'}
            </div>
          </div>
          <div className="cs_social_links_wrap">
            <h2>Share:</h2>
            <div className="cs_social_links">
              <Link to="/"><Icon icon="fa-brands:facebook-f" /></Link>
              <Link to="/"><Icon icon="fa-brands:linkedin-in" /></Link>
              <Link to="/"><Icon icon="fa-brands:twitter" /></Link>
            </div>
          </div>
        </div>
        <Spacing md="55" />

        {blog.coverImage && (
          <>
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-100 cs_radius_20"
            />
            <Spacing md="30" />
          </>
        )}

        {showBuyCta && (
          <div className="cs_white_bg cs_radius_20 p-4 mb-4" style={{ boxShadow: '0 4px 20px rgba(0,0,0,.08)' }}>
            <h3 className="cs_semibold mb-2">This content is paid</h3>
            <p className="cs_heading_color mb-3">{blog.description || 'Purchase to access the full article and PDF download.'}</p>
            <p className="mb-3" style={{ fontSize: 18, fontWeight: 600, color: '#117574' }}>₹{blog.price}</p>
            {isLoggedIn ? (
              <Button type="primary" size="large" onClick={handleBuyClick} loading={paymentLoading}>
                Buy Blog — ₹{blog.price}
              </Button>
            ) : (
              <Button type="primary" size="large" onClick={() => navigate('/login')}>
                Login to Access
              </Button>
            )}
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
                  <p className="cs_heading_color">{blog.description || 'No content.'}</p>
                )}
              </div>
            )}
            <Spacing md="85" />
            <AuthorWidget
              imgUrl={getAssetUrl('/images/blog/author.png')}
              name={blog.author || 'Author'}
              description="Expert content from Best of IDs."
            />
            <Spacing md="110" />
            <CommentsWidget title="Comments" />
            <Spacing md="92" />
            <ReplyWidget title="Leave a Reply" />
          </div>
          <div className="col-lg-4">
            <Sidebar />
          </div>
        </div>
        <Spacing md="135" lg="100" />
        <h2 className="mb-0 cs_fs_40 cs_medium">Related Articles</h2>
        <Spacing md="57" />
        <div className="row cs_gap_y_40">
          {relatedBlogs.map((item, index) => (
            <div className="col-xl-4 col-md-6" key={index}>
              <Post {...item} />
            </div>
          ))}
        </div>
      </div>
      <Spacing md="200" xl="150" lg="110" />
      <Section className="cs_footer_margin_0">
        <Banner
          bgUrl=""
          imgUrl={getAssetUrl('/images/doctors/banner_img_3.png')}
          title="Don't Let Your Health Take a Backseat!"
          subTitle="Schedule an appointment with one of our experienced medical professionals today!"
        />
      </Section>

    </>
  );
}
