import { Icon } from '@iconify/react';
import React from 'react';

const PHONE = '+91 98846 42428';
const EMAIL = 'bestof.ids30@gmail.com';
const LOCATION = 'Chennai';

export default function ContactInfoWidget() {
  return (
    <ul className="cs_contact_widget">
      <li>
        <i className="cs_accent_bg">
          <Icon icon="ep:location" />
        </i>
        {LOCATION}
      </li>
      <li>
        <i className="cs_accent_bg">
          <Icon icon="fluent:call-24-regular" />
        </i>
        <a href={`tel:${PHONE.replace(/\s/g, '')}`} className="cs_contact_widget_link">{PHONE}</a>
      </li>
      <li>
        <i className="cs_accent_bg">
          <Icon icon="bi:envelope" />
        </i>
        <a href={`mailto:${EMAIL}`} className="cs_contact_widget_link">{EMAIL}</a>
      </li>
    </ul>
  );
}
