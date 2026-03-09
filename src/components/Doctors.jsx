import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "antd";
import Section from "./Section";
import Breadcrumb from "./Breadcrumb";
import SectionHeading from "./SectionHeading";
import Spacing from "./Spacing";
import WhyDoctorsChoose from "./WhyDoctorsChoose";
import { pageTitle } from "../utils/PageTitle";
import { getAssetUrl } from "../config";
import { getBlogs } from "../services/blogService";
import dayjs from "dayjs";

const CONTACT_URL = "/contact-testimonials";

const howThisHelpsData = [
  {
    iconSrc: "/images/icons/professional.svg",
    title: "Clearer clinical direction",
    subTitle: "Clearer clinical direction in complex cases",
  },
  {
    iconSrc: "/images/icons/injection.svg",
    title: "Responsible antibiotic use",
    subTitle: "Support for responsible antibiotic use",
  },
  {
    iconSrc: "/images/icons/immunizations.svg",
    title: "Reduced treatment risks",
    subTitle: "Reduced risk from inappropriate or excessive treatment",
  },
];

const processSteps = [
  "Share the clinical details via our secure contact channels",
  "Case review by an infectious disease specialist",
  "Clear, structured guidance tailored to the patient's context",
  "Ongoing support, if required",
];

const whoWeWorkWithData = [
  { title: "Primary care physicians", subTitle: "" },
  { title: "Emergency medicine doctors", subTitle: "" },
  { title: "Internal medicine and intensive care specialists", subTitle: "" },
  { title: "Surgeons and other sub/super-specialty clinicians", subTitle: "" },
  { title: "Hospital-based teams", subTitle: "" },
];

