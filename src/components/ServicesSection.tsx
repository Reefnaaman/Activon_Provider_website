'use client';

import { Package, Activity, Tag, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { NormalizedBusiness } from '@/types/business';
import { shouldShowServicesSection } from '@/lib/normalize';
import { cn, getBusinessServices } from '@/lib/utils';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { useMobileDetection } from '@/hooks/useMobileDetection';
import { useRef, useState, useEffect } from 'react';

interface ServicesSectionProps {
  business: NormalizedBusiness;
  className?: string;
  locale?: 'he' | 'en';
  showcaseMode?: boolean;
}

function ServiceBadge({ 
  icon: Icon, 
  label, 
  count, 
  variant = 'default',
  className 
}: { 
  icon: React.ComponentType<{ className?: string }>; 
  label: string;
  count: number;
  variant?: 'default' | 'services' | 'activities' | 'category';
  className?: string;
}) {
  const { isMobile } = useMobileDetection();
  const variantClasses = {
    default: 'bg-gray-100 text-gray-700 border-gray-200',
    services: 'bg-blue-50 text-blue-700 border-blue-200 glass-surface',
    activities: 'bg-green-50 text-green-700 border-green-200 glass-surface',
    category: 'bg-purple-50 text-purple-700 border-purple-200 glass-surface',
  };

  return (
    <div className={cn(
      'inline-flex items-center gap-2 rounded-lg border font-ui transition-all duration-200 whitespace-nowrap',
      'hover:shadow-sm hover:scale-105 touch-target active:scale-95',
      // Mobile-optimized sizing
      isMobile ? 'px-3 py-2 text-sm' : 'px-3 py-2 text-sm',
      variantClasses[variant],
      className
    )}>
      <Icon className={cn(isMobile ? 'h-4 w-4' : 'h-4 w-4')} />
      <span>
        {count > 0 ? `${count}+ ${label}` : label}
      </span>
    </div>
  );
}

export function ServicesSection({ business, className, locale = 'en', showcaseMode = false }: ServicesSectionProps) {
  const { isMobile } = useMobileDetection();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  if (!shouldShowServicesSection(business)) {
    return null;
  }

  // Get business services and activities for display
  const businessServices = getBusinessServices(business.serviceCount, business.activityCount);

  // Handle scroll state for navigation buttons
  const updateScrollButtons = () => {
    if (scrollRef.current && isMobile) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      const cardWidth = 280; // Approximate card width + gap
      scrollRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const cardWidth = 280; // Approximate card width + gap
      scrollRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  };

  const strings = {
    he: {
      title: 'מה אני מציע/ה',
      services: 'שירותים',
      activities: 'פעילויות',
      comingSoon: 'פרטים נוספים יהיו זמינים בקרוב',
    },
    en: {
      title: 'What I Offer',
      services: 'services',
      activities: 'activities',
      comingSoon: 'Detailed service and activity information coming soon',
    },
  };

  const t = strings[locale];

  if (showcaseMode) {
    // Create beautiful service cards with placeholder images
    const serviceCards = [];
    
    // Enhanced service data with realistic examples
    const serviceTemplates = [
      { title: 'Monthly Orange Picking', description: 'Fresh seasonal oranges picked monthly from our organic groves', price: 'From $25' },
      { title: 'Home Garden Consultation', description: 'Expert advice on setting up your perfect home garden', price: 'From $75' },
      { title: 'Organic Produce Delivery', description: 'Weekly delivery of fresh, locally grown organic vegetables', price: 'Weekly' },
      { title: 'Seasonal Fruit Boxes', description: 'Curated selection of the finest seasonal fruits', price: 'Monthly' },
      { title: 'Garden Design Service', description: 'Professional garden planning and landscape design', price: 'Quote' },
      { title: 'Plant Care Workshop', description: 'Learn essential plant care and gardening techniques', price: 'Group rates' }
    ];

    const activityTemplates = [
      { title: 'Weekly Nature Walk', description: 'Guided nature walks exploring local flora and wildlife', duration: '2 hours' },
      { title: 'Family Farm Tours', description: 'Educational tours of our organic farm for the whole family', duration: '3 hours' },
      { title: 'Kids Gardening Club', description: 'Hands-on gardening activities for children ages 5-12', duration: '1.5 hours' },
      { title: 'Harvest Festival', description: 'Seasonal celebration with picking, tasting, and activities', duration: 'Full day' }
    ];
    
    // Add service cards
    if (business.serviceCount > 0) {
      for (let i = 0; i < Math.min(business.serviceCount, 6); i++) {
        const template = serviceTemplates[i % serviceTemplates.length];
        serviceCards.push({
          id: `service-${i}`,
          title: template.title,
          description: template.description,
          price: template.price,
          type: 'service',
          image: business.gallery[i % business.gallery.length]?.uri || 
                 business.heroImage?.uri || 
                 [
                   'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=400&h=300&fit=crop&q=80', // Orange picking/citrus harvest
                   'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&q=80', // Garden consultation/planning
                   'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop&q=80', // Organic produce delivery
                   'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&q=80', // Seasonal fruit boxes
                   'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&q=80', // Garden design service
                   'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&q=80'  // Plant care workshop
                 ][i % 6]
        });
      }
    }
    
    if (business.activityCount > 0) {
      for (let i = 0; i < Math.min(business.activityCount, 4); i++) {
        const template = activityTemplates[i % activityTemplates.length];
        serviceCards.push({
          id: `activity-${i}`,
          title: template.title,
          description: template.description,
          duration: template.duration,
          type: 'activity',
          image: business.gallery[(i + business.serviceCount) % business.gallery.length]?.uri || 
                 business.heroImage?.uri ||
                 [
                   'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&q=80', // Weekly nature walk - forest path
                   'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop&q=80', // Family farm tours - farm landscape
                   'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&q=80', // Kids gardening club - children with plants
                   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&q=80'  // Harvest festival - fall harvest scene
                 ][i % 4]
        });
      }
    }

    return (
      <div className={cn('w-full', className)}>
        {/* Mobile: Horizontal scroll, Desktop: Grid */}
        <div className="relative">
          {/* Mobile scroll navigation */}
          {isMobile && serviceCards.length > 1 && (
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">
                <button
                  onClick={scrollLeft}
                  disabled={!canScrollLeft}
                  className={cn(
                    "touch-target icy-glass rounded-xl flex items-center justify-center transition-all duration-200",
                    canScrollLeft ? 'hover:scale-105' : 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <ChevronLeft className="h-4 w-4 text-white" />
                </button>
                <button
                  onClick={scrollRight}
                  disabled={!canScrollRight}
                  className={cn(
                    "touch-target icy-glass rounded-xl flex items-center justify-center transition-all duration-200",
                    canScrollRight ? 'hover:scale-105' : 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <ChevronRight className="h-4 w-4 text-white" />
                </button>
              </div>
              <div className="text-white/60 text-sm font-ui">
                {serviceCards.length} {serviceCards.length === 1 ? 'service' : 'services'}
              </div>
            </div>
          )}

          <div 
            ref={scrollRef}
            className={cn(
              isMobile 
                ? "flex gap-4 overflow-x-auto scroll-snap-x mobile-scroll pb-2" 
                : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            )}
            onScroll={updateScrollButtons}
          >
            {serviceCards.map((card, index) => (
              <div 
                key={card.id} 
                className={cn(
                  "group",
                  isMobile ? "flex-shrink-0 w-64 scroll-snap-start" : "h-full"
                )}
              >
                <div className="bg-[#0D1117] border border-white/10 rounded-3xl overflow-hidden hover:bg-[#161B22] transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#2E6FF2]/20 h-full flex flex-col touch-target active:scale-95">
                  {/* Image */}
                  <div className={cn(
                    "overflow-hidden bg-gradient-to-br from-[#2E6FF2]/20 to-[#5F8CFF]/20 relative",
                    isMobile ? "aspect-[4/3]" : "aspect-[4/3]"
                  )}>
                    <img 
                      src={card.image} 
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading={index < 3 ? 'eager' : 'lazy'}
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Price/Duration badge */}
                    <div className="absolute bottom-4 right-4">
                      <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-[#0D1117]">
                        {card.type === 'service' ? card.price : card.duration}
                      </div>
                    </div>
                  </div>

                  {/* Content - flex-grow to fill remaining space */}
                  <div className={cn(
                    "space-y-3 flex-grow flex flex-col",
                    isMobile ? "p-4" : "p-6"
                  )}>
                    <h3 className={cn(
                      "font-subheading text-white group-hover:text-[#5F8CFF] transition-colors duration-300",
                      isMobile ? "text-lg" : "text-xl"
                    )}>
                      {card.title}
                    </h3>
                    <p className={cn(
                      "text-[#AEB4C1] font-body leading-relaxed flex-grow",
                      isMobile ? "text-xs" : "text-sm"
                    )}>
                      {isMobile && card.description.length > 80 
                        ? card.description.substring(0, 80) + '...' 
                        : card.description}
                    </p>
                    
                    {/* CTA Button - always at bottom */}
                    <div className="pt-2 mt-auto">
                      <button className={cn(
                        "w-full icy-button icy-text rounded-xl font-ui tracking-wide touch-target active:scale-95",
                        isMobile ? "px-3 py-2 text-sm" : "px-4 py-2.5"
                      )}>
                        {card.type === 'service' ? 'Learn More' : 'Join Activity'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Regular mode (existing implementation)
  return (
    <section className={cn('w-full space-y-4', className)}>
      <h2 className={cn(
        "font-heading text-gray-900",
        isMobile ? "text-xl" : "text-2xl"
      )}>
        {t.title}
      </h2>
      
      {/* Mobile: Horizontal scroll, Desktop: Flex wrap */}
      <div className="relative">
        {/* Mobile scroll navigation for badges */}
        {isMobile && businessServices.length > 2 && (
          <div className="flex justify-end mb-2">
            <div className="text-gray-600 text-xs font-ui">
              Scroll to see all →
            </div>
          </div>
        )}

        <div className={cn(
          isMobile 
            ? "flex gap-3 overflow-x-auto mobile-scroll pb-2" 
            : "flex flex-wrap gap-3"
        )}>
          {/* Individual Service and Activity Badges */}
          {businessServices.map((service, index) => (
            <ServiceBadge
              key={`service-${index}`}
              icon={service.type === 'service' ? Package : Activity}
              label={service.title}
              count={0}
              variant={service.type === 'service' ? 'services' : 'activities'}
              className={isMobile ? "scroll-snap-start" : undefined}
            />
          ))}

          {business.categoryName && (
            <ServiceBadge
              icon={Tag}
              label={business.categoryName}
              count={0}
              variant="category"
              className={isMobile ? "scroll-snap-start" : undefined}
            />
          )}

          {business.subcategoryName && (
            <ServiceBadge
              icon={Users}
              label={business.subcategoryName}
              count={0}
              variant="category"
              className={isMobile ? "scroll-snap-start" : undefined}
            />
          )}
        </div>
      </div>

      {/* Future: Activity cards would go here when endpoints are available */}
      {businessServices.length > 0 && (
        <div className={cn(
          "mt-6 rounded-xl glass-surface border border-gray-200",
          isMobile ? "p-3" : "p-4"
        )}>
          <p className={cn(
            "font-caption text-gray-600 text-center",
            isMobile ? "text-xs" : "text-sm"
          )}>
            {t.comingSoon}
          </p>
        </div>
      )}
    </section>
  );

  // Trigger scroll button updates on mount
  useEffect(() => {
    if (isMobile) {
      updateScrollButtons();
    }
  }, [isMobile]);
}