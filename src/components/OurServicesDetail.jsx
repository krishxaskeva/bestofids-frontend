import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Section from './Section';
import SectionHeading from './SectionHeading';
import Spacing from './Spacing';
import { getAssetUrl } from '../config';
import InquiryModal from './InquiryModal';

const CONTACT_URL = '/contact-testimonials';

const INQUIRY_TYPES = {
  ID_OPINION: 'id-opinion',
  PARTNERSHIP: 'partnership',
};

const FOR_DOCTORS_ITEMS = [
  'ID opinions for complex fever and infection cases',
  'Guidance on investigations and antimicrobial therapy',
  'Support for outpatient and hospital-based patients',
  'Stewardship-focused recommendations aligned with standards of care',
];

const FOR_HOSPITAL_ITEMS = [
  'Inpatient and outpatient ID consultations',
  'Management of complex and resistant infections',
  'Multidisciplinary collaboration',
  'Antimicrobial stewardship support',
];

const EDUCATION_ITEMS = [
  'Infectious disease courses and training programs',
  'Webinars and workshops',
  'CME-accredited learning activities',
  'Ongoing updates through newsletters and educational content',
];

function ServiceCard({ title, subtitle, items, buttonText, buttonHref, learnMoreHref, headerImage, rightImage, onInquiryClick, inquiryType, showLearnMore = true }) {
  const isInquiry = Boolean(onInquiryClick && inquiryType);
  const hasHeaderImg = Boolean(headerImage && !rightImage);
  return (
    <div className={`cs_our_services_detail_card ${hasHeaderImg ? 'cs_our_services_detail_card_has_header_img' : ''} ${rightImage ? 'cs_our_services_detail_card_has_right_img' : ''}`}>
      {hasHeaderImg ? (
        <div className="cs_our_services_detail_card_header_with_img">
          <span>{title}</span>
          <img src={headerImage} alt="" className="cs_our_services_detail_card_header_img" />
        </div>
      ) : (
        <div className="cs_our_services_detail_card_header">{title}</div>
      )}
      <div className={`cs_our_services_detail_card_body ${rightImage ? 'cs_our_services_detail_card_body_with_img' : ''}`}>
        <div className="cs_our_services_detail_card_body_content">
          <p className="cs_our_services_detail_card_subtitle">{subtitle}</p>
          <ul className="cs_our_services_detail_card_list">
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <div className="cs_our_services_detail_card_actions">
            {isInquiry ? (
              <button type="button" className="cs_btn cs_style_1" onClick={() => onInquiryClick(inquiryType)}>
                <span>{buttonText}</span>
                <i>
                  <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                  <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                </i>
              </button>
            ) : (
              <Link to={buttonHref} className="cs_btn cs_style_1">
                <span>{buttonText}</span>
                <i>
                  <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                  <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                </i>
              </Link>
            )}
            {showLearnMore && (
              <Link to={learnMoreHref} className="cs_our_services_detail_learn_more">
                Learn more
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            )}
          </div>
        </div>
        {rightImage && (
          <div className="cs_our_services_detail_card_body_img_wrap">
            <img src={rightImage} alt="" className="cs_our_services_detail_card_body_img" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function OurServicesDetail({ cardsOnly = false, skipCards = false }) {
  const [inquiryModal, setInquiryModal] = useState({ open: false, title: '', type: null });

  const openInquiry = (type) => {
    const title = type === INQUIRY_TYPES.ID_OPINION ? 'Request an ID Opinion' : 'Partner with Us';
    setInquiryModal({ open: true, title, type });
  };

  const closeInquiry = () => setInquiryModal({ open: false, title: '', type: null });

  const cardsContent = (
    <div className="cs_our_services_detail_cards">
      {/* Row 1: two cards side by side (For Doctors, For Hospital) */}
      <div className="cs_our_services_detail_cards_row cs_our_services_detail_cards_row_2">
        <ServiceCard
          title="For Doctors"
          subtitle="What we offer"
          items={FOR_DOCTORS_ITEMS}
          buttonText="Request an ID opinion"
          buttonHref="/doctor-hospital-services"
          learnMoreHref="/doctor-hospital-services"
          onInquiryClick={openInquiry}
          inquiryType={INQUIRY_TYPES.ID_OPINION}
        />
        <ServiceCard
          title="For Hospital and health organizations"
          subtitle="Clinical Infectious Disease Support"
          items={FOR_HOSPITAL_ITEMS}
          buttonText="Partner with us"
          buttonHref="/doctor-hospital-services"
          learnMoreHref="/doctor-hospital-services"
          onInquiryClick={openInquiry}
          inquiryType={INQUIRY_TYPES.PARTNERSHIP}
        />
      </div>
      {/* Row 2: one full-width card (Education) */}
      <div className="cs_our_services_detail_cards_row cs_our_services_detail_cards_row_1">
        <ServiceCard
          title="Education for healthcare professional"
          subtitle="CME credit points, courses & webinars"
          items={EDUCATION_ITEMS}
          buttonText="Explore educational programs"
          buttonHref="/id-education-knowledge-hub"
          learnMoreHref="/id-education-knowledge-hub"
          rightImage={getAssetUrl('/images/certification-continuing-education.png')}
          showLearnMore={false}
        />
      </div>
    </div>
  );

  if (cardsOnly) {
    return (
      <>
        {cardsContent}
        <InquiryModal
          isOpen={inquiryModal.open}
          onClose={closeInquiry}
          title={inquiryModal.title}
          type={inquiryModal.type}
        />
      </>
    );
  }

  if (skipCards) {
    return (
      <div className="cs_our_services_detail">
        <Section className="cs_our_services_approach_section" topMd={24} topLg={20} topXl={16} bottomMd={0} bottomLg={0} bottomXl={0}>
          <div className="container">
            <div className="cs_our_services_approach_separator">
              <span className="cs_our_services_approach_line" aria-hidden />
              <div className="cs_our_services_approach_heading">
                <SectionHeading title="Our approach" center />
              </div>
              <span className="cs_our_services_approach_line" aria-hidden />
            </div>
            <Spacing md="20" lg="16" />
            <p className="cs_heading_color text-center m-0 cs_our_services_detail_approach_tagline">
              Evidence-based · Collaborative · Prevention-focused · Patient-centered
            </p>
            <div className="cs_our_services_approach_separator_bottom">
              <span className="cs_our_services_approach_line_single" aria-hidden />
            </div>
          </div>
        </Section>
        <Section className="cs_our_services_cta_section" topMd={0} topLg={0} topXl={0} bottomMd={2} bottomLg={2} bottomXl={1}>
          <div className="container">
            <div className="cs_banner cs_style_1 cs_bg_filed cs_banner_cta cs_our_services_cta cs_our_services_cta_left_right" style={{ backgroundImage: `url(${getAssetUrl('/images/home_1/our_service_bg.png')})` }}>
              <div className="cs_banner_content">
                <div className="cs_our_services_cta_left">
                  <h2 className="cs_banner_title cs_white_color cs_fs_72">Let&apos;s get started</h2>
                  <p className="cs_banner_subtitle cs_white_color cs_fs_20 cs_medium m-0">
                    Whether you are a patient, Clinician, Healthcare organization, Best of ID&apos;s is here to support better
                    infectious disease care and prevention.
                  </p>
                </div>
                <div className="d-flex flex-wrap justify-content-end gap-3 cs_our_services_cta_buttons">
                  <Link to={CONTACT_URL} className="cs_btn cs_style_1 cs_btn_white_border">
                    <span>Contact us</span>
                    <i>
                      <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                      <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                    </i>
                  </Link>
                  <Link to={CONTACT_URL} className="cs_btn cs_style_1 cs_btn_white_bg cs_btn_teal_border">
                    <span>Schedule a consultation</span>
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
        <InquiryModal
          isOpen={inquiryModal.open}
          onClose={closeInquiry}
          title={inquiryModal.title}
          type={inquiryModal.type}
        />
      </div>
    );
  }

  return (
    <div className="cs_our_services_detail">
      {/* Service cards – shape wrap + container pattern like Doctors page */}
      <Section topMd={24} topLg={20} topXl={16} bottomMd={24} bottomLg={20} bottomXl={16}>
        <div className="cs_shape_wrap cs_our_services_detail_wrap">
          <div className="cs_shape_1" />
          <div className="container">
            {cardsContent}
          </div>
        </div>
      </Section>

      {/* Our approach – SectionHeading + separator lines from sides into text */}
      <Section className="cs_our_services_approach_section" topMd={24} topLg={20} topXl={16} bottomMd={0} bottomLg={0} bottomXl={0}>
        <div className="container">
          <div className="cs_our_services_approach_separator">
            <span className="cs_our_services_approach_line" aria-hidden />
            <div className="cs_our_services_approach_heading">
              <SectionHeading title="Our approach" center />
            </div>
            <span className="cs_our_services_approach_line" aria-hidden />
          </div>
          <Spacing md="20" lg="16" />
          <p className="cs_heading_color text-center m-0 cs_our_services_detail_approach_tagline">
            Evidence-based · Collaborative · Prevention-focused · Patient-centered
          </p>
          <div className="cs_our_services_approach_separator_bottom">
            <span className="cs_our_services_approach_line_single" aria-hidden />
          </div>
        </div>
      </Section>

      {/* Let's get started – CTA banner pattern like Doctors page */}
      <Section className="cs_our_services_cta_section" topMd={0} topLg={0} topXl={0} bottomMd={2} bottomLg={2} bottomXl={1}>
        <div className="container">
          <div className="cs_banner cs_style_1 cs_bg_filed cs_banner_cta cs_our_services_cta cs_our_services_cta_left_right" style={{ backgroundImage: `url(${getAssetUrl('/images/home_1/our_service_bg.png')})` }}>
            <div className="cs_banner_content">
              <div className="cs_our_services_cta_left">
                <h2 className="cs_banner_title cs_white_color cs_fs_72">
                  Let&apos;s get started
                </h2>
                <p className="cs_banner_subtitle cs_white_color cs_fs_20 cs_medium m-0">
                  Whether you are a patient, Clinician, Healthcare organization, Best of ID&apos;s is here to support better
                  infectious disease care and prevention.
                </p>
              </div>
              <div className="d-flex flex-wrap justify-content-end gap-3 cs_our_services_cta_buttons">
                <Link to={CONTACT_URL} className="cs_btn cs_style_1 cs_btn_white_border">
                  <span>Contact us</span>
                  <i>
                    <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                    <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" />
                  </i>
                </Link>
                <Link to={CONTACT_URL} className="cs_btn cs_style_1 cs_btn_white_bg cs_btn_teal_border">
                  <span>Schedule a consultation</span>
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

      <InquiryModal
        isOpen={inquiryModal.open}
        onClose={closeInquiry}
        title={inquiryModal.title}
        type={inquiryModal.type}
      />
    </div>
  );
}
