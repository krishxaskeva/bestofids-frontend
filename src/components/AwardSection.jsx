import React from 'react';
import SectionHeading from './SectionHeading';
import Spacing from './Spacing';
import IconBox from './ui/IconBox';

export default function AwardSection({ sectionTitle, sectionTitleDown, sectionSubTitle, data }) {
  return (
    <div className="container cs_why_choose_section">
      <SectionHeading
        title={sectionTitle}
        titleDown={sectionTitleDown}
        subTitle={sectionSubTitle}
      />
      <Spacing md="72" lg="50" />
      <div className="row gy-4">
        {data?.map((item, index) => (
          <div className="col-xxl-3 col-md-6" key={index}>
            <IconBox {...item} />
          </div>
        ))}
      </div>
    </div>
  );
}
