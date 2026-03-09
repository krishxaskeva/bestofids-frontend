import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Section from '../../components/Section';
import Breadcrumb from '../../components/Breadcrumb';
import { getMyEnrollments, updateAccess } from '../../services/educationService';
import { getAssetUrl } from '../../config';
import { pageTitle } from '../../utils/PageTitle';

const CATEGORY_LABELS = {
  course: 'Courses & Certification',
  webinar: 'Webinars',
  infographic: 'Infographics',
  podcast: 'Podcasts',
};

const CATEGORY_ICONS = {
  course: 'mdi:school',
  webinar: 'mdi:video',
  infographic: 'mdi:chart-box',
  podcast: 'mdi:microphone',
};

export default function MyLearningPage() {
  pageTitle('My Learning');
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyEnrollments()
      .then((data) => setEnrollments(Array.isArray(data) ? data : []))
      .catch(() => setEnrollments([]))
      .finally(() => setLoading(false));
  }, []);

  const byCategory = enrollments.reduce((acc, e) => {
    const c = e.category || 'course';
    if (!acc[c]) acc[c] = [];
    acc[c].push(e);
    return acc;
  }, {});

  const openContent = (item) => {
    updateAccess(item.educationId).catch(() => {});
    if (item.contentLink) window.open(item.contentLink, '_blank');
  };

  return (
    <>
      <Section topMd={140} topLg={95} topXl={75} bottomMd={24} bottomLg={20}>
        <Breadcrumb title="My Learning" />
      </Section>

      <Section topMd={0} topLg={0} topXl={0} bottomMd={80} bottomLg={60} bottomXl={50}>
        <div className="container">
          <h1 className="cs_heading_color" style={{ marginBottom: 8 }}>My Learning</h1>
          <p className="cs_heading_color" style={{ opacity: 0.85, marginBottom: 24 }}>
            Your enrolled content, progress, and upcoming webinars.
          </p>

          <Link to="/id-education-knowledge-hub" className="cs_btn cs_style_1 cs_btn_white_bg" style={{ marginBottom: 32 }}>
            <span>Browse all content</span>
            <i>
              <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
              <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
            </i>
          </Link>

          {loading ? (
            <p>Loading...</p>
          ) : enrollments.length === 0 ? (
            <div className="cs_edu_hub_content_empty">
              <Icon icon="mdi:school-outline" className="cs_edu_hub_empty_icon" />
              <p className="cs_edu_hub_empty_text">You haven&apos;t enrolled in any content yet. Visit the ID Education & Knowledge Hub to get started.</p>
              <Link to="/id-education-knowledge-hub" className="cs_btn cs_style_1" style={{ marginTop: 16 }}>
                <span>Go to Hub</span>
                <i>
                  <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                  <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                </i>
              </Link>
            </div>
          ) : (
            <div className="cs_my_learning_sections">
              {(['course', 'webinar', 'infographic', 'podcast']).map((cat) => {
                const items = byCategory[cat] || [];
                if (items.length === 0) return null;
                const upcoming = cat === 'webinar' ? items.filter((i) => i.type === 'live' && i.scheduledAt && new Date(i.scheduledAt) > new Date()) : [];
                const notUpcoming = cat === 'webinar' ? items.filter((i) => i.type !== 'live' || !i.scheduledAt || new Date(i.scheduledAt) <= new Date()) : items;
                const recent = [...notUpcoming]
                  .sort((a, b) => new Date(b.lastAccessedAt || b.enrollDate) - new Date(a.lastAccessedAt || a.enrollDate))
                  .slice(0, 10);
                return (
                  <div key={cat} className="cs_my_learning_section cs_shadow_1 cs_radius_25 cs_white_bg">
                    <h2 className="cs_my_learning_section_title">
                      <Icon icon={CATEGORY_ICONS[cat]} className="cs_my_learning_section_icon" />
                      {CATEGORY_LABELS[cat]}
                    </h2>
                    {upcoming.length > 0 && (
                      <div className="cs_my_learning_subsection">
                        <h3 className="cs_my_learning_subtitle">Upcoming</h3>
                        <ul className="cs_my_learning_list">
                          {upcoming.map((e) => (
                            <li key={e.id}>
                              <span>{e.title}</span>
                              <span className="cs_my_learning_meta">
                                {new Date(e.scheduledAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                              </span>
                              {e.contentLink && (
                                <a href={e.contentLink} target="_blank" rel="noopener noreferrer" className="cs_btn cs_style_1 cs_edu_hub_card_btn" style={{ marginLeft: 'auto' }}>
                                  Join
                                </a>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="cs_my_learning_subsection">
                      <h3 className="cs_my_learning_subtitle">{upcoming.length > 0 ? 'Recordings & content' : 'Enrolled'}</h3>
                      <ul className="cs_my_learning_list">
                        {recent.map((e) => (
                          <li key={e.id}>
                            <span>{e.title}</span>
                            {e.progress != null && e.progress > 0 && (
                              <span className="cs_my_learning_progress">{e.progress}%</span>
                            )}
                            <button
                              type="button"
                              className="cs_btn cs_style_1 cs_edu_hub_card_btn"
                              onClick={() => openContent(e)}
                            >
                              <span>{e.category === 'webinar' && e.type === 'live' ? 'Add to Calendar' : e.category === 'course' ? 'Watch Now' : e.category === 'podcast' ? 'Listen / Watch' : 'View'}</span>
                              <i>
                                <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                                <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                              </i>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
