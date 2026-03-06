import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { message } from 'antd';
import Section from '../../components/Section';
import Breadcrumb from '../../components/Breadcrumb';
import { getAssetUrl } from '../../config';
import { useAuth } from '../../contexts/AuthContext';
import {
  getEducationById,
  enroll,
  updateAccess,
  checkEnrolled,
} from '../../services/educationService';
import { pageTitle } from '../../utils/PageTitle';

const LEVEL_LABELS = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };
const PLATFORM_LABELS = {
  zoom: 'Zoom',
  google_meet: 'Google Meet',
  microsoft_teams: 'Microsoft Teams',
  youtube_live: 'YouTube Live',
  other: 'Other',
};
const PODCAST_PLATFORM_LABELS = {
  spotify: 'Spotify',
  apple_podcasts: 'Apple Podcasts',
  youtube: 'YouTube',
  soundcloud: 'SoundCloud',
  direct_upload: 'Direct Upload',
  other: 'Other',
};
const CATEGORY_TAG_LABELS = {
  diagnostic_pathway: 'Diagnostic Pathway',
  treatment_algorithm: 'Treatment Algorithm',
  infection_prevention: 'Infection Prevention',
};

function isEmbeddableVideo(url) {
  if (!url || typeof url !== 'string') return false;
  return (
    url.includes('youtube.com/watch') ||
    url.includes('youtu.be/') ||
    url.includes('vimeo.com/') ||
    url.includes('player.vimeo.com')
  );
}

function getEmbedUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com') && u.searchParams.get('v')) {
      return `https://www.youtube.com/embed/${u.searchParams.get('v')}`;
    }
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    }
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch (_) {}
  return null;
}

