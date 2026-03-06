import React, { useState, useEffect } from 'react';
import Banner from './BannerSection';
import Section from './Section';
import parse from 'html-react-parser';
import { pageTitle } from '../utils/PageTitle';
import { getCmsPage } from '../services/apiService';
import { getAssetUrl } from '../config';

const DEFAULT_BANNER_TITLE = 'Best of IDs <br>Timetable';
const DEFAULT_BANNER_SUBTITLE = "Get to know the complete info of our <br>doctors' schedule";

const defaultTimeTable = [
  {
    day: 'Monday',
    schedules: [
      { hour: 1, department: '', doctor: '', roomNumber: '' },
      { hour: 3, department: 'Pediatric Department <br />9:00 AM - 12:00 PM', doctor: 'Dr. Sarah Patel <br />Dr. David Nguyen', roomNumber: 'Room 101' },
      { hour: 2, department: 'Cardiology Department <br />1:00 PM - 2:00 PM', doctor: 'Dr. James Lee <br />Dr. Michelle Kim', roomNumber: 'Room 202' },
      { hour: 1, department: '', doctor: '', roomNumber: '' },
    ],
  },
  { day: 'Tuesday', schedules: [{ hour: 1, department: '', doctor: '', roomNumber: '' }] },
  { day: 'Wednesday', schedules: [{ hour: 1, department: '', doctor: '', roomNumber: '' }] },
  { day: 'Thrusday', schedules: [{ hour: 1, department: '', doctor: '', roomNumber: '' }] },
  { day: 'Friday', schedules: [{ hour: 1, department: '', doctor: '', roomNumber: '' }] },
  { day: 'Saturday', schedules: [{ hour: 1, department: '', doctor: '', roomNumber: '' }] },
];

function parseTimetableContent(content) {
  if (!content || typeof content !== 'string') return null;
  try {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

export default function Timetable() {
  pageTitle('Timetable');
  const [cms, setCms] = useState(null);

  useEffect(() => {
    getCmsPage('timetable').then((p) => setCms(p)).catch(() => {});
  }, []);

  const d = cms?.data || {};
  const bannerTitle = d.title || DEFAULT_BANNER_TITLE;
  const bannerSubtitle = d.description || DEFAULT_BANNER_SUBTITLE;
  const timeTable = parseTimetableContent(d.content) || defaultTimeTable;

  return (
    <>
      <Section topMd={170} topLg={120} topXl={100}>
        <Banner
          bgUrl="/images/timetable/banner_bg.svg"
          imgUrl={getAssetUrl('/images/timetable/banner_img.png')}
          title={bannerTitle}
          subTitle={bannerSubtitle}
        />
      </Section>
      <Section
        topMd={0}
        topLg={0}
        topXl={0}
        bottomMd={200}
        bottomLg={150}
        bottomXl={110}
      >
        <div className="container">
          <div className="table-responsive-xl">
            <div className="cs_timetable">
              <div className="cs_timetable_vertical">
                <div>8:00 AM</div>
                <div>9:00 AM</div>
                <div>10:00 AM</div>
                <div>11:00 AM</div>
                <div>12:00 PM</div>
                <div>1:00 PM</div>
                <div>2:00 PM</div>
                <div>3:00 PM</div>
                <div>4:00 PM</div>
                <div>5:00 PM</div>
                <div>6:00 PM</div>
                <div>7:00 PM</div>
                <div>8:00 PM</div>
                <div>9:00 PM</div>
              </div>
              <div className="cs_timetable_in">
                {timeTable?.map((item, index) => (
                  <div key={index}>
                    <div className="cs_timetable_date cs_heading_color">
                      {item.day}
                    </div>
                    {item.schedules?.map((schedule, index) => (
                      <div className={`cs_hour_${schedule.hour}`} key={index}>
                        {(schedule.department || schedule.doctor) && (
                          <div className="cs_table_doctor">
                            <div>
                              {schedule.department && (
                                <p>{parse(schedule.department)}</p>
                              )}
                              {schedule.doctor && (
                                <p className="cs_medium cs_heading_color">
                                  {parse(schedule.doctor)}
                                </p>
                              )}
                            </div>
                            {schedule.roomNumber && (
                              <div>{schedule.roomNumber}</div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
