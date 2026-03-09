import React from 'react';
import { getAssetUrl } from '../config';

export default function Banner({ bgUrl, imgUrl, title, subTitle, className = '', ctaLabel, ctaHref, ctaOnClick }) {
  const hasCta = ctaLabel && (ctaHref || ctaOnClick);
  return (
    <div className="container">
      <div
        className={`cs_banner cs_style_1 cs_bg_filed ${className}`.trim()}
        style={{ backgroundImage: bgUrl ? `url(${getAssetUrl(bgUrl)})` : undefined }}
      >
        <div className="cs_banner_content">
          <h2 className="cs_banner_title cs_white_color cs_fs_72">{title}</h2>
          <p className="cs_banner_subtitle cs_heading_color cs_fs_20 cs_medium m-0">
            {subTitle}
          </p>
          {hasCta &&
            (ctaOnClick ? (
              <button
                type="button"
                onClick={ctaOnClick}
                className="cs_btn cs_style_1 cs_btn_white_bg cs_banner_btn"
              >
                <span>{ctaLabel}</span>
              </button>
            ) : (
              <a href={ctaHref} className="cs_btn cs_style_1 cs_btn_white_bg cs_banner_btn">
                <span>{ctaLabel}</span>
              </a>
            ))}
        </div>
        {imgUrl && (
          <div className="cs_banner_img_zone">
            <img src={getAssetUrl(imgUrl)} alt="Banner" className="cs_banner_img" />
          </div>
        )}
      </div>
    </div>
  );
}
