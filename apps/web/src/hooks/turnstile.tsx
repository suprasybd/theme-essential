/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, useCallback } from 'react';

const useTurnStileHook = (): [string, boolean, () => void] => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [siteKey, setSiteKey] = useState<string>('');

  const checkTurnstile = useCallback(() => {
    const turnstileDiv = document.getElementById('cf-turnstile');
    const isLoaded =
      turnstileDiv?.innerHTML.includes('<input') &&
      turnstileDiv?.innerHTML.includes('value=');

    if (isLoaded) {
      setIsLoaded(true);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    const lSKey = localStorage.getItem('turnstile-site-key');
    if (lSKey) {
      setSiteKey(lSKey);
    }
  }, []);

  const resetTurnstile = useCallback(() => {
    setIsLoaded(false);
    if (window.turnstile) {
      window.turnstile.reset();
    }
    if (!intervalRef.current) {
      intervalRef.current = setInterval(checkTurnstile, 1000);
    }
  }, [checkTurnstile]);

  useEffect(() => {
    intervalRef.current = setInterval(checkTurnstile, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [checkTurnstile]);

  return [siteKey, isLoaded, resetTurnstile] as const;
};

export default useTurnStileHook;
