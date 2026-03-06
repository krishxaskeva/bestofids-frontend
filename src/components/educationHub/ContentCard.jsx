import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { getAssetUrl } from '../../config';

const LEVEL_LABELS = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };
const CATEGORY_TAG_LABELS = {
  diagnostic_pathway: 'Diagnostic Pathway',
  treatment_algorithm: 'Treatment Algorithm',
  infection_prevention: 'Infection Prevention',
};
const PLATFORM_LABELS = {
  zoom: 'Zoom',
  google_meet: 'Google Meet',
  microsoft_teams: 'Microsoft Teams',
  youtube_live: 'YouTube Live',
  other: 'Other',
};
const detailUrl = (educationId) => `/id-education-knowledge-hub/item/${educationId}`;
const PODCAST_PLATFORM_LABELS = {
  spotify: 'Spotify',
  apple_podcasts: 'Apple Podcasts',
  youtube: 'YouTube',
  soundcloud: 'SoundCloud',
  direct_upload: 'Direct Upload',
  other: 'Other',
};

function Thumbnail({ src, alt, locked, className = '' }) {
  const url = src || getAssetUrl('/images/best-of-ids-logo.png');
  return (
    <div className={`cs_edu_hub_card_thumb_wrap ${className}`}>
      <img src={url} alt={alt || ''} className="cs_edu_hub_card_thumb_img" />
      {locked && (
        <div className="cs_edu_hub_card_thumb_lock">
          <Icon icon="mdi:lock" />
        </div>
      )}
    </div>
  );
}

export function CourseCard({ item, enrolled, onEnroll, onContinue, loading }) {
  const levelLabel = item.level ? LEVEL_LABELS[item.level] || item.level : null;
  return (
    <div className={`cs_edu_hub_content_card cs_shadow_1 cs_radius_25 cs_white_bg ${enrolled ? 'cs_edu_hub_card_enrolled' : ''}`}>
      <Thumbnail src={item.thumbnail} alt={item.title} locked={!enrolled} />
      <div className="cs_edu_hub_content_card_body">
        <h3 className="cs_edu_hub_content_card_title">
          <Link to={detailUrl(item.id)} className="cs_edu_hub_card_title_link">{item.title}</Link>
        </h3>
        {item.description && <p className="cs_edu_hub_content_card_desc">{item.description}</p>}
        <div className="cs_edu_hub_content_card_meta">
          {levelLabel && <span className="cs_edu_hub_meta_badge">{levelLabel}</span>}
          {item.duration && <span className="cs_edu_hub_meta_text">{item.duration}</span>}
          {item.cmeCredits != null && item.cmeCredits > 0 && (
            <span className="cs_edu_hub_meta_badge cs_edu_hub_cme">CME {item.cmeCredits}</span>
          )}
        </div>
        <div className="cs_edu_hub_content_card_status">
          {enrolled ? <span className="cs_edu_hub_status_enrolled">Enrolled</span> : <span className="cs_edu_hub_status_not">Not Enrolled</span>}
        </div>
        <button
          type="button"
          className="cs_btn cs_style_1 cs_edu_hub_card_btn"
          onClick={enrolled ? () => onContinue(item) : () => onEnroll(item)}
          disabled={loading}
        >
          <span>{enrolled ? 'Watch Now' : 'Enroll to Access'}</span>
          <i>
            <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
            <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
          </i>
        </button>
      </div>
    </div>
  );
}

