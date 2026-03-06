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
}) {
  return (
    <div className="cs_doctor_details">
      <div
        className="cs_doctor_details_bg cs_bg_filed"
        style={{
          backgroundImage: `url(${getAssetUrl(bgUrl)})`,
        }}
      />
      <Spacing md="85" />
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-5">
            <div className="cs_single_doctor overflow-hidden cs_radius_20">
              <img src={getAssetUrl(imgUrl)} alt="Doctor" className="w-100" />
            </div>
          </div>
          <div className="col-lg-6 offset-lg-1 position-relative cs_doctor_details_col">
            <Spacing md="55" />
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
      </div>
    </div>
  );
}
