import React, { useEffect, useState } from 'react';
import { getAssetUrl } from '../config';
import apiClient from '../api/client';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

export default function ContactForm({ isOpen, formType = 'contact-us' }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [submitting, setSubmitting] = useState(false);
  const isAppointment = formType === 'appointment';
  const [isMobileAppointmentFlow, setIsMobileAppointmentFlow] = useState(false);
  const [mobileStep, setMobileStep] = useState(1);

  useEffect(() => {
    if (!isAppointment || typeof window === 'undefined') return;
    const mql = window.matchMedia('(max-width: 575.98px)');
    const syncMobile = (eventLike) => {
      const matches = 'matches' in eventLike ? eventLike.matches : mql.matches;
      setIsMobileAppointmentFlow(matches);
      if (!matches) setMobileStep(1);
    };
    syncMobile(mql);
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', syncMobile);
      return () => mql.removeEventListener('change', syncMobile);
    }
    mql.addListener(syncMobile);
    return () => mql.removeListener(syncMobile);
  }, [isAppointment]);

  useEffect(() => {
    if (!isOpen) return;
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setPhone('');
    setPreferredDate('');
    setStatus(null);
    setSubmitting(false);
    setMobileStep(1);
  }, [isOpen, formType]);

  const canProceedToMessage = name.trim().length > 0 && email.trim().length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || !name.trim() || !email.trim() || !message.trim()) return;
    setSubmitting(true);
    setStatus(null);
    try {
      const res = await apiClient.post('/contact', {
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
        phone: phone.trim(),
        preferredDate,
        type: formType,
      });
      if (res.status === 200 && res.data?.success) {
        setStatus('success');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
        setPhone('');
        setPreferredDate('');
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error('Component error (ContactForm):', err.response?.data || err.message);
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      className="cs_contact_form cs_style_1 cs_white_bg cs_radius_30 cs_contact_form_modal"
      onSubmit={handleSubmit}
    >
      {status === 'success' ? (
        <div className="cs_contact_form_success_box" role="status" aria-live="polite">
          <h3 className="cs_contact_form_success_title">Submitted successfully</h3>
          <p className="cs_contact_form_success_text">
            Thanks for contacting Best of IDs. Your message has been sent and our team will get back to you shortly.
          </p>
          <div className="cs_contact_form_submit_wrap">
            <button
              type="button"
              className="cs_btn cs_style_1 cs_contact_form_submit_btn"
              onClick={() => setStatus(null)}
            >
              <span>Send another message</span>
              <i>
                <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" aria-hidden />
                <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" aria-hidden />
              </i>
            </button>
          </div>
        </div>
      ) : (
        <>
          {status === 'error' && (
            <p className="cs_inquiry_modal_error" role="alert">
              Something went wrong. Please try again.
            </p>
          )}
          <div className="row g-3">
            {isAppointment && isMobileAppointmentFlow && (
              <div className="col-12">
                <div className="cs_contact_mobile_steps" aria-hidden>
                  <span className={`cs_contact_mobile_step ${mobileStep === 1 ? 'active' : ''}`}>1. Details</span>
                  <span className="cs_contact_mobile_step_sep">/</span>
                  <span className={`cs_contact_mobile_step ${mobileStep === 2 ? 'active' : ''}`}>2. Message</span>
                </div>
              </div>
            )}

            {(!isAppointment || !isMobileAppointmentFlow || mobileStep === 1) && (
              <>
                <div className="col-12 col-md-6">
                  <label className="cs_input_label cs_heading_color" htmlFor="cs_contact_name">Name</label>
                  <input
                    id="cs_contact_name"
                    type="text"
                    className="cs_form_field w-100"
                    placeholder="Type your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={submitting}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="cs_input_label cs_heading_color" htmlFor="cs_contact_email">Email</label>
                  <input
                    id="cs_contact_email"
                    type="email"
                    className="cs_form_field w-100"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={submitting}
                  />
                </div>
                {isAppointment && (
                  <>
                    <div className="col-12 col-md-6">
                      <label className="cs_input_label cs_heading_color" htmlFor="cs_contact_phone">Phone</label>
                      <input
                        id="cs_contact_phone"
                        type="tel"
                        className="cs_form_field w-100"
                        placeholder="Your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={submitting}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="cs_input_label cs_heading_color" htmlFor="cs_contact_preferred_date">Preferred Date &amp; Time</label>
                      <DatePicker
                        id="cs_contact_preferred_date"
                        className="cs_form_field w-100 cs_form_field_datetime cs_picker_theme"
                        popupClassName="cs_picker_dropdown_theme"
                        value={preferredDate ? dayjs(preferredDate, 'YYYY-MM-DDTHH:mm') : null}
                        onChange={(value) => setPreferredDate(value ? value.format('YYYY-MM-DDTHH:mm') : '')}
                        showTime={{ use12Hours: true, format: 'hh:mm A' }}
                        format="DD-MM-YYYY hh:mm A"
                        placeholder="dd-mm-yyyy hh:mm AM/PM"
                        disabled={submitting}
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {(!isAppointment || !isMobileAppointmentFlow || mobileStep === 2) && (
              <>
                <div className="col-12">
                  <label className="cs_input_label cs_heading_color" htmlFor="cs_contact_subject">Subject</label>
                  <input
                    id="cs_contact_subject"
                    type="text"
                    className="cs_form_field w-100"
                    placeholder={isAppointment ? 'Appointment subject' : 'Your subject'}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={submitting}
                  />
                </div>
                <div className="col-12">
                  <label className="cs_input_label cs_heading_color" htmlFor="cs_contact_message">Message</label>
                  <textarea
                    id="cs_contact_message"
                    cols={30}
                    rows={5}
                    className="cs_form_field w-100 cs_contact_form_textarea"
                    placeholder="Write your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    disabled={submitting}
                  />
                </div>
              </>
            )}

            {isAppointment && isMobileAppointmentFlow ? (
              <div className="col-12 cs_contact_form_submit_wrap cs_contact_form_submit_wrap_mobile_steps">
                {mobileStep === 1 ? (
                  <button
                    type="button"
                    className="cs_btn cs_style_1 cs_contact_form_submit_btn"
                    onClick={() => setMobileStep(2)}
                    disabled={!canProceedToMessage || submitting}
                  >
                    <span>Next</span>
                    <i>
                      <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" aria-hidden />
                      <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" aria-hidden />
                    </i>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="cs_btn cs_style_1 cs_btn_white_bg cs_contact_form_submit_btn"
                      onClick={() => setMobileStep(1)}
                      disabled={submitting}
                    >
                      <span>Back</span>
                    </button>
                    <button
                      type="submit"
                      className="cs_btn cs_style_1 cs_contact_form_submit_btn"
                      disabled={submitting}
                    >
                      <span>{submitting ? 'Sending…' : 'Submit'}</span>
                      {!submitting && (
                        <i>
                          <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" aria-hidden />
                          <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" aria-hidden />
                        </i>
                      )}
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="col-12 cs_contact_form_submit_wrap">
                <button
                  type="submit"
                  className="cs_btn cs_style_1 cs_contact_form_submit_btn"
                  disabled={submitting}
                >
                  <span>{submitting ? 'Sending…' : 'Submit'}</span>
                  {!submitting && (
                    <i>
                      <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" aria-hidden />
                      <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" aria-hidden />
                    </i>
                  )}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </form>
  );
}