export function WebinarCard({ item, enrolled, onEnroll, onWatch, onAddToCalendar, loading }) {
  const isLive = item.type === 'live';
  const platformLabel = item.platform ? PLATFORM_LABELS[item.platform] || item.platform : null;
  const dateStr = item.scheduledAt
    ? new Date(item.scheduledAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
    : item.duration
    ? item.duration
    : null;
  return (
    <div className={`cs_edu_hub_content_card cs_shadow_1 cs_radius_25 cs_white_bg ${enrolled ? 'cs_edu_hub_card_enrolled' : ''}`}>
      <Thumbnail src={item.thumbnail} alt={item.title} locked={!enrolled} />
      <div className="cs_edu_hub_content_card_body">
        <span className={`cs_edu_hub_meta_badge ${isLive ? 'cs_edu_hub_live' : 'cs_edu_hub_recorded'}`}>
          {isLive ? 'Live' : 'Recording'}
        </span>
        {platformLabel && <span className="cs_edu_hub_meta_badge">{platformLabel}</span>}
        <h3 className="cs_edu_hub_content_card_title">
          <Link to={detailUrl(item.id)} className="cs_edu_hub_card_title_link">{item.title}</Link>
        </h3>
        {(item.speakerName || item.speakerTitle) && (
          <p className="cs_edu_hub_content_card_speaker">
            {[item.speakerName, item.speakerTitle].filter(Boolean).join(' · ')}
          </p>
        )}
        {dateStr && <p className="cs_edu_hub_content_card_meta_text">{dateStr}</p>}
        {item.description && <p className="cs_edu_hub_content_card_desc">{item.description}</p>}
        <div className="cs_edu_hub_content_card_actions">
          {enrolled ? (
            isLive ? (
              <>
                <button type="button" className="cs_btn cs_style_1 cs_edu_hub_card_btn" onClick={() => onAddToCalendar(item)}>
                  <span>Registered – Add to Calendar</span>
                </button>
                {item.contentLink && (
                  <a href={item.contentLink} target="_blank" rel="noopener noreferrer" className="cs_btn cs_style_1 cs_btn_white_bg cs_edu_hub_card_btn">
                    <span>Join</span>
                  </a>
                )}
              </>
            ) : (
              <button type="button" className="cs_btn cs_style_1 cs_edu_hub_card_btn" onClick={() => onWatch(item)}>
                <span>Watch Now</span>
                <i>
                  <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                  <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                </i>
              </button>
            )
          ) : (
            <button
              type="button"
              className="cs_btn cs_style_1 cs_edu_hub_card_btn"
              onClick={() => onEnroll(item)}
              disabled={loading}
            >
              <span>{isLive ? 'Enroll to Attend' : 'Enroll to Watch'}</span>
              <i>
                <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
              </i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function InfographicCard({ item, enrolled, onEnroll, onView, loading }) {
  const categoryLabel = item.categoryTag ? CATEGORY_TAG_LABELS[item.categoryTag] || item.categoryTag : null;
  const previewSrc = item.previewThumbnail || item.thumbnail;
  return (
    <div className={`cs_edu_hub_content_card cs_shadow_1 cs_radius_25 cs_white_bg ${enrolled ? 'cs_edu_hub_card_enrolled' : ''}`}>
      <Thumbnail src={previewSrc} alt={item.title} locked={!enrolled} className={!enrolled ? 'cs_edu_hub_thumb_blur' : ''} />
      <div className="cs_edu_hub_content_card_body">
        {categoryLabel && <span className="cs_edu_hub_meta_badge">{categoryLabel}</span>}
        <h3 className="cs_edu_hub_content_card_title">
          <Link to={detailUrl(item.id)} className="cs_edu_hub_card_title_link">{item.title}</Link>
        </h3>
        {item.description && <p className="cs_edu_hub_content_card_desc">{item.description}</p>}
        <button
          type="button"
          className="cs_btn cs_style_1 cs_edu_hub_card_btn"
          onClick={enrolled ? () => onView(item) : () => onEnroll(item)}
          disabled={loading}
        >
          <span>{enrolled ? 'View Infographic' : 'Enroll to Access'}</span>
          <i>
            <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
            <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
          </i>
        </button>
      </div>
    </div>
  );
}

export function PodcastCard({ item, enrolled, onEnroll, onPlay, loading }) {
  const isVideo = item.mediaType === 'video';
  const platformLabel = item.podcastPlatform ? PODCAST_PLATFORM_LABELS[item.podcastPlatform] || item.podcastPlatform : null;
  const durationStr = item.duration || null;
  return (
    <div className={`cs_edu_hub_content_card cs_shadow_1 cs_radius_25 cs_white_bg ${enrolled ? 'cs_edu_hub_card_enrolled' : ''}`}>
      <Thumbnail src={item.thumbnail} alt={item.title} locked={!enrolled} />
      <div className="cs_edu_hub_content_card_body">
        <span className="cs_edu_hub_meta_badge">{isVideo ? 'Video' : 'Audio'}</span>
        {platformLabel && <span className="cs_edu_hub_meta_badge">{platformLabel}</span>}
        {item.episodeNumber != null && <span className="cs_edu_hub_meta_text">Ep. {item.episodeNumber}</span>}
        {item.topicTag && <span className="cs_edu_hub_meta_badge">{item.topicTag}</span>}
        {durationStr && <span className="cs_edu_hub_meta_text">{durationStr}</span>}
        <h3 className="cs_edu_hub_content_card_title">
          <Link to={detailUrl(item.id)} className="cs_edu_hub_card_title_link">{item.title}</Link>
        </h3>
        {item.description && <p className="cs_edu_hub_content_card_desc">{item.description}</p>}
        <button
          type="button"
          className="cs_btn cs_style_1 cs_edu_hub_card_btn"
          onClick={enrolled ? () => onPlay(item) : () => onEnroll(item)}
          disabled={loading}
        >
          <span>
            {enrolled ? (isVideo ? 'Watch Now' : 'Listen Now') : isVideo ? 'Enroll to Watch' : 'Enroll to Listen'}
          </span>
          <i>
            <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
            <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
          </i>
        </button>
      </div>
    </div>
  );
}
