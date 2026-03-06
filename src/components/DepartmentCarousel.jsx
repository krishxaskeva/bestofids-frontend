import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Slider from 'react-slick';
import { getAssetUrl } from '../config';

export default function DepartmentCarousel({ data, scrollToSection, activeDivisionId, onDivisionClick, compact }) {
  const sliderRef = useRef(null);
  const slideCount = data?.length || 0;
  const maxSlides = compact ? 1 : 4;
  const effectiveSlidesToShow = Math.min(maxSlides, slideCount || maxSlides);
  const useInfinite = slideCount > effectiveSlidesToShow;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (sliderRef.current && typeof sliderRef.current.slickPlay === 'function') {
        sliderRef.current.slickPlay();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [data]);

  /** Slider Settings **/
  const SlickArrowLeft = ({ currentSlide, slideCount: _total, ...props }) => (
    <div
      {...props}
      className={
        'cs_slider_prev cs_center' +
        (currentSlide === 0 ? ' slick-disabled' : '')
      }
      aria-hidden="true"
      aria-disabled={currentSlide === 0 ? true : false}
    >
      <img src={getAssetUrl('/images/icons/left_arrow_blue.svg')} alt="Icon" />
    </div>
  );
  const SlickArrowRight = ({ currentSlide, slideCount: total, ...props }) => (
    <div
      {...props}
      className={
        'cs_slider_next cs_center' +
        (currentSlide === total - 1 ? ' slick-disabled' : '')
      }
      aria-hidden="true"
      aria-disabled={currentSlide === total - 1 ? true : false}
    >
      <img src={getAssetUrl('/images/icons/right_arrow_blue.svg')} alt="Icon" />
    </div>
  );
  const responsiveBreakpoints = compact
    ? [
        { breakpoint: 420, settings: { slidesToShow: 1, slidesToScroll: 1, autoplay: useInfinite, autoplaySpeed: 3000, pauseOnHover: true, infinite: useInfinite } },
      ]
    : [
        { breakpoint: 1700, settings: { slidesToShow: Math.min(4, slideCount || 4), slidesToScroll: 1, autoplay: useInfinite, autoplaySpeed: 3000, pauseOnHover: true, infinite: useInfinite } },
        { breakpoint: 1200, settings: { slidesToShow: Math.min(4, slideCount || 4), slidesToScroll: 1, autoplay: useInfinite, autoplaySpeed: 3000, pauseOnHover: true, infinite: useInfinite } },
        { breakpoint: 992, settings: { slidesToShow: Math.min(3, slideCount || 3), slidesToScroll: 1, autoplay: useInfinite, autoplaySpeed: 3000, pauseOnHover: true, infinite: useInfinite } },
        { breakpoint: 768, settings: { slidesToShow: Math.min(2, slideCount || 2), slidesToScroll: 1, autoplay: useInfinite, autoplaySpeed: 3000, pauseOnHover: true, infinite: useInfinite } },
        { breakpoint: 420, settings: { slidesToShow: 1, slidesToScroll: 1, autoplay: useInfinite, autoplaySpeed: 3000, pauseOnHover: true, infinite: useInfinite } },
      ];

  const settings = {
    dots: false,
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
    infinite: useInfinite,
    autoplay: useInfinite,
    autoplaySpeed: 3000,
    speed: 550,
    slidesToShow: effectiveSlidesToShow,
    slidesToScroll: 1,
    swipeToSlide: true,
    pauseOnHover: true,
    centerMode: false,
    variableWidth: false,
    responsive: responsiveBreakpoints,
  };
  if (!data || data.length === 0) return null;

  return (
    <>
      <Slider
        ref={(slider) => (sliderRef.current = slider)}
        {...settings}
        className={`cs_gap_20 cs_cs_slider_navigation_1 cs_department_carousel ${compact ? 'cs_department_carousel_compact' : ''}`}
      >
        {data.map((item, index) => (
          <div key={item.id || index}>
            {scrollToSection && item.id ? (
              <button
                type="button"
                className={`cs_department cs_shadow_1 cs_radius_20 cs_white_bg cursor-pointer border-0 w-100 ${activeDivisionId === item.id ? 'cs_department_division_active' : ''}`}
                onClick={() => {
                  if (onDivisionClick) onDivisionClick(item.id);
                  else document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                {item.iconUrl ? (
                  <span className="cs_service_icon_img" style={{ maskImage: `url(${getAssetUrl(item.iconUrl)})`, WebkitMaskImage: `url(${getAssetUrl(item.iconUrl)})` }} aria-hidden />
                ) : (
                  <Icon icon={item.iconName} className="cs_service_icon" width={58} height={58} aria-label={`${item.title} icon`} />
                )}
                <p className="cs_department_title cs_medium cs_heading_color cs_fs_20 mb-0">
                  {item.title}
                </p>
                {item.description && (
                  <p className="cs_department_desc cs_heading_color mb-0">
                    {item.description}
                  </p>
                )}
              </button>
            ) : (
              <Link
                to={item.href}
                className="cs_department cs_shadow_1 cs_radius_20 cs_white_bg cursor-pointer"
              >
                {item.iconUrl ? (
                  <span className="cs_service_icon_img" style={{ maskImage: `url(${getAssetUrl(item.iconUrl)})`, WebkitMaskImage: `url(${getAssetUrl(item.iconUrl)})` }} aria-hidden />
                ) : (
                  <Icon icon={item.iconName} className="cs_service_icon" width={58} height={58} aria-label={`${item.title} icon`} />
                )}
                <p className="cs_department_title cs_medium cs_heading_color cs_fs_20 mb-0">
                  {item.title}
                </p>
                {item.description && (
                  <p className="cs_department_desc cs_heading_color mb-0">
                    {item.description}
                  </p>
                )}
              </Link>
            )}
          </div>
        ))}
      </Slider>
    </>
  );
}
