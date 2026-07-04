import { useState, useCallback } from 'react';

export const useAsync = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = useCallback(async (fn) => {
    setLoading(true);
    setError(null);
    try {
      return await fn();
    } catch (err) {
      setError(err.message || 'Request failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, setError, run };
};
