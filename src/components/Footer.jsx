import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ContactInfoWidget from "./ContactInfoWidget";
import MenuWidget from "./MenuWidget";
import SocialWidget from "./SocialWidget";
import TextWidget from "./TextWidget";
import InquiryModal from "./InquiryModal";
import ContactModal from "./ContactModal";
import { getAssetUrl } from "../config";

const INQUIRY_TYPES = {
  ID_OPINION: "id-opinion",
  PARTNERSHIP: "partnership",
};

// Navbar pages only (same as header nav)
const navMenuData = [
  { title: "Home", href: "/" },
  { title: "Services & Appointments", href: "/our-services" },
  { title: "Patient Care & Knowledge", href: "/patient-care-appointments" },
  { title: "Doctor & Hospital Services", href: "/doctor-hospital-services" },
  {
    title: "ID Education & Knowledge Hub",
    href: "/id-education-knowledge-hub",
  },
  { title: "Contact & Testimonials", href: "/contact-testimonials" },
];

const WHATSAPP_NUMBER = "919884642428";

const DEFAULT_TAGLINE = "Best of IDs – Transforming Infectious Disease Care";
const DEFAULT_COPYRIGHT = "Copyright © 2026 Best of IDs. All rights reserved.";

function isCurrentPage(href, pathname) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Footer() {
  const { pathname } = useLocation();
  const [inquiryModal, setInquiryModal] = useState({
    open: false,
    title: "",
    type: null,
  });
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const openInquiry = (type) => {
    const title =
      type === INQUIRY_TYPES.ID_OPINION
        ? "Request an ID Opinion"
        : "Partner with Us";
    setInquiryModal({ open: true, title, type });
  };
  const closeInquiry = () =>
    setInquiryModal({ open: false, title: "", type: null });

  const d = {};
  const tagline = d.title || d.description || DEFAULT_TAGLINE;
  const copyrightText = d.content || DEFAULT_COPYRIGHT;

  // Show only pages we are not currently on
  const footerNavLinks = navMenuData.filter(
    (item) => !isCurrentPage(item.href, pathname),
  );

  return (
    <footer className="cs_footer cs_style_1">
      <div
        className="cs_footer_logo_wrap"
        style={{
          backgroundImage: `url(${getAssetUrl("/images/footer_bg_1.svg")})`,
        }}
      />
      <div className="cs_footer_main">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-4">
              <div className="cs_footer_item">
                <div className="cs_footer_brand_in">
                  <img
                    src={getAssetUrl("/images/best-of-ids-logo-watermark.png")}
                    alt="Best of IDs"
                    className="cs_footer_brand_logo"
                  />
                </div>
                <TextWidget text={tagline} />
                <ContactInfoWidget />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="cs_footer_item cs_footer_nav_center">
                <MenuWidget data={footerNavLinks} />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="cs_footer_item cs_footer_cta_buttons">
                <button
                  type="button"
                  className="cs_btn cs_style_1 cs_footer_cta_btn"
                  onClick={() => setContactModalOpen(true)}
                >
                  <span>Book an appointment</span>
                  <i>
                    <img
                      src={getAssetUrl("/images/icons/arrow_white.svg")}
                      alt=""
                    />
                    <img
                      src={getAssetUrl("/images/icons/arrow_white.svg")}
                      alt=""
                    />
                  </i>
                </button>
                <button
                  type="button"
                  className="cs_btn cs_style_1 cs_btn_white_bg cs_footer_cta_btn"
                  onClick={() => openInquiry(INQUIRY_TYPES.ID_OPINION)}
                >
                  <span>Request an ID opinion</span>
                  <i>
                    <img
                      src={getAssetUrl("/images/icons/arrow_white.svg")}
                      alt=""
                    />
                    <img
                      src={getAssetUrl("/images/icons/arrow_white.svg")}
                      alt=""
                    />
                  </i>
                </button>
                <button
                  type="button"
                  className="cs_btn cs_style_1 cs_btn_white_bg cs_footer_cta_btn"
                  onClick={() => openInquiry(INQUIRY_TYPES.PARTNERSHIP)}
                >
                  <span>Partner with us</span>
                  <i>
                    <img
                      src={getAssetUrl("/images/icons/arrow_white.svg")}
                      alt=""
                    />
                    <img
                      src={getAssetUrl("/images/icons/arrow_white.svg")}
                      alt=""
                    />
                  </i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="cs_footer_bottom cs_accent_bg">
        <div className="container">
          <div className="cs_footer_bottom_in">
            <SocialWidget />
            <div className="cs_copyright">{copyrightText}</div>
          </div>
        </div>
      </div>
      <InquiryModal
        isOpen={inquiryModal.open}
        onClose={closeInquiry}
        title={inquiryModal.title}
        type={inquiryModal.type}
      />
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        title="Book an appointment"
        description="Share your details and we'll get back to you to schedule your appointment."
      />
    </footer>
  );
}
