import React, { useState, useEffect } from 'react';
import ContactInfoWidget from './ContactInfoWidget';
import MenuWidget from './MenuWidget';
import SocialWidget from './SocialWidget';
import Newsletter from './Newsletter';
import TextWidget from './TextWidget';
import { getAssetUrl } from '../config';
import { getCmsPage } from '../services/apiService';

const menuDataOne = [
  { title: 'Doctor & Hospital Services', href: '/doctor-hospital-services' },
  { title: 'Testimonials', href: '/contact-testimonials' },
];
const menuDataTwo = [
  { title: 'ID Education & Knowledge Hub', href: '/id-education-knowledge-hub' },
  { title: 'Contact & Testimonials', href: '/contact-testimonials' },
  { title: 'FAQs', href: '/' },
  { title: 'Privacy Policy', href: '/' },
  { title: 'Terms and Conditions', href: '/' },
];

const DEFAULT_TAGLINE = 'Best of IDs – Transforming Infectious Disease Care';
const DEFAULT_COPYRIGHT = 'Copyright © 2024 Best of IDs. All rights reserved.';

export default function Footer() {
  const [cmsFooter, setCmsFooter] = useState(null);

  useEffect(() => {
    getCmsPage('footer').then((p) => setCmsFooter(p)).catch(() => {});
  }, []);

  const d = cmsFooter?.data || {};
  const tagline = d.title || d.description || DEFAULT_TAGLINE;
  const copyrightText = d.content || DEFAULT_COPYRIGHT;

  return (
    <footer className="cs_footer cs_style_1 cs_heading_color">
      <div
        className="cs_footer_logo_wrap"
        style={{ backgroundImage: `url(${getAssetUrl('/images/footer_bg_1.svg')})` }}
      />
      <div className="cs_footer_main">
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="cs_footer_item">
                <div className="cs_footer_brand_in">
                  <img
                    src={getAssetUrl('/images/best-of-ids-logo-watermark.png')}
                    alt="Best of IDs"
                    className="cs_footer_brand_logo"
                  />
                </div>
                <TextWidget text={tagline} />
                <ContactInfoWidget />
              </div>
            </div>
            <div className="col-lg-2">
              <div className="cs_footer_item">
                <MenuWidget data={menuDataOne} />
              </div>
            </div>
            <div className="col-lg-2">
              <div className="cs_footer_item">
                <MenuWidget data={menuDataTwo} />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="cs_footer_item">
                <Newsletter
                  title="Be Our Subscribers"
                  subTitle="To get the latest news about health from our experts"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="cs_footer_bottom cs_accent_bg">
        <div className="container">
          <div className="cs_footer_bottom_in">
            <SocialWidget />
            <div className="cs_copyright">
              {copyrightText}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
