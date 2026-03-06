import React from 'react';
import { getAssetUrl } from '../config';

export default function ContactForm() {
  return (
    <div className="cs_contact_form cs_style_1 cs_white_bg cs_radius_30">
      <div className="row">
        <div className="col-lg-6">
          <label className="cs_input_label cs_heading_color">Name</label>
          <input
            type="text"
            className="cs_form_field"
            placeholder="Type your name"
          />
          <div className="cs_height_42 cs_height_xl_25" />
        </div>
        <div className="col-lg-6">
          <label className="cs_input_label cs_heading_color">Email</label>
          <input
            type="email"
            className="cs_form_field"
            placeholder="your@email.com"
          />
          <div className="cs_height_42 cs_height_xl_25" />
        </div>
        <div className="col-lg-12">
          <label className="cs_input_label cs_heading_color">Subject</label>
          <input
            type="text"
            className="cs_form_field"
            placeholder="Your subject"
          />
          <div className="cs_height_42 cs_height_xl_25" />
        </div>
        <div className="col-lg-12">
          <label className="cs_input_label cs_heading_color">Message</label>
          <textarea
            cols={30}
            rows={10}
            className="cs_form_field"
            placeholder="Write your message here..."
            defaultValue={''}
          />
          <div className="cs_height_42 cs_height_xl_25" />
        </div>
        <div className="col-lg-12">
          <div className="cs_height_18" />
          <button className="cs_btn cs_style_1">
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
