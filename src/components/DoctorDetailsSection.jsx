import { Icon } from '@iconify/react';
import React from 'react';
import List from './List';
import Spacing from './Spacing';
import { getAssetUrl } from '../config';

export default function DoctorDetailsSection({
  bgUrl,
  imgUrl,
  name,
  designation,
  description,
  bulletPoints,
  contactInfo,
  contactInfoHeading,
  bookAppointmentHref = 'https://wa.me/',
  embed = false,
  children,
}) {
  return (
    <div className="cs_doctor_details">
      <div
        className="cs_doctor_details_bg cs_bg_filed"
        style={{
          backgroundImage: `url(${getAssetUrl(bgUrl)})`,
        }}
      />
      <Spacing md="5" />
      <div className="container">
        <div className="cs_doctor_details_row">
          <div className="cs_doctor_details_photo_col">
            <div className="cs_single_doctor overflow-hidden cs_radius_20">
              <img src={getAssetUrl(imgUrl)} alt="Doctor" className="cs_doctor_details_photo_img" />
            </div>
          </div>
          <div className="cs_doctor_details_col position-relative d-flex flex-column">
            <Spacing md="8" />
            <h2 className="cs_fs_48 mb-0 cs_semibold">{name}</h2>
            <Spacing md="12" />
            <h3 className="cs_semibold cs_fs_24 mb-0">{designation}</h3>
            <Spacing md="32" />
            {bulletPoints && bulletPoints.length > 0 ? (
              <ul className="mb-0 cs_heading_color ps-3" style={{ lineHeight: 1.8 }}>
                {bulletPoints.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              description && <p className="mb-0 cs_heading_color">{description}</p>
            )}
            <a
              href={bookAppointmentHref}
              target="_blank"
              rel="noopener noreferrer"
              className="cs_doctor_details_book_btn"
            >
              <Icon icon="fa6-brands:whatsapp" aria-hidden />
              <span>Book an Appointment</span>
            </a>
            {contactInfo && contactInfo.length > 0 && (
              <>
                <Spacing md="35" lg="32" />
                <List
                  heading={contactInfoHeading}
                  iconUrl="/images/icons/schedule.svg"
                  data={contactInfo}
                />
              </>
            )}
          </div>
        </div>
        {embed && children}
      </div>
    </div>
  );
}
