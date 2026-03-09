import React from 'react';
import SectionHeading from './SectionHeading';
import Spacing from './Spacing';
import DepartmentCarousel from './DepartmentCarousel';
import { getAssetUrl } from '../config';

export default function DepartmentSection({ sectionTitle, bgUrl, data }) {
  return (
    <div className="container">
      <div className="cs_departments cs_style_1 cs_white_color">
        <div
          className="cs_departments_bg cs_radius_25"
          style={{
            backgroundImage: `url(${getAssetUrl(bgUrl)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'left',
            backgroundRepeat: 'repeat-x',
          }}
        />
        <SectionHeading title={sectionTitle} center />
        <Spacing md="36" lg="28" />
        <div className="cs_department_list">
          <DepartmentCarousel data={data} />
        </div>
      </div>
    </div>
  );
}
