import React from 'react';
import Hero from './Hero';
import ImpactStatsSection from './ImpactStatsSection';
import AboutSection from './AboutSection';
import Section from './Section';
import FeaturesSection from './FeaturesSection';
import AwardSection from './AwardSection';
import OurServicesCards from './OurServicesCards';
import { pageTitle } from '../utils/PageTitle';
import { getAssetUrl } from '../config';

const featureListData = [
  {
    iconSrc: '/images/home_1/excellence.svg',
    title: 'Science',
    subTitle:
      'Evidence-based care and continuous learning grounded in medical science and best practice.',
  },
  {
    iconSrc: '/images/home_1/compassion.svg',
    title: 'Humanity',
    subTitle:
      'Compassionate, person-centered care that respects dignity and supports every patient.',
  },
  {
    iconSrc: '/images/home_1/integrity.svg',
    title: 'Honesty',
    subTitle:
      'Transparent communication, ethical practice, and trust in every interaction.',
  },
  {
    iconSrc: '/images/home_1/respect.svg',
    title: 'Safety',
    subTitle:
      'Infection prevention, patient safety, and a commitment to harm-free care.',
  },
];
const awardData = [
  {
    title: 'Specialist-Led Care',
    subTitle:
      'Expert guidance from an experienced infectious disease specialist.',
    iconUrl: '/images/icons/professional.svg',
  },
  {
    title: 'Integrated Services',
    subTitle:
      'Consultations, prevention, education, and institutional support in one platform.',
    iconUrl: '/images/icons/comprehensive.svg',
  },
  {
    title: 'Easy Access to Care',
    subTitle:
      'In-person, telemedicine, and WhatsApp-based service access.',
    iconUrl: '/images/icons/whatsapp.svg',
  },
  {
    title: 'Focus on Prevention & Education',
    subTitle:
      'Strong emphasis on infection control and continuous medical learning.',
    iconUrl: '/images/icons/graduation.svg',
  },
];
export default function Home() {
  pageTitle('Home');
  const homeData = {};
  const aboutData = {};
  const defaultSlides = [
    {
      label: 'Welcome to Best of IDs',
      title: 'Trusted Access to Infection Care,<br />Anywhere',
      subtitle:
        'A digital healthcare platform providing consultations, infection-focused second opinions, antibiotic guidance, patient services, and medical education accessible via web and WhatsApp.',
    },
    {
      label: 'Patient-Centric Care',
      title: 'Support for Every Patient, Every Step',
      subtitle:
        'Access appointments, telemedicine, infection-related second opinions, and upcoming medicine and lab services designed for patients with or without consultation.',
    },
    {
      label: 'For Healthcare Professionals',
      title: 'Clinical Guidance & Medical Education',
      subtitle:
        'A dedicated digital workspace for doctors and healthcare workers offering infection case support, antibiotic guidance, and structured medical education.',
    },
  ];
  const slides = homeData.title
    ? [{ label: 'Welcome to Best of IDs', title: homeData.title, subtitle: homeData.description || defaultSlides[0].subtitle }, ...defaultSlides.slice(1)]
    : defaultSlides;
  const heroTitle = homeData.title || 'Your Partner in Health and Wellness';
  const heroSubTitle = homeData.description || 'We are committed to providing you with the best medical and healthcare services to help you live healthier and happier.';
  const defaultAboutContent = 'Best of IDs was established to bring clarity, consistency, and clinical judgment to fever and infection care—areas where decisions often carry uncertainty and long-term impact. When access to specialist expertise is limited, thoughtful, experience-led guidance becomes essential. Founded by Dr. D. Suresh Kumar, Senior Consultant in Infectious Diseases with over 30 years of experience, Best of IDs reflects extensive work across public and private healthcare systems, spanning primary care settings to tertiary hospitals. This broad exposure informs an approach that is evidence-based, practical, and mindful of both patient needs and healthcare resources. What distinguishes Best of IDs is its integrated perspective. Clinical consultations, infection prevention, and education are shaped by real-world practice rather than theory alone, supporting decisions that are balanced, cost-conscious, and context appropriate. Best of IDs serves as a trusted clinical and knowledge partner, supporting safer care, sound decision-making, and sustainable healthcare practices.';
  const aboutContent = aboutData.content || aboutData.description || defaultAboutContent;

  return (
    <>
      <Section topMd={0} topLg={0} topXl={0}>
        <Hero
          slides={slides}
          title={heroTitle}
          subTitle={heroSubTitle}
          bgUrl="/images/home_1/hero_bg.png"
          imgUrls={['/images/home_1/hero_img.png']}
          videoBtnText="See how we work"
          videoUrl="https://www.youtube.com/embed/VcaAVWtP48A"
          infoCardTagline=""
          infoList={[]}
          quickLinks={[]}
        />
      </Section>
      <ImpactStatsSection />
      {/* Start Services & Appointments Section */}
      <Section topMd={16} topLg={14} topXl={8}>
        <OurServicesCards />
      </Section>
      {/* End Services & Appointments Section */}
      {/* Start About Section */}
      <Section topMd={28} topLg={24} topXl={20}>
        <AboutSection
          imgUrl="/images/home_1/about.png"
          title="ABOUT US"
          content={aboutContent}
        />
      </Section>
      {/* End About Section */}
      {/* Start Feature Section (Our Values) */}
      <Section
        topMd={30}
        topLg={28}
        topXl={24}
        bottomMd={0}
        bottomLg={0}
        bottomXl={0}
        className="cs_our_values_wrapper"
      >
        <div className="cs_our_values_section">
          <FeaturesSection sectionTitle="Our Values" data={featureListData} />
        </div>
      </Section>
      {/* End Feature Section */}
      {/* Start Why Choose Best of IDs Section */}
      <Section topMd={8} topLg={6} topXl={5}>
        <AwardSection
          sectionTitle="Why Choose Best of IDs?"
          sectionTitleDown="Expert Infectious Disease Care You Can Trust"
          sectionSubTitle="Best of IDs combines specialist medical leadership, ethical practice, and accessible care models to deliver reliable infectious disease services for patients, healthcare professionals, and institutions."
          data={awardData}
        />
      </Section>
      {/* End Why Choose Best of IDs Section */}
      {/* Vision & Mission – editorial diagonal layout, no cards, typography-led */}
      <Section topMd={32} topLg={28} topXl={24} bottomMd={0} bottomLg={0} bottomXl={0} className="cs_footer_margin_0">
        <div className="cs_vision_mission_editorial">
          <div className="container position-relative cs_vm_row">
            <img
              src={getAssetUrl('/images/best-of-ids-logo-watermark.png')}
              alt=""
              className="cs_vm_watermark"
              aria-hidden
            />
            <div className="cs_vm_vision">
              <h2 className="cs_vm_heading">Vision</h2>
              <p className="cs_vm_desc">
                Transform Infectious Disease care with science and humanity
              </p>
            </div>
            <div className="cs_vm_divider" aria-hidden />
            <div className="cs_vm_mission">
              <h2 className="cs_vm_heading">Mission</h2>
              <p className="cs_vm_desc">
                Deliver ethical care, prevention, education, and training
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
