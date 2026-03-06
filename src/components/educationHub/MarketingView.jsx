import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Section from '../Section';
import Breadcrumb from '../Breadcrumb';
import SectionHeading from '../SectionHeading';
import Spacing from '../Spacing';
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

const whoShouldJoinData = [
  { title: 'Doctors & PG Trainees', subTitle: 'CME & Clinical Learning', icon: 'mdi:doctor' },
  { title: 'Nurses & Infection Control', subTitle: 'Prevention & Safety', icon: 'mdi:heart-pulse' },
  { title: 'Clinical Pharmacists', subTitle: 'Antimicrobial Stewardship', icon: 'mdi:pill' },
];

const freeResourcesList = [
  'All Courses & Certification Programs',
  'Webinars & Recordings',
  'Infographics & Visual Guides',
  'Podcasts (Audio & Video)',
  'Newsletters & Updates',
];

const loginToAccessList = [
  { label: 'All content is free', icon: 'mdi:gift-outline' },
  { label: 'Create account & log in to access', icon: 'mdi:login' },
  { label: 'Track your learning progress', icon: 'mdi:chart-line' },
];

const createAccountBenefits = [
  'Access all courses, webinars & podcasts',
  'Track learning progress',
  'Get updates on new content',
];

function EduHubCard({ headerIcon, title, badges, subtitle, children }) {
  return (
    <div className="cs_edu_hub_card cs_shadow_1 cs_radius_25 cs_white_bg">
      <div className="cs_edu_hub_card_header">
        <span className="cs_edu_hub_card_icon cs_center" aria-hidden>
          <Icon icon={headerIcon} />
        </span>
        <h3 className="cs_edu_hub_card_title m-0">{title}</h3>
        {badges?.length > 0 && (
          <div className="cs_edu_hub_card_badges">
            {badges.map((b) => (
              <span key={b} className="cs_edu_hub_badge">
                {b}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="cs_edu_hub_card_body">
        {subtitle && <p className="cs_edu_hub_card_subtitle m-0">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}

function ReachPointList({ items }) {
  return (
    <div className="cs_edu_hub_point_list">
      {items.map((item, i) => (
        <div key={i} className="cs_doctors_reach_point_card">
          <span className="cs_doctors_reach_point_icon" aria-hidden>✓</span>
          <span className="cs_doctors_reach_point_text">{item}</span>
        </div>
      ))}
    </div>
  );
}

function loginUrl() {
  const redirect = encodeURIComponent('/id-education-knowledge-hub');
  return `/login?redirect=${redirect}`;
}

export default function MarketingView() {
  return (
    <>
      <Section topMd={140} topLg={95} topXl={75} bottomMd={24} bottomLg={20}>
        <Breadcrumb title="ID Education & Knowledge Hub" />
      </Section>

      <Section topMd={0} topLg={0} topXl={0} bottomMd={72} bottomLg={60} bottomXl={50}>
        <div className="container">
          <div className="cs_doctors_hero_section">
            <SectionHeading
              title="ID Education & Knowledge Hub"
              subTitle="Practical Infectious Disease Learning. Built for Real Healthcare Practice."
            />
            <Spacing md="25" lg="20" />
            <p className="cs_heading_color m-0">
              Our hub brings together courses, webinars, newsletters, infographics, and podcasts
              designed for healthcare professionals who want to strengthen their infectious disease
              knowledge and clinical practice. Whether you are a doctor, nurse, pharmacist, or
              trainee, you will find structured learning and practical resources to support your
              day-to-day practice.
            </p>
            <Spacing md="20" lg="16" />
            <p className="cs_heading_color m-0 cs_edu_hub_hero_callout">
              <Icon icon="mdi:check-circle" className="cs_edu_hub_callout_icon" aria-hidden />
              Everything is free — just log in to access all courses, webinars, and resources!
            </p>
            <Spacing md="24" lg="20" />
            <div className="d-flex flex-wrap gap-3">
              <Link to={loginUrl()} className="cs_btn cs_style_1">
                <span>Explore Courses</span>
                <i>
                  <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                  <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                </i>
              </Link>
              <Link to={loginUrl()} className="cs_btn cs_style_1 cs_btn_white_bg">
                <span>Register / Login</span>
                <i>
                  <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                  <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                </i>
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <Section topMd={85} topLg={70} topXl={55} bottomMd={55} bottomLg={45} bottomXl={40}>
        <div className="cs_shape_wrap cs_edu_hub_section_wrap">
          <div className="cs_shape_1" />
          <div className="container">
            <SectionHeading
              title="Courses & Certification Programs"
              subTitle="Structured learning to strengthen clinical decision-making & antimicrobial use."
              center
            />
            <Spacing md="36" lg="28" />
            <div className="cs_edu_hub_card cs_shadow_1 cs_radius_25 cs_white_bg">
              <div className="cs_edu_hub_card_body cs_edu_hub_card_body_only">
                <div className="cs_edu_hub_two_col">
                  <div className="cs_edu_hub_col">
                    <h4 className="cs_edu_hub_col_title">What You&apos;ll Find</h4>
                    <ReachPointList items={coursesWhatYouFind} />
                  </div>
                  <div className="cs_edu_hub_col">
                    <h4 className="cs_edu_hub_col_title">Who It&apos;s For</h4>
                    <ul className="cs_edu_hub_icon_list">
                      {coursesWhoItsFor.map((item, i) => (
                        <li key={i}>
                          <Icon icon={item.icon} className="cs_edu_hub_icon_list_icon" aria-hidden />
                          <span>{item.label}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="cs_edu_hub_btn_row">
                      <Link to={loginUrl()} className="cs_btn cs_style_1">
                        <span>Explore Courses</span>
                        <i>
                          <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                          <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                        </i>
                      </Link>
                      <Link to={loginUrl()} className="cs_btn cs_style_1 cs_btn_white_bg">
                        <span>Log In to Enroll</span>
                        <i>
                          <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                          <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                        </i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section topMd={85} topLg={70} topXl={55} bottomMd={55} bottomLg={45} bottomXl={40}>
        <div className="container">
          <div className="cs_edu_hub_two_cards_row">
            <div className="cs_edu_hub_two_cards_col">
              <EduHubCard
                headerIcon="mdi:video"
                title="Webinars"
                badges={['Live', 'Sessions']}
                subtitle="Interactive learning with ID experts."
              >
                <ReachPointList items={webinarsList} />
                <div className="cs_edu_hub_btn_row">
                  <Link to={loginUrl()} className="cs_btn cs_style_1">
                    <span>View Schedule</span>
                    <i>
                      <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                      <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                    </i>
                  </Link>
                  <Link to={loginUrl()} className="cs_btn cs_style_1 cs_btn_white_bg">
                    <span>Watch Recordings</span>
                    <i>
                      <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                      <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                    </i>
                  </Link>
                </div>
              </EduHubCard>
            </div>
            <div className="cs_edu_hub_two_cards_col">
              <EduHubCard
                headerIcon="mdi:chart-box"
                title="Infographics & Visual Learning"
                subtitle="Quick visual guides for clinical practice."
              >
                <ul className="cs_edu_hub_infographic_list">
                  {infographicsList.map((item, i) => (
                    <li key={i} className={item.muted ? 'cs_edu_hub_muted' : ''}>
                      <Icon icon={item.icon} className="cs_edu_hub_infographic_icon" aria-hidden />
                      <span>{item.label}</span>
                    </li>
                  ))}
                </ul>
                <Link to={loginUrl()} className="cs_btn cs_style_1">
                  <span>View Infographics</span>
                  <i>
                    <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                    <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                  </i>
                </Link>
              </EduHubCard>
            </div>
          </div>
        </div>
      </Section>

      <Section topMd={85} topLg={70} topXl={55} bottomMd={55} bottomLg={45} bottomXl={40}>
        <div className="cs_shape_wrap cs_edu_hub_section_wrap">
          <div className="cs_shape_1" />
          <div className="container">
            <EduHubCard
              headerIcon="mdi:microphone"
              title="Podcasts (Audio & Video)"
              badges={['New']}
              subtitle="Expert conversations on ID topics."
            >
              <div className="cs_edu_hub_two_col cs_edu_hub_podcast_row">
                <div className="cs_edu_hub_col">
                  <div className="cs_edu_hub_podcast_block">
                    <h4 className="cs_edu_hub_col_title">
                      <Icon icon="mdi:headphones" className="cs_edu_hub_block_icon" aria-hidden />
                      Audio Episodes
                    </h4>
                    <p className="m-0 cs_heading_color">On-the-Go Learning.</p>
                  </div>
                  <div className="cs_edu_hub_podcast_block">
                    <h4 className="cs_edu_hub_col_title">
                      <Icon icon="mdi:play-circle" className="cs_edu_hub_block_icon" aria-hidden />
                      Video Discussions
                    </h4>
                    <p className="m-0 cs_heading_color">Deep Dives & Interviews.</p>
                  </div>
                </div>
                <div className="cs_edu_hub_col">
                  <h4 className="cs_edu_hub_col_title">Topics Covered</h4>
                  <div className="cs_edu_hub_tags">
                    {podcastTopics.map((t, i) => (
                      <span key={i} className="cs_edu_hub_tag">
                        {t}
                      </span>
                    ))}
                  </div>
                  <Link to={loginUrl()} className="cs_btn cs_style_1">
                    <span>Listen Now</span>
                    <i>
                      <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                      <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                    </i>
                  </Link>
                </div>
              </div>
            </EduHubCard>
          </div>
        </div>
      </Section>

      <Section topMd={85} topLg={70} topXl={55} bottomMd={55} bottomLg={45} bottomXl={40}>
        <div className="cs_shape_wrap cs_edu_hub_who_join_row">
          <div className="cs_shape_1" />
          <div className="container">
            <SectionHeading
              title="Who Should Join?"
              subTitle="Designed for Healthcare Professionals."
              center
            />
            <Spacing md="36" lg="28" />
            <div className="cs_random_features cs_edu_hub_who_cards">
              {whoShouldJoinData.map((item, i) => (
                <div className="cs_random_features_col" key={i}>
                  <div className="cs_feature cs_style_1 cs_how_helps_card cs_shadow_1 cs_radius_25 cs_white_bg">
                    <span className="cs_how_helps_icon cs_accent_bg cs_center rounded-circle cs_edu_hub_who_icon">
                      <Icon icon={item.icon} aria-hidden />
                    </span>
                    <div className="cs_how_helps_content">
                      <h3 className="cs_how_helps_title cs_semibold m-0">{item.title}</h3>
                      <p className="cs_how_helps_desc m-0">{item.subTitle}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="cs_random_features_col cs_edu_hub_create_col">
                <div className="cs_edu_hub_create_block cs_shadow_1 cs_radius_25 cs_white_bg">
                  <h4 className="cs_edu_hub_col_title m-0">Create a Free Account</h4>
                  <p className="cs_heading_color m-0" style={{ marginBottom: 12 }}>All content is free. Log in to access everything.</p>
                  <div className="cs_edu_hub_point_list">
                    {createAccountBenefits.map((item, i) => (
                      <div key={i} className="cs_doctors_reach_point_card">
                        <span className="cs_doctors_reach_point_icon" aria-hidden>✓</span>
                        <span className="cs_doctors_reach_point_text">{item}</span>
                      </div>
                    ))}
                  </div>
                  <Link to={loginUrl()} className="cs_btn cs_style_1">
                    <span>Register / Login</span>
                    <i>
                      <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                      <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                    </i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section topMd={85} topLg={70} topXl={55} bottomMd={55} bottomLg={45} bottomXl={40}>
        <div className="cs_doctors_reach_section_wrap">
          <div className="container">
            <SectionHeading
              title="Access & Learning Options"
              subTitle="All content is free. Create a free account and log in to access courses, webinars, podcasts, and more."
              center
            />
            <Spacing md="36" lg="28" />
            <div className="cs_edu_hub_access_card cs_doctors_reach_card">
              <div className="cs_edu_hub_access_col">
                <h4 className="cs_edu_hub_access_col_title">What You Get (All Free)</h4>
                <ReachPointList items={freeResourcesList} />
              </div>
              <div className="cs_edu_hub_access_divider" aria-hidden />
              <div className="cs_edu_hub_access_col">
                <h4 className="cs_edu_hub_access_col_title">How It Works</h4>
                <ul className="cs_edu_hub_icon_list">
                  {loginToAccessList.map((item, i) => (
                    <li key={i}>
                      <Icon icon={item.icon} className="cs_edu_hub_icon_list_icon" aria-hidden />
                      <span>{item.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="cs_edu_hub_access_divider" aria-hidden />
              <div className="cs_edu_hub_access_col cs_edu_hub_access_col_create">
                <h4 className="cs_edu_hub_access_col_title">Create a Free Account</h4>
                <ReachPointList items={createAccountBenefits} />
                <Link to={loginUrl()} className="cs_btn cs_style_1">
                  <span>Register / Login</span>
                  <i>
                    <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                    <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                  </i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section topMd={85} topLg={70} topXl={55} bottomMd={200} bottomLg={150} bottomXl={110}>
        <div className="container">
          <div className="cs_banner cs_style_1 cs_bg_filed cs_banner_cta" style={{ backgroundImage: `url(${getAssetUrl('/images/home_1/our_service_bg.png')})` }}>
            <div className="cs_banner_content">
              <h2 className="cs_banner_title cs_white_color cs_fs_72">
                Start Learning With Best of IDs
              </h2>
              <p className="cs_banner_subtitle cs_white_color cs_fs_20 cs_medium m-0">
                All content is free — register and log in to access courses, webinars, and more.
              </p>
              <Spacing md="24" lg="20" />
              <Link to="/signup" className="cs_btn cs_style_1">
                <span>Register / Get Started</span>
                <i>
                  <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                  <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                </i>
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
