/**
 * Global access control for premium content (Blogs, ID Courses).
 * If user is logged in: run onSubscribe (e.g. open subscription/purchase modal).
 * If not: redirect to /login.
 */

/**
 * @param {boolean} isLoggedIn
 * @param {() => void} onSubscribe - Called when user is logged in (e.g. open modal)
 * @param {() => void} redirectToLogin - Called when user is not logged in (e.g. navigate to /login)
 */
export function checkAccessAndProceed(isLoggedIn, onSubscribe, redirectToLogin) {
  if (isLoggedIn) {
    onSubscribe?.();
  } else {
    redirectToLogin?.();
  }
}

/**
 * @param {{ role?: string } | null} user - Current user from AuthContext
 * @returns {boolean}
 */
export function isAdmin(user) {
  return user?.role === 'admin';
}

/**
 * @param {{ role?: string } | null} user - Current user from AuthContext
 * @returns {boolean}
 */
export function isLoggedIn(user) {
  return !!user;
}

/**
 * Check if user has purchased a specific blog (use with purchasedBlogIds from profile/state).
 * @param {string[]} purchasedBlogIds - Array of blog IDs the user has purchased
 * @param {string} blogId
 * @returns {boolean}
 */
export function hasPurchasedBlog(purchasedBlogIds, blogId) {
  return Array.isArray(purchasedBlogIds) && purchasedBlogIds.includes(blogId);
}

/**
 * Check if user is enrolled in a specific course (use with enrolledEducationIds from state).
 * @param {string[]} enrolledEducationIds - Array of education/course IDs the user is enrolled in
 * @param {string} educationId
 * @returns {boolean}
 */
export function isEnrolled(enrolledEducationIds, educationId) {
  return Array.isArray(enrolledEducationIds) && enrolledEducationIds.includes(educationId);
}
