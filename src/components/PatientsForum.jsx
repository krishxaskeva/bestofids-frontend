import React, { useState, useEffect } from 'react';
import Section from './Section';
import Breadcrumb from './Breadcrumb';
import SectionHeading from './SectionHeading';
import Spacing from './Spacing';
import { pageTitle } from '../utils/PageTitle';
import { Modal, Skeleton } from 'antd';
import dayjs from 'dayjs';
import { getPatientCarePosts } from '../services/patientCareService';
import { getAssetUrl } from '../config';

function CardSkeleton() {
  return (
    <div
      className="cs_white_bg cs_radius_30 overflow-hidden h-100 d-flex flex-column"
      style={{ boxShadow: '0 4px 20px rgba(0,0,0,.08)' }}
    >
      <div style={{ width: '100%', height: 200, flexShrink: 0 }}>
        <Skeleton.Node active style={{ width: '100%', height: 200 }}>
          <div style={{ width: '100%', height: 200 }} />
        </Skeleton.Node>
      </div>
      <div className="p-4 d-flex flex-column flex-grow-1">
        <div className="mb-2 d-flex align-items-center gap-2">
          <Skeleton.Button active size="small" style={{ width: 80 }} />
          <Skeleton.Input active size="small" style={{ width: 90 }} />
        </div>
        <Skeleton title={{ width: '85%' }} paragraph={{ rows: 2 }} active />
        <Skeleton.Button active style={{ width: 100, marginTop: 8 }} />
      </div>
    </div>
  );
}

export default function PatientsForum() {
  pageTitle('Patient Care & Knowledge');
  const [posts, setPosts] = useState([]);
  // eslint-disable-next-line no-unused-vars -- used in JSX for loading state
  const [loading, setLoading] = useState(true);
  const [detailPost, setDetailPost] = useState(null);

  useEffect(() => {
    getPatientCarePosts()
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Section topMd={140} topLg={95} topXl={75} bottomMd={16} bottomLg={14}>
        <Breadcrumb title="Patient Care & Knowledge" />
      </Section>
      <Section topMd={0} topLg={0} topXl={0} bottomMd={48} bottomLg={40} bottomXl={32}>
        <div className="container">
          <SectionHeading title="Patient care updates" center />
          <Spacing md="24" lg="20" xl="20" />
          {loading ? (
            <div className="row g-4 cs_patient_care_cards_row">
              {[1, 2, 3].map((i) => (
                <div key={i} className="col-12 col-sm-6 col-lg-4">
                  <CardSkeleton />
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="row g-4 cs_patient_care_cards_row">
              {posts.map((post) => (
                <div key={post.id} className="col-12 col-sm-6 col-lg-4">
                  <article
                    role="button"
                    tabIndex={0}
                    className="cs_white_bg cs_radius_30 overflow-hidden h-100 d-flex flex-column"
                    style={{ boxShadow: '0 4px 20px rgba(0,0,0,.08)', cursor: 'pointer' }}
                    onClick={() => setDetailPost(post)}
                    onKeyDown={(e) => e.key === 'Enter' && setDetailPost(post)}
                  >
                    {post.thumbnailUrl && (
                      <div className="overflow-hidden" style={{ height: 200 }}>
                        <img
                          src={post.thumbnailUrl}
                          alt=""
                          className="w-100 h-100"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <div className="p-4 d-flex flex-column flex-grow-1">
                      <div className="mb-2">
                        {post.category && (
                          <span
                            className="badge me-2"
                            style={{
                              backgroundColor: post.category === 'Health Tips' ? '#52c41a' : post.category === 'Patient Guidelines' ? '#1890ff' : post.category === 'Announcements' ? '#fa8c16' : post.category === 'Awareness Campaigns' ? '#722ed1' : '#13c2c2',
                              color: '#fff',
                            }}
                          >
                            {post.category}
                          </span>
                        )}
                        {(post.publishDate || post.createdAt) && (
                          <span className="cs_heading_color opacity-75 small">
                            {dayjs(post.publishDate || post.createdAt).format('MMM D, YYYY')}
                          </span>
                        )}
                      </div>
                      <h3 className="cs_heading_color cs_fs_20 cs_semibold mb-2">
                        {post.title}
                      </h3>
                      <p className="cs_heading_color opacity-75 mb-3 flex-grow-1" style={{ fontSize: '0.95rem' }}>
                        {post.shortDescription}
                      </p>
                      <button
                        type="button"
                        className="cs_btn cs_style_1 align-self-start"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailPost(post);
                        }}
                      >
                        <span>Read more</span>
                        <i>
                          <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" aria-hidden />
                          <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" aria-hidden />
                        </i>
                      </button>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center cs_heading_color opacity-75 mb-0">
              No patient care updates at the moment. Check back soon.
            </p>
          )}
        </div>
      </Section>

      <Modal
        title={detailPost?.title}
        open={!!detailPost}
        onCancel={() => setDetailPost(null)}
        footer={null}
        width={640}
        destroyOnClose
        className="patient-care-modal"
      >
        {detailPost && (
          <div className="patient-care-detail">
            <div className="mb-3">
              {detailPost.category && (
                <span
                  className="badge me-2"
                  style={{
                    backgroundColor: detailPost.category === 'Health Tips' ? '#52c41a' : detailPost.category === 'Patient Guidelines' ? '#1890ff' : detailPost.category === 'Announcements' ? '#fa8c16' : detailPost.category === 'Awareness Campaigns' ? '#722ed1' : '#13c2c2',
                    color: '#fff',
                  }}
                >
                  {detailPost.category}
                </span>
              )}
              <span className="text-muted small">
                {dayjs(detailPost.publishDate || detailPost.createdAt).format('MMMM D, YYYY')}
              </span>
            </div>
            {detailPost.thumbnailUrl && (
              <img
                src={detailPost.thumbnailUrl}
                alt=""
                className="w-100 mb-3"
                style={{ maxHeight: 280, objectFit: 'cover', borderRadius: 8 }}
              />
            )}
            <p className="text-muted mb-3">{detailPost.shortDescription}</p>
            <div
              className="patient-care-content"
              dangerouslySetInnerHTML={{ __html: detailPost.content || '' }}
              style={{ lineHeight: 1.7 }}
            />
          </div>
        )}
      </Modal>
    </>
  );
}
