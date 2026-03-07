import { Icon } from '@iconify/react';
import React from 'react';

// Same social links as Contact & Testimonials page
const SOCIAL_LINKS = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/bestofids', icon: 'fa6-brands:linkedin-in' },
  { name: 'Instagram', url: 'https://www.instagram.com/bestofids?igsh=Y3lhZG10a25hN2cz', icon: 'fa6-brands:instagram' },
  { name: 'X', url: 'https://x.com/bestof_ids', icon: 'fa6-brands:x-twitter' },
  { name: 'Facebook', url: 'https://www.facebook.com/share/1DfwtSsjpA/', icon: 'fa6-brands:facebook-f' },
];

export default function SocialWidget() {
  return (
    <div className="cs_social_links_wrap">
      <h2>Follow Us</h2>
      <div className="cs_social_links">
        {SOCIAL_LINKS.map((item) => (
          <a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.name}
          >
            <Icon icon={item.icon} />
          </a>
        ))}
      </div>
    </div>
  );
}
