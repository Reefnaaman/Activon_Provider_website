'use client';

import { useState, useEffect } from 'react';

interface MobileDetection {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  isLandscape: boolean;
  viewport: {
    width: number;
    height: number;
  };
  device: 'mobile' | 'tablet' | 'desktop';
}

// Define breakpoints consistent with Tailwind CSS
const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
} as const;

export function useMobileDetection(): MobileDetection {
  const [detection, setDetection] = useState<MobileDetection>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouchDevice: false,
    isLandscape: false,
    viewport: { width: 1024, height: 768 },
    device: 'desktop',
  });

  useEffect(() => {
    const updateDetection = () => {
      if (typeof window === 'undefined') return;

      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Check for touch support
      const isTouchDevice = 
        'ontouchstart' in window || 
        navigator.maxTouchPoints > 0 || 
        // @ts-ignore
        navigator.msMaxTouchPoints > 0;

      // Determine device type based on viewport width
      const isMobile = width < BREAKPOINTS.mobile;
      const isTablet = width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet;
      const isDesktop = width >= BREAKPOINTS.tablet;
      
      // Check orientation
      const isLandscape = width > height;
      
      // Determine device category
      let device: 'mobile' | 'tablet' | 'desktop' = 'desktop';
      if (isMobile) device = 'mobile';
      else if (isTablet) device = 'tablet';

      setDetection({
        isMobile,
        isTablet,
        isDesktop,
        isTouchDevice,
        isLandscape,
        viewport: { width, height },
        device,
      });
    };

    // Initial detection
    updateDetection();

    // Listen for resize events
    const handleResize = () => {
      updateDetection();
    };

    // Listen for orientation changes
    const handleOrientationChange = () => {
      // Small delay to ensure viewport dimensions are updated
      setTimeout(updateDetection, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return detection;
}

// Hook for checking if viewport is at specific breakpoint
export function useBreakpoint(breakpoint: 'mobile' | 'tablet' | 'desktop' = 'mobile'): boolean {
  const { isMobile, isTablet, isDesktop } = useMobileDetection();

  switch (breakpoint) {
    case 'mobile':
      return isMobile;
    case 'tablet':
      return isTablet;
    case 'desktop':
      return isDesktop;
    default:
      return false;
  }
}

// Hook for touch gestures
export function useTouchGestures() {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return null;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    
    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;
    const isUpSwipe = distanceY > minSwipeDistance;
    const isDownSwipe = distanceY < -minSwipeDistance;

    return {
      isLeftSwipe,
      isRightSwipe,
      isUpSwipe,
      isDownSwipe,
      distanceX,
      distanceY,
    };
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
}

// Hook for viewport dimensions
export function useViewport() {
  const [viewport, setViewport] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const updateViewport = () => {
      if (typeof window !== 'undefined') {
        setViewport({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);

    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  return viewport;
}