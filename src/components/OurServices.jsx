import React, { useState, useEffect } from 'react';
import Section from './Section';
import Breadcrumb from './Breadcrumb';
import OurServicesDetail from './OurServicesDetail';
import { pageTitle } from '../utils/PageTitle';
import { getCmsPage } from '../services/apiService';

const DEFAULT_INTRO_TITLE = 'When Fever and Infections Are\nUnclear, Experience Matters';
const DEFAULT_INTRO_SUBTITLE = 'Trusted Infectious Disease Care, Prevention and Education.';
const DEFAULT_INTRO_TAGLINE = 'Built on 3 Decades of Real Clinical Practice';
const DEFAULT_WHITE_TEXT = 'At Best of IDs, we provide specialist infectious disease services for patients, doctors, and healthcare organizations facing complex, uncertain, or high-risk infection scenarios. Our work is grounded in 3 Decades of clinical experience across public and private healthcare systems, supporting everything from individual patient care to large hospital infection prevention and accreditation programs.';

export default function OurServices() {
  pageTitle('Our Services');
  const [cms, setCms] = useState(null);

  useEffect(() => {
    getCmsPage('our-services').then((p) => setCms(p)).catch(() => {});
  }, []);

  const d = cms?.data || {};
  const introLabel = 'Our Services';
  const introTitle = d.title || DEFAULT_INTRO_TITLE;
  const introSubtitle = d.description || DEFAULT_INTRO_SUBTITLE;
  const introTagline = DEFAULT_INTRO_TAGLINE;
  const whiteText = d.content || DEFAULT_WHITE_TEXT;

  return (
    <>
      <Section topMd={140} topLg={95} topXl={75} bottomMd={40} bottomLg={32} bottomXl={26}>
        <Breadcrumb title="Our Services" />
      </Section>
      <Section topMd={40} topLg={32} topXl={26} bottomMd={40} bottomLg={32} bottomXl={26} className="cs_our_services_teal_section">
        <div className="cs_our_services_teal_intro">
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
        </div>
      </Section>
      <Section topMd={40} topLg={32} topXl={26} bottomMd={40} bottomLg={32} bottomXl={26} className="cs_our_services_white_section">
        <div className="cs_our_services_intro_white">
          <div className="cs_our_services_intro_white_inner">
            <p className="cs_our_services_intro_white_text m-0">
              {whiteText}
            </p>
          </div>
        </div>
      </Section>
      <OurServicesDetail />
    </>
  );
}
