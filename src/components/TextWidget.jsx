import React from 'react';
import parse from 'html-react-parser';
import { getAssetUrl } from '../config';

export default function TextWidget({ logoUrl, text }) {
  return (
    <div className="cs_text_widget">
      {logoUrl && <img src={getAssetUrl(logoUrl)} alt="Logo" />}
      {text && <p className="cs_medium">{parse(text)}</p>}
    </div>
  );
}