export default function Doctors() {
  pageTitle("Doctor & Hospital Services");
  const [doctorsQaActiveIndex, setDoctorsQaActiveIndex] = useState(0);
  const [latestBlogs, setLatestBlogs] = useState([]);

  useEffect(() => {
    const BLOG_SLOTS = 3;
    getBlogs()
      .then((data) => {
        const sorted = Array.isArray(data)
          ? [...data].sort((a, b) => {
              const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
              const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
              return db - da;
            })
          : [];
        // Show 3 slots: repeat the same blog(s) if we have fewer than 3
        const source = sorted.slice(0, BLOG_SLOTS);
        const filled =
          source.length > 0
            ? Array.from({ length: BLOG_SLOTS }, (_, i) => source[i % source.length])
            : [];
        setLatestBlogs(filled);
      })
      .catch(() => setLatestBlogs([]));
  }, []);
  const heroTitle =
    "Infectious Disease Expertise to Support Safe, Confident Clinical Decisions";
  const heroPara1 =
    "At Best of IDs, we work alongside doctors when infectious disease decisions are complex, time-sensitive, and carry significant responsibility. Our role is not to replace clinical judgment—but to strengthen it with specialist insight, experience, and balance.";
  const heroPara2 =
    "We support doctors across outpatient clinics, emergency settings, and hospitals with practical infectious disease opinions that are evidence-based, context-appropriate, and defensible.";
  const ctaTitle = "Get Clinical Support When You Need It";
  const ctaSubtitle =
    "If you are managing a challenging infection or need specialist input to support your clinical decision-making, Best of IDs is here to help.";

  return (
    <div className="cs_doctors_page_wrap">
      <Section>
        <Breadcrumb title="Doctor & Hospital Services" />
      </Section>

      {/* Hero / Services for Doctors */}
      <Section
        topMd={0}
        topLg={0}
        topXl={0}
        bottomMd={48}
        bottomLg={40}
        bottomXl={32}
      >
        <div className="container">
          <div className="cs_doctors_hero_section">
            <SectionHeading title={heroTitle} />
            <Spacing md="25" lg="20" />
            <p className="cs_heading_color m-0">{heroPara1}</p>
            <Spacing md="20" lg="16" />
            <p className="cs_heading_color m-0">{heroPara2}</p>
            <Spacing md="40" lg="32" />
            <div className="d-flex flex-wrap gap-3">
              <Link to={CONTACT_URL} className="cs_btn cs_style_1">
                <span>Request an ID Opinion</span>
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
              </Link>
              <Link
                to={CONTACT_URL}
                className="cs_btn cs_style_1 cs_btn_white_bg"
              >
                <span>Contact Us</span>
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
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* Blog – same layout as before, real blogs from API */}
      <Section
        topMd={0}
        topLg={0}
        topXl={0}
        bottomMd={48}
        bottomLg={40}
        bottomXl={32}
      >
        <div className="container">
          <div className="cs_edu_hub_blog_section cs_edu_hub_card cs_shadow_1 cs_radius_25 cs_white_bg cs_doctors_blog_section_wrap">
            <div className="cs_doctors_blog_row">
              <div className="cs_edu_hub_blog_content">
                <h2 className="cs_edu_hub_blog_title cs_heading_color m-0">
                  Blog
                </h2>
                <Spacing md="16" lg="14" />
                <p className="cs_heading_color m-0">
                  Our blog offers articles, clinical pearls, and updates on
                  infectious disease practice, antimicrobial stewardship, and
                  evidence-based care. Stay informed with short reads written by
                  our ID specialists and guest contributors, covering topics
                  from common infections to emerging pathogens and guideline
                  changes.
                </p>
                <Spacing md="20" lg="18" />
                <p className="cs_heading_color m-0">
                  Access full articles, case discussions, and downloadable
                  resources with a subscription. New content is added regularly
                  to support your continuous learning and day-to-day clinical
                  decisions.
                </p>
                <Spacing md="28" lg="24" />
                <Link to="/blog" className="cs_btn cs_style_1">
                  <span>Explore our Blogs</span>
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
                </Link>
              </div>
              <div className="cs_doctors_blog_latest_wrap">
                {latestBlogs.length > 0 ? (
                  <div className="cs_doctors_blog_latest_list">
                    {latestBlogs.map((blog, index) => {
                      const coverUrl =
                        blog.coverImage ||
                        getAssetUrl("/images/blog/post_2.jpeg");
                      const dateStr = blog.createdAt
                        ? dayjs(blog.createdAt).format("MMM D, YYYY")
                        : "";
                      const href = `/blog/${blog.id}`;
                      return (
                        <Card
                          key={`${blog.id}-${index}`}
                          className="cs_blog_card cs_doctors_blog_preview_card"
                          hoverable
                          cover={
                            <Link to={href} className="cs_blog_card_cover">
                              <img
                                alt={blog.title}
                                src={
                                  coverUrl.startsWith("http")
                                    ? coverUrl
                                    : getAssetUrl(coverUrl)
                                }
                                className="cs_doctors_blog_preview_cover"
                              />
                            </Link>
                          }
                          bodyStyle={{ padding: "12px 16px" }}
                        >
                          <div className="cs_post_meta cs_heading_color cs_doctors_blog_preview_meta">
                            {blog.author || "Author"} · {dateStr || "—"}
                          </div>
                          <h3 className="cs_post_title cs_semibold m-0 cs_doctors_blog_preview_title">
                            <Link to={href}>{blog.title}</Link>
                          </h3>
                          <Link
                            to="/blog"
                            className="cs_doctors_blog_preview_read_more"
                          >
                            Read More
                          </Link>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="cs_doctors_blog_placeholder_img_wrap">
                    <div className="cs_doctors_blog_no_posts_placeholder">
                      <span className="cs_doctors_blog_no_posts_icon" aria-hidden>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14 2v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      <span className="cs_doctors_blog_no_posts_text">No blog added yet</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Unified Q&A */}
      <Section
        topMd={48}
        topLg={40}
        topXl={32}
        bottomMd={36}
        bottomLg={30}
        bottomXl={26}
      >
        <div className="cs_doctors_qa_wrap">
          <div className="container">
            <div className="cs_doctors_qa_layout">
              <nav
                className="cs_doctors_qa_nav"
                aria-label="Doctor services questions"
              >
                {[
                  "When Doctors Reach Out to Us?",
                  "How This Helps You as a Doctor?",
                  "How the Process Works?",
                  "Who We Work With?",
                  "Why Doctors Choose Best of IDs?",
                ].map((label, index) => (
                  <button
                    type="button"
                    key={label}
                    className={`cs_doctors_qa_nav_item ${doctorsQaActiveIndex === index ? "cs_doctors_qa_nav_item_active" : ""}`}
                    onClick={() => setDoctorsQaActiveIndex(index)}
                  >
                    {label}
                  </button>
                ))}
              </nav>
              <div className="cs_doctors_qa_content">
                <div className="cs_doctors_qa_panels_wrap">
                  {/* Panel 1: When Doctors Reach Out to Us */}
                  <div
                    className={`cs_doctors_qa_panel ${doctorsQaActiveIndex === 0 ? "cs_doctors_qa_panel_active" : ""}`}
                    role="region"
                    aria-labelledby="doctors-qa-panel-title-0"
                  >
                    <h2
                      id="doctors-qa-panel-title-0"
                      className="cs_doctors_qa_panel_title"
                    >
                      When Doctors Reach Out to Us?
                    </h2>
                    <p className="cs_doctors_qa_panel_subtitle">
                      Our guidance is designed to reduce uncertainty while
                      keeping patient safety central.
                    </p>
                    <div className="cs_doctors_qa_panel_body">
                      <div className="cs_doctors_reach_card">
                        <div className="cs_doctors_reach_card_col cs_doctors_reach_card_left">
                          <div className="cs_doctors_reach_point_card">
                            <span
                              className="cs_doctors_reach_point_icon"
                              aria-hidden
                            >
                              ✓
                            </span>
                            <span className="cs_doctors_reach_point_text">
                              Persistent or unexplained fever
                            </span>
                          </div>
                          <div className="cs_doctors_reach_point_card">
                            <span
                              className="cs_doctors_reach_point_icon"
                              aria-hidden
                            >
                              ✓
                            </span>
                            <span className="cs_doctors_reach_point_text">
                              Recurrent or treatment-resistant infections
                            </span>
                          </div>
                          <div className="cs_doctors_reach_point_card">
                            <span
                              className="cs_doctors_reach_point_icon"
                              aria-hidden
                            >
                              ✓
                            </span>
                            <span className="cs_doctors_reach_point_text">
                              Uncertainty around investigations or antibiotic
                              choice
                            </span>
                          </div>
                        </div>
                        <div
                          className="cs_doctors_reach_card_divider"
                          aria-hidden
                        />
                        <div className="cs_doctors_reach_card_col cs_doctors_reach_card_right">
                          <div className="cs_doctors_reach_point_card">
                            <span
                              className="cs_doctors_reach_point_icon"
                              aria-hidden
                            >
                              ✓
                            </span>
                            <span className="cs_doctors_reach_point_text">
                              Concerns about overuse or prolonged antimicrobial
                              therapy
                            </span>
                          </div>
                          <div className="cs_doctors_reach_point_card">
                            <span
                              className="cs_doctors_reach_point_icon"
                              aria-hidden
                            >
                              ✓
                            </span>
                            <span className="cs_doctors_reach_point_text">
                              Infections in high-risk patients
                            </span>
                          </div>
                          <div className="cs_doctors_reach_point_card">
                            <span
                              className="cs_doctors_reach_point_icon"
                              aria-hidden
                            >
                              ✓
                            </span>
                            <span className="cs_doctors_reach_point_text">
                              Need for specialist input to support clinical
                              decisions
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Panel 2: How This Helps You as a Doctor */}
                  <div
                    className={`cs_doctors_qa_panel ${doctorsQaActiveIndex === 1 ? "cs_doctors_qa_panel_active" : ""}`}
                    role="region"
                    aria-labelledby="doctors-qa-panel-title-1"
                  >
                    <h2
                      id="doctors-qa-panel-title-1"
                      className="cs_doctors_qa_panel_title"
                    >
                      How This Helps You as a Doctor?
                    </h2>
                    <p className="cs_doctors_qa_panel_subtitle">
                      We understand the clinical and professional responsibility
                      involved in infectious disease decisions and aim to
                      support you thoughtfully and reliably.
                    </p>
                    <div className="cs_doctors_qa_panel_body">
                      <div className="cs_how_this_helps_row">
                        <div className="cs_random_features">
                          {howThisHelpsData.map((item, index) => (
                            <div className="cs_random_features_col" key={index}>
                              <div className="cs_feature cs_style_1 cs_how_helps_card cs_shadow_1 cs_radius_25 cs_white_bg">
                                <span className="cs_how_helps_icon cs_accent_bg cs_center rounded-circle">
                                  <img src={getAssetUrl(item.iconSrc)} alt="" />
                                </span>
                                <div className="cs_how_helps_content">
                                  <h3 className="cs_how_helps_title cs_semibold m-0">
                                    {item.title}
                                  </h3>
                                  <p className="cs_how_helps_desc m-0">
                                    {item.subTitle}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Panel 3: How the Process Works */}
                  <div
                    className={`cs_doctors_qa_panel ${doctorsQaActiveIndex === 2 ? "cs_doctors_qa_panel_active" : ""}`}
                    role="region"
                    aria-labelledby="doctors-qa-panel-title-2"
                  >
                    <h2
                      id="doctors-qa-panel-title-2"
                      className="cs_doctors_qa_panel_title"
                    >
                      How the Process Works?
                    </h2>
                    <p className="cs_doctors_qa_panel_subtitle cs_heading_color m-0">
                      Both virtual and in-person support may be available
                      depending on the situation.
                    </p>
                    <div className="cs_doctors_qa_panel_body">
                      <Spacing md="20" lg="16" />
                      <div className="cs_process_works_row">
                        <div className="cs_random_features">
                          {processSteps.map((text, index) => (
                            <div className="cs_random_features_col" key={index}>
                              <div className="cs_feature cs_style_1 cs_how_helps_card cs_shadow_1 cs_radius_25 cs_white_bg">
                                <span className="cs_how_helps_icon cs_accent_bg cs_center rounded-circle">
                                  <span className="cs_fs_24 cs_semibold cs_white_color">
                                    {index + 1}
                                  </span>
                                </span>
                                <div className="cs_how_helps_content">
                                  <h3 className="cs_how_helps_title cs_semibold m-0">
                                    Step {index + 1}
                                  </h3>
                                  <p className="cs_how_helps_desc m-0">
                                    {text}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Panel 4: Who We Work With */}
                  <div
                    className={`cs_doctors_qa_panel ${doctorsQaActiveIndex === 3 ? "cs_doctors_qa_panel_active" : ""}`}
                    role="region"
                    aria-labelledby="doctors-qa-panel-title-3"
                  >
                    <h2
                      id="doctors-qa-panel-title-3"
                      className="cs_doctors_qa_panel_title"
                    >
                      Who We Work With?
                    </h2>
                    <p className="cs_doctors_qa_panel_subtitle">We support:</p>
                    <div className="cs_doctors_qa_panel_body">
                      <div className="cs_who_we_work_with_row">
                        <div className="cs_random_features">
                          {whoWeWorkWithData.map((item, index) => (
                            <div className="cs_random_features_col" key={index}>
                              <div className="cs_feature cs_style_1 cs_how_helps_card cs_shadow_1 cs_radius_25 cs_white_bg">
                                <span className="cs_how_helps_icon cs_accent_bg cs_center rounded-circle">
                                  <img
                                    src={getAssetUrl("/images/icons/tick.svg")}
                                    alt=""
                                  />
                                </span>
                                <div className="cs_how_helps_content">
                                  <h3 className="cs_how_helps_title cs_semibold m-0">
                                    {item.title}
                                  </h3>
                                  {item.subTitle ? (
                                    <p className="cs_how_helps_desc m-0">
                                      {item.subTitle}
                                    </p>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <p className="cs_heading_color text-center mt-4 m-0">
                        Across settings—from clinics to tertiary hospitals.
                      </p>
                    </div>
                  </div>
                  {/* Panel 5: Why Doctors Choose Best of IDs */}
                  <div
                    className={`cs_doctors_qa_panel ${doctorsQaActiveIndex === 4 ? "cs_doctors_qa_panel_active" : ""}`}
                    role="region"
                    aria-labelledby="doctors-qa-panel-title-4"
                  >
                    <h2
                      id="doctors-qa-panel-title-4"
                      className="cs_doctors_qa_panel_title"
                    >
                      Why Doctors Choose Best of IDs?
                    </h2>
                    <div className="cs_doctors_qa_panel_body">
                      <WhyDoctorsChoose hideHeading />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Get Clinical Support - CTA */}
      <Section
        topMd={16}
        topLg={14}
        topXl={12}
        bottomMd={0}
        bottomLg={0}
        bottomXl={0}
      >
        <div className="container">
          <div className="cs_banner cs_style_1 cs_banner_cta">
            <div className="cs_banner_content cs_banner_cta_inner">
              <div className="cs_banner_cta_text">
                <h2 className="cs_banner_title cs_heading_color cs_fs_72">
                  {ctaTitle}
                </h2>
                <p className="cs_banner_subtitle cs_heading_color cs_fs_20 cs_medium m-0">
                  {ctaSubtitle}
                </p>
              </div>
              <div className="cs_banner_cta_buttons d-flex flex-wrap gap-3">
                <Link to={CONTACT_URL} className="cs_btn cs_style_1">
                  <span>Request an ID Opinion</span>
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
                </Link>
                <Link
                  to={CONTACT_URL}
                  className="cs_btn cs_style_1 cs_btn_white_bg"
                >
                  <span>Contact Us</span>
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
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
