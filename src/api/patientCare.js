/**
 * Patient Care API – data for the Patient Care & Knowledge website section.
 * Reads from the same localStorage as Redux patientCare slice (published posts only).
 * For backend-only flow, use services/patientCareService.getPatientCarePosts() instead.
 */
import { getPatientCarePostsFromStorage } from '../store/slices/patientCareSlice';

/** Returns published posts with showInWebsite true. */
export function getPatientCare() {
  return getPatientCarePostsFromStorage();
}

export default getPatientCare;
