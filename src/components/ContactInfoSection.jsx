import React from 'react';
import { Icon } from '@iconify/react';
import Spacing from './Spacing';

const socialLinks = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/bestofids', icon: 'fa6-brands:linkedin-in' },
  { name: 'Instagram', url: 'https://www.instagram.com/bestofids?igsh=Y3lhZG10a25hN2cz', icon: 'fa6-brands:instagram' },
  { name: 'X', url: 'https://x.com/bestof_ids', icon: 'fa6-brands:x-twitter' },
  { name: 'Facebook', url: 'https://www.facebook.com/share/1DfwtSsjpA/', icon: 'fa6-brands:facebook-f' },
];

export default function ContactInfoSection({ sectionTitle }) {
  return (
    <div className="container">
      <h2 className="cs_fs_72 mb-0">{sectionTitle}</h2>
      <Spacing md="70" lg="50" />
      <div className="cs_find_us_cards_and_social_row">
        <div className="cs_find_us_cards_wrap">
          <div className="cs_find_us_card">
            <div className="cs_find_us_card_icon cs_find_us_card_icon_iconify">
              <Icon icon="fluent:call-24-regular" />
            </div>
            <div className="cs_find_us_card_body">
              <span className="cs_find_us_card_label">Phone</span>
              <span className="cs_find_us_card_value">123-456-7890</span>
            </div>
          </div>
          <div className="cs_find_us_card">
            <div className="cs_find_us_card_icon cs_find_us_card_icon_iconify">
              <Icon icon="bi:envelope" />
            </div>
            <div className="cs_find_us_card_body">
              <span className="cs_find_us_card_label">Email</span>
              <span className="cs_find_us_card_value">hellocallcenter@gmail.com</span>
            </div>
          </div>
          <div className="cs_find_us_card">
            <div className="cs_find_us_card_icon cs_find_us_card_icon_iconify">
              <Icon icon="ep:location" />
            </div>
            <div className="cs_find_us_card_body">
              <span className="cs_find_us_card_label">Location</span>
              <span className="cs_find_us_card_value">123 Anywhere St., Any City, 12345</span>
            </div>
          </div>
        </div>
        <div className="cs_find_us_social_icons_row">
          {socialLinks.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="cs_find_us_social_icon_only"
              aria-label={item.name}
            >
              <Icon icon={item.icon} />
            </a>
          ))}
        </div>
      </div>
      <Spacing md="35" />
      {/* Start Google Map */}
      <div className="cs_map">
        <iframe
          id="map"
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96652.27317354927!2d-74.33557928194516!3d40.79756494697628!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c3a82f1352d0dd%3A0x81d4f72c4435aab5!2sTroy+Meadows+Wetlands!5e0!3m2!1sen!2sbd!4v1563075599994!5m2!1sen!2sbd"
          allowFullScreen
        />
      </div>
      {/* End Google Map */}
    </div>
  );
}
