import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { getAssetUrl } from '../../config';

const coursesWhatYouFind = [
  'Short Courses & In-depth Programs',
  'Beginner to Advanced Levels',
  'Case-Based, Practice-Oriented',
  'All Courses Free (Login Required)',
  'CME Credits Available',
];

const coursesWhoItsFor = [
  { label: 'Doctors', icon: 'mdi:doctor' },
  { label: 'Postgraduate Trainees', icon: 'mdi:school' },
  { label: 'Nurses', icon: 'mdi:nurse' },
  { label: 'Clinical Pharmacists', icon: 'mdi:medical-bag' },
  { label: 'Healthcare Students', icon: 'mdi:account-school' },
];

const webinarsList = [
  'Clinical Updates',
  'Case Discussions',
  'Guideline-Based Reviews',
  'Interactive Q&A',
  'All Webinars Free (Login Required)',
];

const infographicsList = [
  { label: 'Diagnostic Pathways', icon: 'mdi:flask' },
  { label: 'Treatment Algorithms', icon: 'mdi:microscope' },
  { label: 'Infection Prevention', icon: 'mdi:stethoscope' },
  { label: 'Coming Soon', icon: 'mdi:clock-outline', muted: true },
];

const podcastTopics = ['Antibiotic Therapy', 'Clinical Cases', 'ID Guidelines', 'Research Updates'];

function CompactPointList({ items }) {
  return (
    <ul className="cs_edu_hub_banner_point_list">
      {items.map((item, i) => (
        <li key={i}>
          <span className="cs_edu_hub_banner_tick" aria-hidden>✓</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function DescriptionBanner({ tabKey, myLearningUrl }) {
  if (!['courses', 'webinars', 'infographics', 'podcasts'].includes(tabKey)) return null;

  return (
    <div className="cs_edu_hub_tab_banner cs_shadow_1 cs_white_bg">
      <div className="cs_edu_hub_tab_banner_inner">
        {tabKey === 'courses' && (
          <>
            <h2 className="cs_edu_hub_tab_banner_title">Courses & Certification Programs</h2>
            <p className="cs_edu_hub_tab_banner_subtitle">Structured learning to strengthen clinical decision-making & antimicrobial use.</p>
            <div className="cs_edu_hub_banner_two_col">
              <div className="cs_edu_hub_banner_col">
                <h4 className="cs_edu_hub_banner_col_title">What You&apos;ll Find</h4>
                <CompactPointList items={coursesWhatYouFind} />
              </div>
              <div className="cs_edu_hub_banner_col">
                <h4 className="cs_edu_hub_banner_col_title">Who It&apos;s For</h4>
                <ul className="cs_edu_hub_banner_icon_list">
                  {coursesWhoItsFor.map((item, i) => (
                    <li key={i}>
                      <Icon icon={item.icon} className="cs_edu_hub_banner_icon" aria-hidden />
                      <span>{item.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}

        {tabKey === 'webinars' && (
          <>
            <h2 className="cs_edu_hub_tab_banner_title">Webinars</h2>
            <p className="cs_edu_hub_tab_banner_subtitle">Interactive learning with ID experts.</p>
            <h4 className="cs_edu_hub_banner_col_title">What You&apos;ll Find</h4>
            <CompactPointList items={webinarsList} />
          </>
        )}

        {tabKey === 'infographics' && (
          <>
            <h2 className="cs_edu_hub_tab_banner_title">Infographics & Visual Learning</h2>
            <p className="cs_edu_hub_tab_banner_subtitle">Quick visual guides for clinical practice.</p>
            <h4 className="cs_edu_hub_banner_col_title">Categories</h4>
            <ul className="cs_edu_hub_banner_icon_list">
              {infographicsList.map((item, i) => (
                <li key={i} className={item.muted ? 'cs_edu_hub_banner_muted' : ''}>
                  <Icon icon={item.icon} className="cs_edu_hub_banner_icon" aria-hidden />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        {tabKey === 'podcasts' && (
          <>
            <h2 className="cs_edu_hub_tab_banner_title">Podcasts (Audio & Video)</h2>
            <p className="cs_edu_hub_tab_banner_subtitle">Expert conversations on ID topics.</p>
            <div className="cs_edu_hub_banner_two_col">
              <div className="cs_edu_hub_banner_col">
                <div className="cs_edu_hub_banner_podcast_block">
                  <h4 className="cs_edu_hub_banner_col_title">
                    <Icon icon="mdi:headphones" className="cs_edu_hub_banner_icon" aria-hidden />
                    Audio Episodes
                  </h4>
                  <p className="cs_edu_hub_banner_desc">On-the-Go Learning.</p>
                </div>
                <div className="cs_edu_hub_banner_podcast_block">
                  <h4 className="cs_edu_hub_banner_col_title">
                    <Icon icon="mdi:play-circle" className="cs_edu_hub_banner_icon" aria-hidden />
                    Video Discussions
                  </h4>
                  <p className="cs_edu_hub_banner_desc">Deep Dives & Interviews.</p>
                </div>
              </div>
              <div className="cs_edu_hub_banner_col">
                <h4 className="cs_edu_hub_banner_col_title">Topics Covered</h4>
                <div className="cs_edu_hub_banner_tags">
                  {podcastTopics.map((t, i) => (
                    <span key={i} className="cs_edu_hub_banner_tag">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {myLearningUrl && (
          <div className="cs_edu_hub_tab_banner_actions">
            <Link to={myLearningUrl} className="cs_btn cs_style_1 cs_btn_white_bg">
              <span>My Learning</span>
              <i>
                <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
              </i>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
