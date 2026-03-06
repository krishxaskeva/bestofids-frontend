import React, { useState, useEffect } from 'react';
import parse from 'html-react-parser';
import { Link } from 'react-router-dom';
import { getAssetUrl } from '../config';

function assetUrl(url, cacheBust = false) {
  const base = getAssetUrl(url);
  if (cacheBust && process.env.NODE_ENV === 'development' && base) {
    return `${base}${base.includes('?') ? '&' : '?'}v=1`;
  }
  return base;
}

const ROTATION_INTERVAL_MS = 6000;
const FADE_DURATION_MS = 350;
const HERO_IMAGE_INTERVAL_MS = 3000;

export default function Hero({
  slides,
  title,
  subTitle,
  bgUrl,
  imgUrl,
  imgUrls,
  videoBtnText: _videoBtnText,
  videoUrl: _videoUrl,
  infoList,
  infoCardTagline,
  btnText,
  btnUrl,
  quickLinks = [],
}) {
  const hasSlides = Array.isArray(slides) && slides.length > 0;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const heroImages = Array.isArray(imgUrls) && imgUrls.length > 0 ? imgUrls : (imgUrl ? [imgUrl] : []);
  const [heroImgIndex, setHeroImgIndex] = useState(0);
  const [heroImgVisible, setHeroImgVisible] = useState(true);
  const [failedUrls, setFailedUrls] = useState(() => new Set());
  const displayImages = heroImages.filter((url) => !failedUrls.has(url));
  const safeIndex = displayImages.length > 0 ? Math.min(heroImgIndex % displayImages.length, displayImages.length - 1) : 0;
  const canCycle = displayImages.length > 1;

  useEffect(() => {
    if (!hasSlides) return;
    let swapTimer;
    const interval = setInterval(() => {
      setIsVisible(false);
      swapTimer = setTimeout(() => {
        setCurrentIndex((i) => (i + 1) % slides.length);
        setIsVisible(true);
      }, FADE_DURATION_MS);
    }, ROTATION_INTERVAL_MS);
    return () => {
      clearInterval(interval);
      if (swapTimer) clearTimeout(swapTimer);
    };
  }, [hasSlides, slides?.length]);

  useEffect(() => {
    if (!canCycle || displayImages.length <= 1) return;
    const interval = setInterval(() => {
      setHeroImgVisible(false);
      setTimeout(() => {
        setHeroImgIndex((i) => (i + 1) % displayImages.length);
        setHeroImgVisible(true);
      }, 400);
    }, HERO_IMAGE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [canCycle, displayImages.length]);

  const activeSlide = hasSlides ? slides[currentIndex] : null;

  return (
    <section className="cs_hero cs_style_1">
      <div
        className="cs_hero_wrap cs_bg_filed"
        style={{ backgroundImage: `url(${assetUrl(bgUrl, true)})` }}
      >
        <div className="container">
          <div className="cs_hero_text">
            {hasSlides && activeSlide ? (
              <div className={`cs_hero_slide ${isVisible ? 'cs_hero_slide_visible' : ''}`}>
                <div className="cs_hero_badge">
                  <img src={assetUrl('/images/home_1/heartbeat_icon.png')} alt="" className="cs_hero_badge_icon" aria-hidden />
                  <span className="cs_hero_badge_text cs_white_color">{activeSlide.label}</span>
                </div>
                <h1 className="cs_hero_title cs_fs_94 cs_white_color">{parse(activeSlide.title)}</h1>
                <p className="cs_hero_subtitle cs_fs_20 cs_white_color">
                  {parse(activeSlide.subtitle)}
                </p>
              </div>
            ) : (
              <>
                <h1 className="cs_hero_title cs_fs_94 cs_white_color">{parse(title)}</h1>
                <p className="cs_hero_subtitle cs_fs_20 cs_white_color">
                  {parse(subTitle)}
                </p>
              </>
            )}
          </div>
          {displayImages.length > 0 && (
            <div className="cs_hero_img_wrap">
              {displayImages.map((url, index) => (
                <img
                  key={url}
                  src={assetUrl(url, true)}
                  alt="Hero"
                  className="cs_hero_img"
                  style={{
                    opacity: index === safeIndex ? (heroImgVisible ? 1 : 0) : 0,
                    transition: 'opacity 0.4s ease',
                  }}
                  aria-hidden={index !== safeIndex}
                  onError={() => setFailedUrls((prev) => new Set(prev).add(url))}
                  onLoad={() => setFailedUrls((prev) => (prev.has(url) ? new Set([...prev].filter((u) => u !== url)) : prev))}
                />
              ))}
            </div>
          )}
          {(infoCardTagline || (infoList && infoList.length > 0) || (quickLinks && quickLinks.length > 0) || btnText) && (
          <div
            className={`cs_hero_info_wrap cs_shadow_1 cs_white_bg cs_radius_15 ${(quickLinks && quickLinks.length > 0) && !(infoList && infoList.length > 0) ? 'cs_hero_info_wrap_quick_links' : ''} ${!(infoCardTagline || (infoList && infoList.length > 0) || (quickLinks && quickLinks.length > 0)) && btnText ? 'cs_hero_info_wrap_btn_right' : ''}`}
          >
            {infoCardTagline ? (
              <>
                <div className="cs_hero_info_col cs_hero_info_tagline">
                  <p className="cs_hero_info_tagline_text m-0 cs_heading_color cs_fs_20 cs_semibold">
                    {infoCardTagline}
                  </p>
                </div>
                {btnText && (
                  <div className="cs_hero_info_col">
                    <Link to={btnUrl || '#'} className="cs_btn cs_style_1">
                      <span>{btnText}</span>
                      <i>
                        <img src={assetUrl('/images/icons/arrow_white.svg')} alt="" aria-hidden />
                        <img src={assetUrl('/images/icons/arrow_white.svg')} alt="" aria-hidden />
                      </i>
                    </Link>
                  </div>
                )}
              </>
            ) : (quickLinks && quickLinks.length > 0) && !(infoList && infoList.length > 0) ? (
              quickLinks.map((link) => (
                <div className="cs_hero_info_col" key={link.href}>
                  <Link to={link.href} className="cs_btn cs_style_1">
                    <span>{link.label}</span>
                    <i>
                      <img src={assetUrl('/images/icons/arrow_white.svg')} alt="" aria-hidden />
                      <img src={assetUrl('/images/icons/arrow_white.svg')} alt="" aria-hidden />
                    </i>
                  </Link>
                </div>
              ))
            ) : (
              <>
                {(infoList || []).map((item, index) => (
                  <div className="cs_hero_info_col" key={index}>
                    <div className="cs_hero_info d-flex align-items-center">
                      <div className="cs_hero_info_icon cs_center rounded-circle cs_accent_bg">
                        <img src={assetUrl(item.iconUrl)} alt="Icon" />
                      </div>
                      <div className="cs_hero_info_right">
                        <h3 className="cs_hero_info_title cs_semibold">
                          {item.title}
                        </h3>
                        <p className="cs_hero_info_subtitle cs_fs_20">
                          {item.subTitle}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {btnText && (
                  <div className={`cs_hero_info_col ${!(infoCardTagline || (infoList && infoList.length > 0)) ? 'cs_hero_info_col_btn_right' : ''}`}>
                    <Link to={btnUrl || '#'} className="cs_btn cs_style_1">
                      <span>{btnText}</span>
                      <i>
                        <img src={assetUrl('/images/icons/arrow_white.svg')} alt="" aria-hidden />
                        <img src={assetUrl('/images/icons/arrow_white.svg')} alt="" aria-hidden />
                      </i>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
          )}
        </div>
      </div>
    </section>
  );
}
