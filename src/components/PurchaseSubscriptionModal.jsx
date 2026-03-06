import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { getAssetUrl } from '../config';

export default function PurchaseSubscriptionModal({ isOpen, onClose }) {
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
    <div className="cs_purchase_modal active" role="dialog" aria-modal="true" aria-labelledby="cs_purchase_modal_title">
      <div className="cs_purchase_modal_overlay" onClick={onClose} aria-hidden="true" />
      <div className="cs_purchase_modal_content">
        <div className="cs_purchase_modal_container">
          <button
            type="button"
            className="cs_purchase_modal_close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <Icon icon="mdi:close" aria-hidden />
          </button>
          <h2 id="cs_purchase_modal_title" className="cs_purchase_modal_title cs_heading_color">
            Subscribe to access all blogs
          </h2>
          <p className="cs_purchase_modal_desc cs_heading_color">
            Get a subscription to read all blog articles, case discussions, and downloadable resources
            from Best of IDs. New content is added regularly to support your continuous learning and
            clinical decisions.
          </p>
          <ul className="cs_purchase_modal_benefits cs_heading_color">
            <li>Full access to all current and future blog posts</li>
            <li>Case discussions and clinical pearls</li>
            <li>Downloadable resources and summaries</li>
            <li>Updates on infectious disease practice and guidelines</li>
          </ul>
          <div className="cs_purchase_modal_actions">
            <Link to="/contact-testimonials" className="cs_btn cs_style_1" onClick={onClose}>
              <span>Purchase subscription</span>
              <i>
                <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" aria-hidden />
                <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" aria-hidden />
              </i>
            </Link>
            <button type="button" className="cs_btn cs_style_1 cs_btn_white_bg" onClick={onClose}>
              <span>Cancel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
