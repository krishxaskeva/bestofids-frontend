import React, { useState, useEffect } from 'react';
import parse from 'html-react-parser';
import { Link } from 'react-router-dom';
import { getAssetUrl } from '../config';

function assetUrl(url, cacheBust = false) {
  const base = getAssetUrl(url);
  if (cacheBust && import.meta.env.DEV && base) {
    return `${base}${base.includes('?') ? '&' : '?'}v=1`;
  }
  return base;
}

const ROTATION_INTERVAL_MS = 6000;
const FADE_DURATION_MS = 700;
const HERO_IMAGE_INTERVAL_MS = 6000;

export default function Hero({
  slides,
  title,
  subTitle,
  bgUrl,
  imgUrl,
  imgUrls,
  imgSlides,
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

  const legacyHeroImages = Array.isArray(imgUrls) && imgUrls.length > 0 ? imgUrls : (imgUrl ? [imgUrl] : []);
  const normalizedImgSlides = (Array.isArray(imgSlides) && imgSlides.length > 0)
    ? imgSlides
        .filter((s) => s && typeof s.url === 'string' && s.url.trim().length > 0)
        .map((s) => ({
          url: s.url,
          durationMs: Number.isFinite(s.durationMs) ? Math.max(0, s.durationMs) : HERO_IMAGE_INTERVAL_MS,
          effect: s.effect === 'slide' ? 'slide' : 'fade',
          variant: typeof s.variant === 'string' ? s.variant : '',
        }))
    : legacyHeroImages.map((url) => ({ url, durationMs: HERO_IMAGE_INTERVAL_MS, effect: 'fade', variant: '' }));

  const [heroImgIndex, setHeroImgIndex] = useState(0);
  const [heroImgVisible, setHeroImgVisible] = useState(true);
  const [heroImgNonce, setHeroImgNonce] = useState(0);
  const [incomingFadeIndex, setIncomingFadeIndex] = useState(null);
  const [incomingFadeNonce, setIncomingFadeNonce] = useState(0);
  const [failedUrls, setFailedUrls] = useState(() => new Set());
  const imgSlidesKey = normalizedImgSlides.map((s) => s.url).join('|');
  const displaySlides = normalizedImgSlides.filter((s) => !failedUrls.has(s.url));
  const safeIndex = displaySlides.length > 0 ? Math.min(heroImgIndex % displaySlides.length, displaySlides.length - 1) : 0;
  const canCycle = displaySlides.length > 1;
  const activeHeroSlide = displaySlides.length > 0 ? displaySlides[safeIndex] : null;
  const slideAnimDurationMs = activeHeroSlide?.effect === 'slide'
    ? Math.max(0, activeHeroSlide?.durationMs ?? 0)
    : undefined;
  const incomingSlide = (incomingFadeIndex != null && displaySlides[incomingFadeIndex])
    ? displaySlides[incomingFadeIndex]
    : null;

  useEffect(() => {
    // If images previously 404'd (e.g. when assets base pointed to CDN),
    // reset failures when the slide list changes so they can load again.
    setFailedUrls(new Set());
    setHeroImgIndex(0);
    setHeroImgVisible(true);
    setHeroImgNonce((n) => n + 1);
    setIncomingFadeIndex(null);
    setIncomingFadeNonce((n) => n + 1);
  }, [imgSlidesKey]);

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
    if (!canCycle || displaySlides.length <= 1) return;
    let hideTimer;
    let swapTimer;
    let nextTimer;
    let preSwapTimer;

    const schedule = () => {
      const current = displaySlides[Math.min(heroImgIndex % displaySlides.length, displaySlides.length - 1)];
      const durationMs = Math.max(0, current?.durationMs ?? HERO_IMAGE_INTERVAL_MS);
      const effect = current?.effect ?? 'fade';

      const startFadeIn = () => {
        // React/state updates can batch; use double rAF so the browser paints opacity:0 first,
        // then transitions to opacity:1 smoothly.
        requestAnimationFrame(() => requestAnimationFrame(() => setHeroImgVisible(true)));
      };

      if (effect === 'fade') {
        setIncomingFadeIndex(null);
        hideTimer = setTimeout(() => {
          setHeroImgVisible(false);
        }, Math.max(0, durationMs - FADE_DURATION_MS));

        swapTimer = setTimeout(() => {
          setHeroImgNonce((n) => n + 1);
          const nextIndex = (heroImgIndex + 1) % displaySlides.length;
          const nextSlide = displaySlides[nextIndex];
          setHeroImgIndex(nextIndex);

          if ((nextSlide?.effect ?? 'fade') === 'fade') {
            // Start next fade from 0 and immediately fade in (no gap).
            setHeroImgVisible(false);
            startFadeIn();
          } else {
            setHeroImgVisible(true);
          }
        }, durationMs);
      } else {
        const nextIndex = (heroImgIndex + 1) % displaySlides.length;
        const nextSlide = displaySlides[nextIndex];

        // If we're sliding out and next is a fade, start the fade-in during the slide-out
        // so there's no dead gap after the slide ends.
        if ((nextSlide?.effect ?? 'fade') === 'fade') {
          preSwapTimer = setTimeout(() => {
            setIncomingFadeIndex(nextIndex);
            setIncomingFadeNonce((n) => n + 1);
            setHeroImgVisible(false);
            startFadeIn();
          }, Math.max(0, durationMs - FADE_DURATION_MS));
        } else {
          setIncomingFadeIndex(null);
        }

        nextTimer = setTimeout(() => {
          setHeroImgNonce((n) => n + 1);
          setHeroImgIndex(nextIndex);
          setIncomingFadeIndex(null);
          setHeroImgVisible(true);
        }, durationMs);
      }
    };

    schedule();

    return () => {
      if (hideTimer) clearTimeout(hideTimer);
      if (swapTimer) clearTimeout(swapTimer);
      if (nextTimer) clearTimeout(nextTimer);
      if (preSwapTimer) clearTimeout(preSwapTimer);
    };
  }, [canCycle, displaySlides.length, heroImgIndex]);

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
          {activeHeroSlide && (
            <div className={`cs_hero_img_wrap ${activeHeroSlide.variant ? `cs_hero_img_wrap--${activeHeroSlide.variant}` : ''}`}>
              {activeHeroSlide.variant === 'surgery' ? (
                <div
                  className={`cs_hero_img_hemi ${activeHeroSlide.effect === 'slide' ? 'cs_hero_img--slide' : ''}`}
                  style={{
                    opacity: activeHeroSlide.effect === 'fade' ? (heroImgVisible ? 1 : 0) : 1,
                    transition: activeHeroSlide.effect === 'fade' ? `opacity ${FADE_DURATION_MS}ms ease-in-out` : 'none',
                    animationDuration: slideAnimDurationMs ? `${slideAnimDurationMs}ms` : undefined,
                  }}
                >
                  <img
                    key={`${activeHeroSlide.url}-${heroImgNonce}`}
                    src={assetUrl(activeHeroSlide.url, true)}
                    alt="Hero"
                    className="cs_hero_img_hemi_img"
                    onError={() => setFailedUrls((prev) => new Set(prev).add(activeHeroSlide.url))}
                    onLoad={() => setFailedUrls((prev) => (prev.has(activeHeroSlide.url) ? new Set([...prev].filter((u) => u !== activeHeroSlide.url)) : prev))}
                  />
                </div>
              ) : (
                <img
                  key={`${activeHeroSlide.url}-${heroImgNonce}`}
                  src={assetUrl(activeHeroSlide.url, true)}
                  alt="Hero"
                  className={`cs_hero_img ${activeHeroSlide.effect === 'slide' ? 'cs_hero_img--slide' : ''}`}
                  style={{
                    opacity: activeHeroSlide.effect === 'fade' ? (heroImgVisible ? 1 : 0) : 1,
                    transition: activeHeroSlide.effect === 'fade' ? `opacity ${FADE_DURATION_MS}ms ease-in-out` : 'none',
                    animationDuration: slideAnimDurationMs ? `${slideAnimDurationMs}ms` : undefined,
                  }}
                  onError={() => setFailedUrls((prev) => new Set(prev).add(activeHeroSlide.url))}
                  onLoad={() => setFailedUrls((prev) => (prev.has(activeHeroSlide.url) ? new Set([...prev].filter((u) => u !== activeHeroSlide.url)) : prev))}
                />
              )}

              {/* Incoming fade image (overlaps slide-out) */}
              {incomingSlide && (
                incomingSlide.variant === 'surgery' ? (
                  <div
                    className="cs_hero_img_hemi"
                    style={{
                      opacity: heroImgVisible ? 1 : 0,
                      transition: `opacity ${FADE_DURATION_MS}ms ease-in-out`,
                    }}
                  >
                    <img
                      key={`${incomingSlide.url}-${incomingFadeNonce}`}
                      src={assetUrl(incomingSlide.url, true)}
                      alt="Hero"
                      className="cs_hero_img_hemi_img"
                      onError={() => setFailedUrls((prev) => new Set(prev).add(incomingSlide.url))}
                      onLoad={() => setFailedUrls((prev) => (prev.has(incomingSlide.url) ? new Set([...prev].filter((u) => u !== incomingSlide.url)) : prev))}
                    />
                  </div>
                ) : (
                  <img
                    key={`${incomingSlide.url}-${incomingFadeNonce}`}
                    src={assetUrl(incomingSlide.url, true)}
                    alt="Hero"
                    className="cs_hero_img"
                    style={{
                      opacity: heroImgVisible ? 1 : 0,
                      transition: `opacity ${FADE_DURATION_MS}ms ease-in-out`,
                    }}
                    onError={() => setFailedUrls((prev) => new Set(prev).add(incomingSlide.url))}
                    onLoad={() => setFailedUrls((prev) => (prev.has(incomingSlide.url) ? new Set([...prev].filter((u) => u !== incomingSlide.url)) : prev))}
                  />
                )
              )}
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
