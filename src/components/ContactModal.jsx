import React, { useEffect } from 'react';
import { Icon } from '@iconify/react';
import ContactForm from './ContactForm';

export default function ContactModal({
  isOpen,
  onClose,
  title = 'Contact Us',
  description = 'Kindly reach us to get the fastest response and treatment',
  formType = 'contact-us',
}) {
  const modalContainerClassName = `cs_contact_modal_container${formType === 'appointment' ? ' cs_contact_modal_container--appointment' : ''}`;
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="cs_contact_modal active"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cs_contact_modal_title"
    >
      <div className="cs_contact_modal_overlay" onClick={onClose} aria-hidden="true" />
      <div className="cs_contact_modal_content">
        <div className={modalContainerClassName}>
          <header className="cs_contact_modal_header">
            <h2 id="cs_contact_modal_title" className="cs_contact_modal_title cs_heading_color">
              {title}
            </h2>
            <p className="cs_contact_modal_desc cs_heading_color">
              {description}
            </p>
            <button
              type="button"
              className="cs_contact_modal_close"
              onClick={onClose}
              aria-label="Close modal"
            >
              <Icon icon="mdi:close" aria-hidden />
            </button>
          </header>
          <ContactForm isOpen={isOpen} formType={formType} />
        </div>
      </div>
    </div>
  );
}
