/**
 * Shared Razorpay checkout for blog purchases.
 * Loads script once and opens checkout with consistent error handling.
 */

const SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

/**
 * Load Razorpay script. Rejects on load failure (so callers can show an error).
 * @returns {Promise<void>}
 */
export function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Could not load payment script. Check your connection or try again.'));
    document.body.appendChild(script);
  });
}

/**
 * Open Razorpay checkout for a blog purchase.
 * @param {Object} params
 * @param {string} params.key - Razorpay key ID
 * @param {number} params.amount - Amount in paise
 * @param {string} params.currency - e.g. 'INR'
 * @param {string} params.orderId - Razorpay order_id
 * @param {string} params.description - Blog title or description
 * @param {(response: { razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string }) => void} params.onSuccess
 * @param {() => void} params.onFailure
 */
export function openRazorpayCheckout({ key, amount, currency, orderId, description, onSuccess, onFailure }) {
  if (!key) {
    onFailure?.();
    return;
  }
  if (typeof window === 'undefined' || typeof window.Razorpay !== 'function') {
    onFailure?.();
    return;
  }
  const rzp = new window.Razorpay({
    key,
    amount,
    currency,
    order_id: orderId,
    name: 'Best of IDs',
    description: description || 'Blog',
    handler(response) {
      onSuccess?.(response);
    },
  });
  rzp.on('payment.failed', () => {
    onFailure?.();
  });
  rzp.open();
}
