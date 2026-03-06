import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { getAssetUrl } from '../config';
import apiClient from '../api/client';

export default function InquiryModal({ isOpen, onClose, title, type }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      setStatus(null);
      setName('');
      setEmail('');
      setMessage('');
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || !name.trim() || !email.trim() || !message.trim() || !type) return;
    setSubmitting(true);
    setStatus(null);
    try {
      const res = await apiClient.post('/contact', {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        type,
      });
      if (res.status === 200 && res.data?.success) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="cs_contact_modal active"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cs_inquiry_modal_title"
    >
      <div className="cs_contact_modal_overlay" onClick={onClose} aria-hidden="true" />
      <div className="cs_contact_modal_content">
        <div className="cs_contact_modal_container">
          <button
            type="button"
            className="cs_contact_modal_close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <Icon icon="mdi:close" aria-hidden />
          </button>
          <h2 id="cs_inquiry_modal_title" className="cs_contact_modal_title cs_heading_color">
            {title}
          </h2>
          {status === 'success' ? (
            <p className="cs_contact_modal_desc cs_heading_color cs_inquiry_modal_success">
              Your message has been sent. We&apos;ll get back to you soon.
            </p>
          ) : (
            <>
              <p className="cs_contact_modal_desc cs_heading_color">
                Share your details and we&apos;ll respond as soon as we can.
              </p>
              {status === 'error' && (
                <p className="cs_inquiry_modal_error" role="alert">
                  Something went wrong. Please try again.
                </p>
              )}
              <form onSubmit={handleSubmit} className="cs_contact_form cs_style_1 cs_white_bg cs_radius_30">
                <div className="row">
                  <div className="col-12">
                    <label className="cs_input_label cs_heading_color">Name</label>
                    <input
                      type="text"
                      className="cs_form_field"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={submitting}
                    />
                    <div className="cs_height_42 cs_height_xl_25" />
                  </div>
                  <div className="col-12">
                    <label className="cs_input_label cs_heading_color">Email</label>
                    <input
                      type="email"
                      className="cs_form_field"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={submitting}
                    />
                    <div className="cs_height_42 cs_height_xl_25" />
                  </div>
                  <div className="col-12">
                    <label className="cs_input_label cs_heading_color">Message</label>
                    <textarea
                      cols={30}
                      rows={5}
                      className="cs_form_field"
                      placeholder="Write your message here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      disabled={submitting}
                    />
                    <div className="cs_height_42 cs_height_xl_25" />
                  </div>
                  <div className="col-12">
                    <div className="cs_height_18" />
                    <button
                      type="submit"
                      className="cs_btn cs_style_1"
                      disabled={submitting}
                    >
                      <span>{submitting ? 'Sending…' : 'Send message'}</span>
                      {!submitting && (
                        <i>
                          <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" aria-hidden />
                          <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" aria-hidden />
                        </i>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
