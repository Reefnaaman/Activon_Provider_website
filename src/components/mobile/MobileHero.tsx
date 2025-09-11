'use client';

import Image from 'next/image';
import { NormalizedBusiness } from '@/types/business';
import { CTASection } from '@/components/CTASection';
import { ServiceBadge } from '@/components/ServiceBadge';
import { Gallery } from '@/components/Gallery';
import { cn, getDirectionalClasses, getBusinessServices, initials } from '@/lib/utils';

interface MobileHeroProps {
  business: NormalizedBusiness;
  locale?: 'he' | 'en';
}

export function MobileHero({ business, locale = 'en' }: MobileHeroProps) {
  const textClasses = getDirectionalClasses(locale, 'text');
  const businessServices = getBusinessServices(business.serviceCount, business.activityCount);

  return (
    <div className="lg:hidden relative overflow-hidden">
      {/* Hero Image Section - Uses animated Gallery background */}
      <div className="aspect-[16/9] w-full relative overflow-hidden">
        <Gallery business={business} backgroundMode />
        
        {/* Gradient overlay for better card contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"></div>
      </div>

      {/* Floating Glassmorphic Info Card - Positioned much lower */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div 
          className={cn(
            "bg-white/8 backdrop-blur-[20px] saturate-[140%] brightness-[105%]",
            "border border-white/25 rounded-4xl p-5 shadow-2xl",
            "transition-all duration-300 max-w-full overflow-hidden"
          )}
          style={{
            backdropFilter: 'blur(20px) saturate(140%) brightness(105%)',
          }}
          dir={textClasses.dir}
        >
          {/* Business Name */}
          <h1 className={cn(
            "text-3xl font-display text-white mb-4 tracking-tight leading-tight",
            textClasses.className
          )}>
            {business.name}
          </h1>

          {/* Description */}
          {business.description && (
            <p className={cn(
              "text-gray-300 font-body text-base leading-relaxed mb-6",
              textClasses.className
            )}>
              {business.description.length > 150 
                ? business.description.substring(0, 150) + '...' 
                : business.description
              }
            </p>
          )}

          {/* Service Badges - Proper Container */}
          {(business.categoryName || businessServices.length > 0) && (
            <div className="mb-5">
              <div 
                className={cn(
                  "flex gap-2 overflow-x-auto pb-2",
                  "scrollbar-hide snap-x snap-mandatory",
                  "px-1 -mx-1", // Add padding and negative margin for better scroll area
                  locale === 'he' ? 'flex-row-reverse' : 'flex-row'
                )}
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
              {business.categoryName && (
                <span className={cn(
                  "bg-blue-500/20 border border-blue-400/30 px-4 py-2",
                  "rounded-xl text-blue-300 text-sm font-medium whitespace-nowrap",
                  "flex-shrink-0 snap-center",
                  "transition-all duration-200 hover:scale-105"
                )}>
                  {business.categoryName}
                </span>
              )}
              {businessServices.slice(0, 4).map((service, index) => (
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
              {businessServices.length > 4 && (
                <span className={cn(
                  "bg-gray-500/20 border border-gray-400/30 px-4 py-2",
                  "rounded-xl text-gray-300 text-sm font-medium whitespace-nowrap",
                  "flex-shrink-0 snap-center flex items-center"
                )}>
                  +{businessServices.length - 4} more
                </span>
              )}
              </div>
            </div>
          )}

          {/* Primary CTA Button - Touch Optimized */}
          <div className="pt-1">
            <CTASection 
              business={business} 
              locale={locale}
              className="space-y-3"
            />
          </div>
        </div>
      </div>

      {/* Safe area spacer for overlapping card - Much larger gap between sections */}
      <div className="h-96 bg-[#0D1117] pt-32"></div>
    </div>
  );
}