'use client';

import { MessageCircle, Phone, Mail, ExternalLink, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { NormalizedBusiness, CTA } from '@/types/business';
import { pickCTA, pickSecondaryCTA } from '@/lib/normalize';
import { cn, getDirectionalClasses, getLanguageSpecificClasses } from '@/lib/utils';
import { useMobileDetection } from '@/hooks/useMobileDetection';

interface CTASectionProps {
  business: NormalizedBusiness;
  className?: string;
  compactMode?: boolean;
  heroMode?: boolean; // New: even more compact for hero cards
  locale?: 'he' | 'en';
}

// Helper function to get shorter labels for hero mode
function getHeroLabel(cta: CTA, locale: 'he' | 'en' = 'en'): string {
  switch (cta.type) {
    case 'whatsapp':
      return locale === 'he' ? 'וואטסאפ' : 'WhatsApp';
    case 'call':
      return locale === 'he' ? 'התקשר' : 'Call';
    case 'email':
      return locale === 'he' ? 'מייל' : 'Email';
    default:
      return cta.label;
  }
}

function CTAButton({
  cta,
  variant = 'primary',
  className,
  locale = 'en',
  heroMode = false
}: {
  cta: CTA;
  variant?: 'primary' | 'secondary';
  className?: string;
  locale?: 'he' | 'en';
  heroMode?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { isMobile, isTouchDevice } = useMobileDetection();
  const icons = {
    whatsapp: MessageCircle,
    call: Phone,
    email: Mail,
    none: ExternalLink,
  };

  const Icon = icons[cta.type];

  const handleClick = async (e: React.MouseEvent) => {
    if (cta.disabled || isLoading) {
      e.preventDefault();
      return;
    }

    // Show loading state for mobile interactions
    if (isMobile && cta.type !== 'none') {
      setIsLoading(true);
      // Brief loading state to provide visual feedback
      setTimeout(() => setIsLoading(false), 500);
    }

    // Analytics event (to be implemented later)
    if (typeof window !== 'undefined') {
      // Track CTA click
      console.log('CTA clicked:', {
        type: cta.type,
        label: cta.label,
        isMobile,
        isTouchDevice,
      });
    }

    // Add haptic feedback on supported devices
    if ('vibrate' in navigator && isTouchDevice) {
      navigator.vibrate(50);
    }
  };

  const baseClasses = cn(
    'inline-flex items-center justify-center gap-2 rounded-2xl font-ui transition-all duration-300 tracking-wide',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500/50',
    'active:scale-95 transform-gpu',
    // Ensure 56px touch targets on mobile
    isMobile || isTouchDevice ? 'min-h-[56px] px-6 py-4 text-base' : 'px-8 py-3 text-sm min-h-[48px]',
    locale === 'he' ? 'flex-row-reverse' : '',
    (cta.disabled || isLoading) && 'opacity-50 cursor-not-allowed',
    isLoading && 'pointer-events-none',
    className
  );

  const getVariantClasses = () => {
    if (variant === 'primary') {
      // Use WhatsApp green gradient for WhatsApp CTAs
      if (cta.type === 'whatsapp') {
        return 'bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white hover:shadow-lg hover:shadow-[#25D366]/50 hover:scale-105 font-medium';
      }
      // Default blue gradient for other primary CTAs
      return 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-105 font-medium';
    }
    return 'icy-button icy-text hover:scale-105';
  };
  
  const variantClasses = getVariantClasses();

  if (cta.disabled) {
    return (
      <button
        disabled
        className={cn(baseClasses, variantClasses)}
        onClick={handleClick}
      >
        {isLoading ? (
          <Loader2 className={cn('animate-spin', isMobile ? 'h-5 w-5' : 'h-4 w-4')} />
        ) : (
          <Icon className={cn(isMobile ? 'h-5 w-5' : 'h-4 w-4')} />
        )}
        <span className={cn('font-medium', isMobile && 'text-base')}>
          {heroMode ? getHeroLabel(cta, locale) : cta.label}
        </span>
      </button>
    );
  }

  return (
    <a
      href={cta.href}
      className={cn(baseClasses, variantClasses)}
      onClick={handleClick}
      target={cta.type === 'whatsapp' ? '_blank' : undefined}
      rel={cta.type === 'whatsapp' ? 'noopener noreferrer' : undefined}
      // Improved mobile tap behavior
      onTouchStart={isTouchDevice ? (e) => e.currentTarget.style.transform = 'scale(0.98)' : undefined}
      onTouchEnd={isTouchDevice ? (e) => e.currentTarget.style.transform = 'scale(1)' : undefined}
      onTouchCancel={isTouchDevice ? (e) => e.currentTarget.style.transform = 'scale(1)' : undefined}
    >
      {isLoading ? (
        <Loader2 className={cn('animate-spin', isMobile ? 'h-5 w-5' : 'h-4 w-4')} />
      ) : (
        <Icon className={cn(isMobile ? 'h-5 w-5' : 'h-4 w-4')} />
      )}
      <span className={cn('font-medium', isMobile && 'text-base')}>
        {heroMode ? getHeroLabel(cta, locale) : cta.label}
      </span>
    </a>
  );
}

export function CTASection({ business, className, compactMode = false, heroMode = false, locale = 'en' }: CTASectionProps) {
  const { isMobile } = useMobileDetection();
  const primaryCTA = pickCTA(business);
  const secondaryCTA = pickSecondaryCTA(business, primaryCTA.type);
  
  const textClasses = getDirectionalClasses(locale, 'text');
  const flexClasses = getDirectionalClasses(locale, 'flex');
  const containerClasses = getDirectionalClasses(locale, 'container');

  // Hero mode: horizontal layout with shorter text
  if (heroMode) {
    return (
      <div className={cn(
        'flex gap-2',
        locale === 'he' ? 'flex-row-reverse' : 'flex-row',
        className
      )} dir={containerClasses.dir}>
        <CTAButton
          cta={primaryCTA}
          variant="primary"
          locale={locale}
          heroMode={true}
          className="flex-1"
        />
        {secondaryCTA && (
          <CTAButton
            cta={secondaryCTA}
            variant="secondary"
            locale={locale}
            heroMode={true}
            className="flex-1"
          />
        )}
      </div>
    );
  }

  if (compactMode) {
    return (
      <div className={cn(
        'flex flex-row',
        'gap-2',
        locale === 'he' ? 'flex-row-reverse' : '',
        className
      )} dir={containerClasses.dir}>
        <CTAButton
          cta={primaryCTA}
          variant="primary"
          locale={locale}
          heroMode={false}
          className="flex-1"
        />
        {secondaryCTA && (
          <CTAButton
            cta={secondaryCTA}
            variant="secondary"
            locale={locale}
            heroMode={false}
            className="flex-1"
          />
        )}
      </div>
    );
  }

  return (
    <section className={cn('w-full', className)} dir={containerClasses.dir}>
      <div className={cn(
        // Mobile-first responsive layout
        "flex flex-col gap-3",
        // Tablet layout
        "sm:flex-row sm:gap-3", 
        // Desktop layout
        "lg:flex-col lg:gap-4",
        // RTL support
        locale === 'he' ? 'sm:flex-row-reverse items-end sm:items-start' : 'sm:flex-row items-start',
        // Mobile-specific adjustments
        isMobile && 'gap-4'
      )}>
        <CTAButton
          cta={primaryCTA}
          variant="primary"
          locale={locale}
          heroMode={false}
          className="w-full sm:w-auto lg:w-full"
        />
        {secondaryCTA && (
          <CTAButton
            cta={secondaryCTA}
            variant="secondary"
            locale={locale}
            heroMode={false}
            className="w-full sm:w-auto lg:w-full"
          />
        )}
      </div>
    </section>
  );
}