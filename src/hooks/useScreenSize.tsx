import { useState, useEffect, useCallback } from 'react';

const useScreenSize = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 650);

  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth <= 650);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return isMobile;
};

export default useScreenSize;
