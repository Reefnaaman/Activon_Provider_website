'use client';

import Image from 'next/image';
import { NormalizedBusiness } from '@/types/business';
import { CTASection } from '@/components/CTASection';
import { ServiceBadge } from '@/components/ServiceBadge';
import { Gallery } from '@/components/Gallery';
import { cn, getDirectionalClasses, initials } from '@/lib/utils';

interface MobileHeroProps {
  business: NormalizedBusiness;
  locale?: 'he' | 'en';
  serviceBadges?: Array<{ title: string; type: 'service' | 'activity' }>;
}

export function MobileHero({ business, locale = 'en', serviceBadges = [] }: MobileHeroProps) {
  const textClasses = getDirectionalClasses(locale, 'text');

  return (
    <div className="lg:hidden relative overflow-hidden h-full">
      {/* Hero Image Section - Full viewport Gallery background */}
      <div className="absolute inset-0 w-full h-full">
        <Gallery business={business} backgroundMode />

        {/* Gradient overlay for better card contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"></div>
      </div>

      {/* Ultra-smooth, long fade transition */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0D1117] via-[#0D1117]/95 via-[#0D1117]/80 via-[#0D1117]/50 via-[#0D1117]/20 to-transparent pointer-events-none z-20"></div>

      {/* Floating Glassmorphic Info Card - Better spacing from navbar */}
      <div className="absolute top-32 left-4 right-4 z-10">
        <div
          className={cn(
            "bg-white/8 backdrop-blur-[20px] saturate-[140%] brightness-[105%]",
            "border border-white/25 rounded-3xl p-4 shadow-2xl",
            "transition-all duration-300 max-w-full overflow-hidden"
          )}
          style={{
            backdropFilter: 'blur(20px) saturate(140%) brightness(105%)',
            maxHeight: 'calc(100vh - 250px)', // Prevent card from being too tall
          }}
          dir={textClasses.dir}
        >
          {/* Business Name */}
          <h1 className={cn(
            "text-2xl font-display text-white mb-3 tracking-tight leading-tight",
            textClasses.className
          )}>
            {business.name}
          </h1>

          {/* Description with better truncation */}
          {business.description && (
            <p className={cn(
              "text-gray-300 font-body text-sm leading-relaxed mb-4",
              textClasses.className,
              "line-clamp-3" // Use CSS line clamping for better text truncation
            )}>
              {business.description}
            </p>
          )}

          {/* Service Badges - Supporting info */}
          {(business.categoryName || serviceBadges.length > 0) && (
            <div className="mb-0">
              <div
                className={cn(
                  "flex gap-2 overflow-x-auto pb-1",
                  "scrollbar-hide snap-x snap-mandatory",
                  "-mx-2 px-2", // Better horizontal scroll padding
                  locale === 'he' ? 'flex-row-reverse' : 'flex-row'
                )}
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
              {business.categoryName && (
                <span className={cn(
                  "bg-blue-500/20 border border-blue-400/30 px-3 py-1.5",
                  "rounded-lg text-blue-300 text-xs font-medium whitespace-nowrap",
                  "flex-shrink-0 snap-center",
                  "transition-all duration-200 active:scale-95"
                )}>
                  {business.categoryName}
                </span>
              )}
              {serviceBadges.slice(0, 4).map((service, index) => (
                <div key={`mobile-hero-service-${index}`} className="flex-shrink-0 snap-center">
                  <ServiceBadge
                    service={{
                      title: service.title,
                      type: service.type
                    }}
                    size="sm"
                  />
                </div>
              ))}
              {serviceBadges.length > 4 && (
                <span className={cn(
                  "bg-gray-500/20 border border-gray-400/30 px-3 py-1.5",
                  "rounded-lg text-gray-300 text-xs font-medium whitespace-nowrap",
                  "flex-shrink-0 snap-center flex items-center"
                )}>
                  +{serviceBadges.length - 4} more
                </span>
              )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Smaller, Less Aggressive CTAs - Outside the card, same width */}
      <div className="absolute top-72 left-4 right-4 z-10">
        <div className="transform scale-90">
          <CTASection
            business={business}
            locale={locale}
            heroMode={true}
          />
        </div>
      </div>


    </div>
  );
}