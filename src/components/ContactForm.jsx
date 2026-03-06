import React from 'react';
import { getAssetUrl } from '../config';

export default function ContactForm() {
  return (
    <div className="cs_contact_form cs_style_1 cs_white_bg cs_radius_30 cs_contact_form_modal">
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <label className="cs_input_label cs_heading_color">Name</label>
          <input
            type="text"
            className="cs_form_field w-100"
            placeholder="Type your name"
          />
        </div>
        <div className="col-12 col-md-6">
          <label className="cs_input_label cs_heading_color">Email</label>
          <input
            type="email"
            className="cs_form_field w-100"
            placeholder="your@email.com"
          />
        </div>
        <div className="col-12">
          <label className="cs_input_label cs_heading_color">Subject</label>
          <input
            type="text"
            className="cs_form_field w-100"
            placeholder="Your subject"
          />
        </div>
        <div className="col-12">
          <label className="cs_input_label cs_heading_color">Message</label>
          <textarea
            cols={30}
            rows={5}
            className="cs_form_field w-100 cs_contact_form_textarea"
            placeholder="Write your message here..."
            defaultValue={''}
          />
        </div>
        <div className="col-12 cs_contact_form_submit_wrap">
          <button type="button" className="cs_btn cs_style_1 cs_contact_form_submit_btn">
            <span>Submit</span>
            <i>
              <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="Icon" />
              <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="Icon" />
            </i>
          </button>
        </div>
      </div>
    </div>
  );
}
