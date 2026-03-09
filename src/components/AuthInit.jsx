import { useEffect } from 'react';
import { useAuthInit } from '../store/hooks';

/**
 * Runs once on mount: if a token exists, fetches current user (getMe);
 * otherwise sets auth loading to false. Must be rendered inside Redux Provider.
 */
export default function AuthInit({ children }) {
  const init = useAuthInit();
  useEffect(() => {
    init();
  }, [init]);
  return children;
}
