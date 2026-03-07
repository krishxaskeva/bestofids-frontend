import React from 'react';
import Section from './Section';
import Breadcrumb from './Breadcrumb';
import DoctorDetailsSection from './DoctorDetailsSection';
import OurServicesDetail from './OurServicesDetail';
import { pageTitle } from '../utils/PageTitle';
import { getAssetUrl } from '../config';

const DEFAULT_INTRO_TITLE = 'When Fever and Infections Are\nUnclear, Experience Matters';
const DEFAULT_INTRO_SUBTITLE = 'Trusted Infectious Disease Care, Prevention and Education.';
const DEFAULT_INTRO_TAGLINE = 'Built on 3 Decades of Real Clinical Practice';
const DEFAULT_WHITE_TEXT = 'At Best of IDs, we provide specialist infectious disease services for patients, doctors, and healthcare organizations facing complex, uncertain, or high-risk infection scenarios.\nOur work is grounded in 3 Decades of clinical experience across public and private healthcare systems, supporting everything from individual patient care to large hospital infection prevention and accreditation programs.';

export default function OurServices() {
  pageTitle('Services & Appointments');
  const d = {};
  const introLabel = 'Services & Appointments';
  const introTitle = d.title || DEFAULT_INTRO_TITLE;
  const introSubtitle = d.description || DEFAULT_INTRO_SUBTITLE;
  const introTagline = DEFAULT_INTRO_TAGLINE;
  const whiteText = d.content || DEFAULT_WHITE_TEXT;

  return (
    <>
      <Section topMd={140} topLg={95} topXl={75} bottomMd={24} bottomLg={20} bottomXl={16}>
        <Breadcrumb title="Services & Appointments" />
      </Section>
      <Section topMd={24} topLg={20} topXl={16} bottomMd={12} bottomLg={10} bottomXl={8} className="cs_our_services_teal_section">
        <div
          className="cs_our_services_teal_intro cs_bg_filed"
          style={{ backgroundImage: `url(${getAssetUrl('/images/home_1/our_service_bg.png')})` }}
        >
          <div className="cs_our_services_teal_intro_img_wrap cs_our_services_teal_intro_img_wrap_left">
            <img
              src={getAssetUrl('/images/our_services/services_banner_right.png')}
              alt="Evidence-based care and clinical excellence"
              className="cs_our_services_teal_intro_img"
            />
          </div>
          <div className="cs_our_services_teal_intro_inner">
            <p className="cs_our_services_teal_intro_label m-0">{introLabel}</p>
            <h2 className="cs_our_services_teal_intro_title m-0">
              {introTitle.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br /></React.Fragment>)}
            </h2>
            <p className="cs_our_services_teal_intro_subtitle m-0">
              {introSubtitle}
            </p>
            <p className="cs_our_services_teal_intro_tagline m-0">
              {introTagline}
            </p>
          </div>
          <div className="cs_our_services_teal_intro_img_wrap cs_our_services_teal_intro_img_wrap_right">
            <img
              src={getAssetUrl('/images/our_services/services_banner_care.png')}
              alt="Healthcare professionals providing attentive patient care"
              className="cs_our_services_teal_intro_img"
            />
          </div>
        </div>
      </Section>
      <Section topMd={12} topLg={10} topXl={8} bottomMd={12} bottomLg={10} bottomXl={8} className="cs_our_services_white_section">
        <div className="cs_our_services_intro_white">
          <span className="cs_our_services_intro_white_separator" aria-hidden />
          <div className="cs_our_services_intro_white_inner">
            <div className="cs_our_services_intro_white_text m-0">
              {whiteText.split('\n').map((line, i) => (
                <span key={i} className="cs_our_services_intro_white_line">
                  {line}
                </span>
              ))}
            </div>
          </div>
          <span className="cs_our_services_intro_white_separator" aria-hidden />
        </div>
      </Section>
      <Section topMd={12} topLg={10} topXl={8} bottomMd={24} bottomLg={20} bottomXl={16} className="cs_shape_wrap cs_our_services_detail_wrap">
        <div className="cs_shape_1" aria-hidden />
        <DoctorDetailsSection
          embed
          bgUrl="/images/doctors/doctor_details_bg.svg"
          imgUrl="/images/doctors/dr_patient_care.png"
          name="Dr. D. Sureshkumar, Senior Consultant"
          designation="Infectious Disease Specialist"
          bulletPoints={[
            'Fever of unknown origin (PUO) and difficult fever',
            'Tuberculosis (TB)',
            'HIV and sexually transmitted infections (STIs)',
            'Post-exposure prophylaxis (PEP) after sexual exposure',
            'Recurrent or resistant infections',
            'Antimicrobial treatment complications',
            'Exposure-related infections, including animal bites',
          ]}
        >
          <OurServicesDetail cardsOnly />
        </DoctorDetailsSection>
      </Section>
      <OurServicesDetail skipCards />
    </>
  );
}
