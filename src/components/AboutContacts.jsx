import React, { useState, useEffect } from 'react';
import Breadcrumb from './Breadcrumb';
import Banner from './BannerSection';
import Section from './Section';
import GallerySection from './GallerySection';
import ContactInfoSection from './ContactInfoSection';
import TestimonialSection from './TestimonialSection';
import FaqSection from './FaqSection';
import ContactModal from './ContactModal';
import { pageTitle } from '../utils/PageTitle';
import { getAssetUrl } from '../config';
import { getCmsPage } from '../services/apiService';

const faqData = [
  {
    title: 'Do you provide consultations only for patients?',
    content:
      'No. We support patients, doctors, hospitals, and healthcare organizations.',
  },
  {
    title: 'Do you offer virtual consultations?',
    content:
      'Yes. Consultations are available both in person and online.',
  },
  {
    title: 'How can hospitals work with Best of IDs?',
    content:
      'Hospitals can connect with us for infectious disease care, infection prevention, and accreditation support.',
  },
  {
    title: 'How do I get started with Best of IDs?',
    content:
      'You can reach out through the Contact Us page, and our team will guide you.',
  },
  {
    title: 'Where can I find information about your education and training programs?',
    content:
      'Details are available under the ID Knowledge & Education section of the website.',
  },
];

const galleryData = [
  { imgUrl: '/images/latest%20activities/WhatsApp%20Image%202026-02-27%20at%204.03.53%20PM.jpeg' },
  { imgUrl: '/images/latest%20activities/WhatsApp%20Image%202026-02-27%20at%204.03.55%20PM.jpeg' },
  { imgUrl: '/images/latest%20activities/WhatsApp%20Image%202026-02-27%20at%204.03.58%20PM.jpeg' },
  { imgUrl: '/images/latest%20activities/WhatsApp%20Image%202026-02-27%20at%204.04.00%20PM.jpeg' },
  { imgUrl: '/images/latest%20activities/WhatsApp%20Image%202026-02-27%20at%204.04.02%20PM.jpeg' },
];

export default function AboutContacts() {
  pageTitle('Contact & Testimonials');
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [cmsContact, setCmsContact] = useState(null);

  useEffect(() => {
    getCmsPage('contact').then((p) => setCmsContact(p)).catch(() => {});
  }, []);

  const contactData = cmsContact?.data || {};
  const bannerTitle = contactData.title || 'Welcome to Best of IDs – Transforming Infectious Disease Care';
  const bannerSubTitle = contactData.description || 'Your Partner in Health and Wellness';
  const bannerImg = contactData.banner || getAssetUrl('/images/best-of-ids-logo-watermark.png');

  return (
    <>
      <Section topMd={140} topLg={95} topXl={75} bottomMd={24} bottomLg={20}>
        <Breadcrumb title="Contact & Testimonials" />
      </Section>
      <Banner
        className="cs_banner_welcome"
        bgUrl="/images/about/banner_bg.svg"
        imgUrl={bannerImg}
        title={bannerTitle}
        subTitle={bannerSubTitle}
        ctaLabel="Contact us"
        ctaOnClick={() => setContactModalOpen(true)}
      />
      <Section topMd={170} topLg={120} topXl={80}>
        <GallerySection
          sectionTitle="Our Facilities and <br />Latest Activities"
          sectionTitleUp="HAVE A LOOK AT"
          data={galleryData}
        />
      </Section>
      <Section
        topMd={185}
        topLg={145}
        topXl={105}
        bottomMd={200}
        bottomLg={150}
        bottomXl={110}
        className="cs_gray_bg_1 cs_faq_reviews_section"
      >
        <div className="container">
          <div className="row cs_faq_reviews_row">
            <div className="col-12 col-lg-6 cs_faq_col">
              <FaqSection
                sectionTitle="Frequently Asked Questions"
                data={faqData}
                alignLeft
              />
            </div>
            <div className="col-12 col-lg-6 cs_reviews_col">
              <TestimonialSection
                sectionTitle="Some Reviews"
                sectionTitleDown="Of our clients"
                useCards
              />
            </div>
          </div>
        </div>
      </Section>
      <Section
        topMd={200}
        topLg={150}
        topXl={100}
        bottomMd={200}
        bottomLg={150}
        bottomXl={110}
      >
        <ContactInfoSection sectionTitle="Find Us Here" />
      </Section>
      <ContactModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} />
    </>
  );
}
