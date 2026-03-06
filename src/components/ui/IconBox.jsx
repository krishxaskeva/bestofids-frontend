import React from 'react';
import { getAssetUrl } from '../../config';

export default function IconBox({ title, subTitle, iconUrl, iconSrc }) {
  const src = getAssetUrl(iconUrl || iconSrc);
  return (
    <div className="cs_iconbox cs_style_1 cs_shadow_1 cs_radius_15">
      <div className="cs_iconbox_top">
        <div className="cs_iconbox_icon cs_radius_15 cs_accent_bg cs_center">
          <img src={src} alt="Icon" />
        </div>
        <h2 className="cs_iconbox_title cs_medium cs_fs_20 m-0">{title}</h2>
      </div>
      <p className="cs_iconbox_text">{subTitle}</p>
    </div>
  );
}
