'use client';

import { useEffect, useState } from 'react';
import { NormalizedBusiness } from '@/types/business';
import { CTASection } from '@/components/CTASection';
import { cn, getDirectionalClasses } from '@/lib/utils';
import { useMobileDetection } from '@/hooks/useMobileDetection';

interface MobileStickyBarProps {
  business: NormalizedBusiness;
  locale?: 'he' | 'en';
}

export function MobileStickyBar({ business, locale = 'en' }: MobileStickyBarProps) {
  const { isMobile } = useMobileDetection();
  const [isVisible, setIsVisible] = useState(false);
  const containerClasses = getDirectionalClasses(locale, 'container');

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar after scrolling past the hero section (about 50vh)
      const scrollY = window.scrollY;
      const shouldShow = scrollY > window.innerHeight * 0.5;
      setIsVisible(shouldShow);
    };

    if (isMobile) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isMobile]);

  // Don't render on desktop
  if (!isMobile) return null;

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 transform transition-all duration-300 ease-in-out',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      )}
      dir={containerClasses.dir}
    >
      {/* Backdrop blur area */}
      <div className="absolute inset-0 bg-[#0D1117]/95 backdrop-blur-md"></div>

      {/* Safe area padding for devices with home indicators */}
      <div className="relative px-4 pt-3 pb-safe-area-bottom">
        <div className="pb-2"> {/* Extra padding for safe area */}
          <CTASection
            business={business}
            locale={locale}
            compactMode={true}
            className="space-y-2"
          />
        </div>
      </div>

      {/* Subtle top border */}
      <div className="absolute top-0 left-4 right-4 h-px bg-white/10"></div>
    </div>
  );
}