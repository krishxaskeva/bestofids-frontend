import React from 'react';
import Banner from './BannerSection';
import Section from './Section';
import GallerySection from './GallerySection';
import { pageTitle } from '../utils/PageTitle';
import { getAssetUrl } from '../config';

const DEFAULT_GALLERY = [
  { imgUrl: '/images/about/portfolio_4_lg.jpeg' },
  { imgUrl: '/images/about/portfolio_5_lg.jpeg' },
  { imgUrl: '/images/about/portfolio_2_lg.jpeg' },
  { imgUrl: '/images/about/portfolio_3_lg.jpeg' },
  { imgUrl: '/images/about/portfolio_5_lg.jpeg' },
  { imgUrl: '/images/about/portfolio_4_lg.jpeg' },
];

function parseGalleryContent(content) {
  if (!content || typeof content !== 'string') return null;
  try {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

export default function Gallery() {
  pageTitle('Gallery');
  const d = {};
  const bannerTitle = d.title || 'Welcome to Best of IDs Gallery';
  const bannerSubtitle = d.description || 'The special moment of our hospital';
  const bannerImg = d.banner || getAssetUrl('/images/about/banner_img.png');
  const galleryData = parseGalleryContent(d.content) || DEFAULT_GALLERY;

  return (
    <>
      <Section topMd={56} topLg={48} topXl={40}>
        <Banner
          bgUrl="/images/about/banner_bg.svg"
          imgUrl={bannerImg}
          title={bannerTitle}
          subTitle={bannerSubtitle}
        />
      </Section>
      <Section
        topMd={32}
        topLg={28}
        topXl={24}
        bottomMd={80}
        bottomLg={64}
        bottomXl={52}
      >
        <GallerySection data={galleryData} />
      </Section>
      <Section className="cs_footer_margin_0">
        <Banner
          bgUrl=""
          title="Don’t Let Your Health <br />Take a Backseat!"
          subTitle="Schedule an appointment with one of our experienced <br />medical professionals today!"
          imgUrl="/images/doctors/banner_img_3.png"
        />
      </Section>
    </>
  );
}
