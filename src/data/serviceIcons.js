/**
 * Centralized Iconify icon mapping for services.
 * Each service has a unique, semantically appropriate icon (mdi = Material Design Icons).
 * Used by DepartmentCarousel, Home, and Our Services page.
 */
export const serviceIcons = {
  'infectious-disease-clinical-care': 'mdi:stethoscope',
  'critical-complex-infections': 'mdi:virus',
  'post-exposure-preventive': 'mdi:shield-check',
  'consultation-models': 'mdi:clipboard-text-clock',
  'ipc-services': 'mdi:hand-wash',
  'hospital-accreditation': 'mdi:medal',
  'adult-immunization-setup': 'mdi:needle',
  'travel-clinic-advisory': 'mdi:airplane',
  'clinical-advisory': 'mdi:comment-text-multiple',
  'infectious-disease-education': 'mdi:school',
  'certification-continuing-education': 'mdi:certificate',
  'infectious-disease-diagnostics': 'mdi:microscope',
  'our-programs-serve': 'mdi:account-group',
};

/**
 * Custom SVG icon URL for Travel Clinic (car + plus style).
 */
export const serviceCustomIconUrls = {
  'travel-clinic-advisory': '/images/icons/travel-clinic.svg',
};

/**
 * Get Iconify icon name for a service id. Falls back to stethoscope if unknown.
 */
export function getServiceIcon(serviceId) {
  return serviceIcons[serviceId] ?? 'mdi:stethoscope';
}

/**
 * Returns { iconName } or { iconUrl } for carousel data. Use for departmentData.
 */
export function getServiceIconProps(serviceId) {
  const customUrl = serviceCustomIconUrls[serviceId];
  if (customUrl) return { iconUrl: customUrl };
  return { iconName: getServiceIcon(serviceId) };
}
