/**
 * Patient Care API – data for the Patient Care & Knowledge website section.
 * In this app, data is read from PatientCareContext (and persisted in localStorage).
 * For a backend, replace this with a fetch to GET /api/patient-care.
 */
import { getPatientCarePosts } from '../contexts/PatientCareContext';

/** Returns published posts with showInWebsite true (same as GET /api/patient-care would return). */
export function getPatientCare() {
  return getPatientCarePosts();
}

export default getPatientCare;
