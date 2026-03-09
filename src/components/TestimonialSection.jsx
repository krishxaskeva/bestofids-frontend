import React from 'react';
import SectionHeading from './SectionHeading';
import Spacing from './Spacing';
import Testimonial from './ui/Testimonial';
import TestimonialCards from './ui/TestimonialCards';

export default function TestimonialSection({ sectionTitle, sectionTitleDown, useCards }) {
  return (
    <div className={`container ${useCards ? 'cs_testimonial_cards_container' : ''}`}>
      <SectionHeading
        title={sectionTitle}
        titleDown={sectionTitleDown}
        center={!useCards}
      />
      <Spacing md="72" lg="50" />
      {useCards ? <TestimonialCards /> : <Testimonial />}
    </div>
  );
}
