import React from 'react';
import DepartmentSection from './DepartmentSection';

/**
 * Shared Our Services card data used on the Home page and Our Services page.
 * Renders the same 4 cards: Patients, Doctors, Hospitals & Organization, ID knowledge and education.
 */
const ourServicesCardData = [
  {
    id: 'patients',
    title: 'Patients',
    description:
      'Evidence-based care and prevention for fever and infections, with in-person and virtual consultations and cost-conscious guidance.',
    iconName: 'mdi:account-group',
    href: '/patient-care-appointments',
  },
  {
    id: 'doctors',
    title: 'Doctors',
    description:
      'Specialist support for complex fever and infection cases through virtual and case-based consultations.',
    iconName: 'mdi:doctor',
    href: '/doctor-hospital-services',
  },
  {
    id: 'hospitals-organization',
    title: 'Hospitals & Organization',
    description:
      'Clinical ID support, infection prevention, adult vaccination, accreditation services & safer working environments.',
    iconName: 'mdi:hospital-building',
    href: '/our-services',
  },
  {
    id: 'id-knowledge-education',
    title: 'ID knowledge and education',
    description:
      'Training, courses, webinars, newsletters, CME credits, and certifications in infectious diseases.',
    iconName: 'mdi:school',
    href: '/id-education-knowledge-hub',
  },
];

const DEFAULT_SECTION_TITLE = 'Our Services';
const DEFAULT_BG_URL = '/images/home_1/our_service_bg.png';

export default function OurServicesCards({
  sectionTitle = DEFAULT_SECTION_TITLE,
  bgUrl = DEFAULT_BG_URL,
  data = ourServicesCardData,
}) {
  return (
    <DepartmentSection
      sectionTitle={sectionTitle}
      bgUrl={bgUrl}
      data={data}
    />
  );
}

export { ourServicesCardData };