export default function EducationDetailPage() {
  const { id } = useParams();
  const { isLoggedIn } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError('Invalid content');
      return;
    }
    setLoading(true);
    setError(null);
    getEducationById(id)
      .then((data) => {
        setItem(data);
        pageTitle(data.title || 'Education');
      })
      .catch((err) => {
        setError(err?.message || 'Content not found');
        setItem(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!item?.id || !isLoggedIn) return;
    checkEnrolled(item.id).then(setEnrolled);
  }, [item?.id, isLoggedIn]);

  const handleEnroll = () => {
    if (!item || enrolling) return;
    setEnrolling(true);
    enroll(item.id)
      .then(() => {
        setEnrolled(true);
        message.success('Enrolled successfully.');
        getEducationById(item.id).then(setItem);
      })
      .catch((err) => {
        message.error(err?.message || 'Enrollment failed. Please try again.');
      })
      .finally(() => setEnrolling(false));
  };

  const handleAccess = () => {
    if (!item?.contentLink) return;
    updateAccess(item.id).catch(() => {});
    window.open(item.contentLink, '_blank');
  };

  const loginUrl = `/login?redirect=${encodeURIComponent(`/id-education-knowledge-hub/item/${id}`)}`;
  const hubUrl = '/id-education-knowledge-hub';

  if (loading) {
    return (
      <>
        <Section topMd={140} topLg={95} topXl={75} bottomMd={16} bottomLg={14}>
          <Breadcrumb title="ID Education & Knowledge Hub" />
        </Section>
        <Section topMd={0} topLg={0} topXl={0} bottomMd={48} bottomLg={40} bottomXl={32}>
          <div className="container">
            <div className="cs_edu_hub_content_loading">
              <Icon icon="mdi:loading" className="cs_edu_hub_loading_icon" />
              <p>Loading...</p>
            </div>
          </div>
        </Section>
      </>
    );
  }

  if (error || !item) {
    return (
      <>
        <Section topMd={140} topLg={95} topXl={75} bottomMd={16} bottomLg={14}>
          <Breadcrumb title="ID Education & Knowledge Hub" />
        </Section>
        <Section topMd={0} topLg={0} topXl={0} bottomMd={48} bottomLg={40} bottomXl={32}>
          <div className="container">
            <div className="cs_edu_hub_content_empty">
              <Icon icon="mdi:alert-circle-outline" className="cs_edu_hub_empty_icon" />
              <p className="cs_edu_hub_empty_text">{error || 'Content not found.'}</p>
              <Link to={hubUrl} className="cs_btn cs_style_1">
                <span>Back to Hub</span>
                <i>
                  <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                  <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                </i>
              </Link>
            </div>
          </div>
        </Section>
      </>
    );
  }

  const hasAccess = !!item.contentLink;
  const category = item.category || '';
  const embedUrl = hasAccess && category !== 'infographic' ? getEmbedUrl(item.contentLink) : null;
  const showEmbed = embedUrl && isEmbeddableVideo(item.contentLink);

  return (
    <>
      <Section topMd={140} topLg={95} topXl={75} bottomMd={16} bottomLg={14}>
        <Breadcrumb title="ID Education & Knowledge Hub" />
      </Section>

      <Section topMd={0} topLg={0} topXl={0} bottomMd={48} bottomLg={40} bottomXl={32}>
        <div className="container">
          <div className="cs_edu_detail_page">
            <nav className="cs_edu_detail_nav">
              <Link to={hubUrl} className="cs_edu_detail_back">
                <Icon icon="mdi:arrow-left" /> Back to Hub
              </Link>
            </nav>

            <div className="cs_edu_detail_header">
              <div className="cs_edu_detail_thumb_wrap">
                <img
                  src={item.thumbnail || getAssetUrl('/images/best-of-ids-logo.png')}
                  alt=""
                  className="cs_edu_detail_thumb"
                />
                {!hasAccess && (
                  <div className="cs_edu_detail_thumb_lock">
                    <Icon icon="mdi:lock" />
                  </div>
                )}
              </div>
              <div className="cs_edu_detail_meta_col">
                <span className={`cs_edu_detail_category cs_edu_detail_cat_${category} ${category === 'webinar' && item.type === 'live' ? 'cs_edu_detail_live' : ''}`}>
                  {category === 'course' && 'Course'}
                  {category === 'webinar' && (item.type === 'live' ? 'Live Webinar' : 'Webinar')}
                  {category === 'infographic' && 'Infographic'}
                  {category === 'podcast' && 'Podcast'}
                </span>
                <h1 className="cs_edu_detail_title">{item.title}</h1>
                {item.description && (
                  <div className="cs_edu_detail_desc">
                    {item.description}
                  </div>
                )}
                <div className="cs_edu_detail_meta_list">
                  {category === 'course' && item.level && (
                    <span className="cs_edu_hub_meta_badge">{LEVEL_LABELS[item.level] || item.level}</span>
                  )}
                  {item.duration && <span className="cs_edu_detail_meta_item">{item.duration}</span>}
                  {item.cmeCredits != null && item.cmeCredits > 0 && (
                    <span className="cs_edu_hub_meta_badge cs_edu_hub_cme">CME {item.cmeCredits}</span>
                  )}
                  {category === 'webinar' && item.platform && (
                    <span className="cs_edu_hub_meta_badge">{PLATFORM_LABELS[item.platform] || item.platform}</span>
                  )}
                  {category === 'webinar' && item.scheduledAt && (
                    <span className="cs_edu_detail_meta_item">
                      {new Date(item.scheduledAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  )}
                  {(item.speakerName || item.speakerTitle) && (
                    <span className="cs_edu_detail_meta_item">
                      {[item.speakerName, item.speakerTitle].filter(Boolean).join(' · ')}
                    </span>
                  )}
                  {category === 'podcast' && item.podcastPlatform && (
                    <span className="cs_edu_hub_meta_badge">{PODCAST_PLATFORM_LABELS[item.podcastPlatform] || item.podcastPlatform}</span>
                  )}
                  {category === 'podcast' && item.episodeNumber != null && (
                    <span className="cs_edu_detail_meta_item">Ep. {item.episodeNumber}</span>
                  )}
                  {category === 'infographic' && item.categoryTag && (
                    <span className="cs_edu_hub_meta_badge">{CATEGORY_TAG_LABELS[item.categoryTag] || item.categoryTag}</span>
                  )}
                </div>

                {!hasAccess && (
                  <div className="cs_edu_detail_actions">
                    {!isLoggedIn ? (
                      <Link to={loginUrl} className="cs_btn cs_style_1">
                        <span>Log in to Enroll & Access</span>
                        <i>
                          <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                          <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                        </i>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className="cs_btn cs_style_1"
                        onClick={handleEnroll}
                        disabled={enrolling}
                      >
                        <span>{enrolling ? 'Enrolling...' : 'Enroll to Access'}</span>
                        <i>
                          <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                          <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                        </i>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {hasAccess && (
              <div className="cs_edu_detail_content">
                <h2 className="cs_edu_detail_content_title">
                  {category === 'infographic' ? 'Infographic' : category === 'podcast' ? (item.mediaType === 'video' ? 'Watch' : 'Listen') : 'Content'}
                </h2>
                {category === 'infographic' && item.contentLink && (
                  <div className="cs_edu_detail_infographic_wrap">
                    <img src={item.contentLink} alt={item.title} className="cs_edu_detail_infographic_img" />
                  </div>
                )}
                {category !== 'infographic' && showEmbed && (
                  <div className="cs_edu_detail_embed_wrap">
                    <iframe
                      title={item.title}
                      src={embedUrl}
                      className="cs_edu_detail_embed"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
                {category !== 'infographic' && hasAccess && !showEmbed && (
                  <div className="cs_edu_detail_external">
                    <button type="button" className="cs_btn cs_style_1" onClick={handleAccess}>
                      <span>
                        {category === 'course' && 'Watch Now'}
                        {category === 'webinar' && (item.type === 'live' ? 'Join Webinar' : 'Watch Recording')}
                        {category === 'podcast' && (item.mediaType === 'video' ? 'Watch Now' : 'Listen Now')}
                      </span>
                      <i>
                        <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                        <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                      </i>
                    </button>
                    <p className="cs_edu_detail_external_hint">Opens in a new tab</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
