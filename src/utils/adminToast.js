/**
 * Admin panel toasts – use Ant Design message with admin styling (top-right, 3s, teal/red/amber).
 * Use this in all admin modules for consistent feedback.
 */
import { message } from 'antd';

export const toast = {
  success: (msg) => message.success(msg),
  error: (msg) => message.error(msg),
  warning: (msg) => message.warning(msg),
};

export default toast;
