import React from 'react';
import { Link } from 'react-router-dom';
import { getAssetUrl } from '../../config';

export default function Button({ btnUrl, btnText, variant }) {
  return (
    <Link to={btnUrl} className={`cs_btn cs_style_1 ${variant}`}>
      <span>{btnText}</span>
      <i>
        <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="Icon" />
        <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="Icon" />
      </i>
    </Link>
  );
}
