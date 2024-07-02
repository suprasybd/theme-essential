/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';

const useTurnStileHook = (): [string, boolean] => {
  const intervalRef = useRef(null);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [siteKey, setSiteKey] = useState<string>('');

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const turnstileDiv = document.getElementById('cf-turnstile');
      const isLoaded =
        turnstileDiv?.innerHTML.includes('<input') &&
        turnstileDiv?.innerHTML.includes('value=');

      if (isLoaded) {
        setIsLoaded(true);
        clearInterval(intervalRef.current as any);
      }

      const lSKey = localStorage.getItem('turnstile-site-key');

      if (lSKey) {
        setSiteKey(lSKey);
      }
    }, 1000) as any;

    return () => {
      clearInterval(intervalRef.current as any);
    };
  }, []);

  return [siteKey, isLoaded];
};

export default useTurnStileHook;
