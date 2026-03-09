import React from 'react';
import { getAssetUrl } from '../config';

const WHY_DOCTORS_CHOOSE = [
  { title: '3 decades of experience', description: 'Infectious disease expertise you can rely on.', iconUrl: '/images/icons/experience.svg' },
  { title: 'Practical, non-template guidance', description: 'Recommendations shaped by real clinical practice.', iconUrl: '/images/icons/comprehensive.svg' },
  { title: 'Respect for judgment and context', description: 'We strengthen your clinical decisions, not replace them.', iconUrl: '/images/icons/professional.svg' },
  { title: 'Safety, stewardship & outcomes', description: 'Focus on responsible care and better patient results.', iconUrl: '/images/icons/graduation.svg' },
  { title: 'Clear, timely support', description: 'Clear communication and timely support when you need it.', iconUrl: '/images/icons/whatsapp.svg' },
];

export default function WhyDoctorsChoose({ hideHeading = false }) {
  return (
    <section className="cs_why_doctors_choose">
      <div className="cs_why_doctors_choose_container container">
        {!hideHeading && (
          <h2 className="cs_why_doctors_choose_heading">Why Doctors Choose Best of IDs?</h2>
        )}
        <div className="cs_why_doctors_choose_grid">
          {WHY_DOCTORS_CHOOSE.map((item, index) => (
            <article key={index} className="cs_why_doctors_choose_card">
              <div className="cs_why_doctors_choose_card_top">
                <div className="cs_why_doctors_choose_card_icon">
                  <img src={getAssetUrl(item.iconUrl)} alt="" aria-hidden />
                </div>
                <h3 className="cs_why_doctors_choose_card_title">{item.title}</h3>
              </div>
              <p className="cs_why_doctors_choose_card_text">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
