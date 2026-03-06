import React from 'react';
import SectionHeading from './SectionHeading';
import Spacing from './Spacing';
import Accordion from './ui/Accordion';

export default function FaqSection({ data, sectionTitle, sectionTitleUp, alignLeft }) {
  return (
    <div className={`container ${alignLeft ? 'cs_faq_align_left' : ''}`}>
      <SectionHeading title={sectionTitle} titleUp={sectionTitleUp} center={!alignLeft} />
      <Spacing md="72" lg="50" />
      <div className="row">
        <div className={alignLeft ? 'col-12' : 'col-lg-8 offset-lg-2'}>
          <Accordion variant="cs_style1" data={data} />
        </div>
      </div>
    </div>
  );
}
