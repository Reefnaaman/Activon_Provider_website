'use client';

import { Package, Activity, Tag, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { NormalizedBusiness, Service } from '@/types/business';
import { shouldShowServicesSection } from '@/lib/normalize';
import { cn, getBusinessServices } from '@/lib/utils';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { useMobileDetection } from '@/hooks/useMobileDetection';
import { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ServicesSectionProps {
  business: NormalizedBusiness;
  services?: Service[];
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

export function ServicesSection({ business, services = [], className, locale = 'en', showcaseMode = false }: ServicesSectionProps) {
  const { isMobile } = useMobileDetection();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  
  // State for service/activity navigation
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [viewMode, setViewMode] = useState<'services' | 'activities'>('services');
  
  // State for contact popup
  const [showContactPopup, setShowContactPopup] = useState(false);

  if (!shouldShowServicesSection(business)) {
    return null;
  }

  // Create badges from real services data
  const serviceBadges = [];
  
  // Use real services if available
  if (services.length > 0) {
    services.forEach(service => {
      if (service.service_is_active) {
        serviceBadges.push({
          title: service.service_title,
          type: 'service' as const
        });
        
        // Add activity badges
        if (service.activities) {
          service.activities.forEach(activity => {
            if (activity.is_active) {
              serviceBadges.push({
                title: activity.title,
                type: 'activity' as const
              });
            }
          });
        }
      }
    });
  } else {
    // Fallback to generic badges if no services data
    const businessServices = getBusinessServices(business.serviceCount, business.activityCount);
    serviceBadges.push(...businessServices);
  }

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
    // Separate service and activity cards
    const serviceCards: any[] = [];
    const allActivities: any[] = [];
    
    // Use real services data if available
    if (services.length > 0) {
      services.forEach((service, index) => {
        // Add the main service card
        if (service.service_is_active) {
          // Get the main image from the service
          const mainImage = service.service_media_object?.images?.[0]?.uri || 
                           business.gallery[index % business.gallery.length]?.uri || 
                           business.heroImage?.uri ||
                           'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=400&h=300&fit=crop&q=80';
          
          const serviceCard = {
            id: `service-${service.service_id}`,
            title: service.service_title,
            description: service.service_description || 'Service details coming soon',
            price: 'Contact for pricing',
            type: 'service',
            image: mainImage,
            serviceData: service, // Store the full service data
            activityCount: service.activities?.filter(a => a.is_active).length || 0
          };
          
          serviceCards.push(serviceCard);
          
          // Collect activities for this service
          if (service.activities && service.activities.length > 0) {
            service.activities.forEach((activity, actIndex) => {
              if (activity.is_active) {
                // Get pricing info from the activity
                let price = 'Contact for pricing';
                if (activity.pricing_object?.options && activity.pricing_object.options.length > 0) {
                  const defaultOption = activity.pricing_object.options.find(opt => opt.isDefault) || activity.pricing_object.options[0];
                  const currency = activity.pricing_object.currency || 'ILS';
                  price = `${currency} ${defaultOption.price}/${defaultOption.type}`;
                }
                
                // Get activity image or fallback
                const activityImage = activity.media_object?.images?.[0]?.uri ||
                                    service.service_media_object?.images?.[actIndex]?.uri ||
                                    business.gallery[(index + actIndex) % business.gallery.length]?.uri || 
                                    business.heroImage?.uri ||
                                    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&q=80';
                
                allActivities.push({
                  id: `activity-${activity.id}`,
                  title: activity.title,
                  description: activity.description || 'Activity details coming soon',
                  duration: activity.max_capacity ? `Up to ${activity.max_capacity} participants` : price,
                  price: price,
                  type: 'activity',
                  image: activityImage,
                  serviceId: service.service_id,
                  activityData: activity
                });
              }
            });
          }
        }
      });
    } else {
      // Fallback to template data if no real services are available
      const serviceTemplates = [
        { title: 'Service Coming Soon', description: 'We are preparing our service catalog', price: 'Contact us' }
      ];
      
      if (business.serviceCount > 0) {
        for (let i = 0; i < Math.min(business.serviceCount, 6); i++) {
          const template = serviceTemplates[0];
          serviceCards.push({
            id: `service-${i}`,
            title: template.title,
            description: template.description,
            price: template.price,
            type: 'service',
            image: business.gallery[i % business.gallery.length]?.uri || 
                   business.heroImage?.uri || 
                   'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=400&h=300&fit=crop&q=80',
            activityCount: 0
          });
        }
      }
    }
    
    // Get activities for the selected service
    const selectedServiceActivities = selectedService 
      ? allActivities.filter(activity => activity.serviceId === selectedService.service_id)
      : [];
    
    // Always show services, but also show activities when a service is selected
    const showActivities = selectedService !== null;

    // Handle service selection
    const handleServiceClick = (serviceCard: any) => {
      if (serviceCard.type === 'service') {
        setSelectedService(serviceCard.serviceData);
        setViewMode('activities');
      }
    };
    
    // Handle back to services
    const handleBackToServices = () => {
      setSelectedService(null);
      setViewMode('services');
    };
    
    // Handle contact popup
    const handleContactClick = () => {
      setShowContactPopup(true);
    };
    
    const handleCloseContact = () => {
      setShowContactPopup(false);
    };

    return (
      <div className={cn('w-full', className)}>
        {/* Services Section - Always Visible */}
        <div className="relative">
          {/* Mobile scroll navigation for services */}
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
                <div 
                  className={cn(
                    "border rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl h-full flex flex-col touch-target active:scale-95",
                    selectedService?.service_id === card.serviceData?.service_id
                      ? "bg-[#2E6FF2]/20 border-[#2E6FF2]/50 shadow-lg shadow-[#2E6FF2]/20"
                      : "bg-[#0D1117] border-white/10 hover:bg-[#161B22] hover:shadow-[#2E6FF2]/20",
                    card.type === 'service' && "cursor-pointer"
                  )}
                  onClick={() => handleServiceClick(card)}
                >
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
                        {card.type === 'service' 
                          ? (card.activityCount > 0 ? `${card.activityCount} activities` : (card as any).price)
                          : (card as any).duration || (card as any).price
                        }
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
                        {card.type === 'service' ? 'View Activities' : 'Join Activity'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activities Section - Shows when service is selected */}
        {showActivities && (
          <div className="mt-12 mb-20">
            {/* Activities Header - Similar to "Our Services" rounded rectangle */}
            <div className="flex justify-center mb-8">
              <div className="bg-[#0D1117]/80 backdrop-blur-md border border-white/10 rounded-full px-8 py-4 shadow-2xl">
                <h3 className="text-2xl font-heading text-white text-center tracking-wide flex items-center gap-3">
                  <Activity className="w-6 h-6 text-[#2E6FF2]" />
                  <span>{locale === 'he' ? 'החוגים שלנו' : 'Our Activities'}</span>
                </h3>
              </div>
            </div>

            {/* Selected Service Info */}
            <div className="text-center mb-8">
              <p className="text-white/70 font-body mb-2">
                {locale === 'he' ? 'פעילויות עבור' : 'Activities for'}
              </p>
              <h4 className="text-xl font-subheading text-white mb-4">
                "{selectedService.service_title}"
              </h4>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={handleBackToServices}
                  className="flex items-center gap-1 text-white/60 hover:text-white transition-colors duration-200 text-sm"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {locale === 'he' ? 'בטל בחירה' : 'Clear Selection'}
                </button>
              </div>
            </div>

            {/* Activities Grid */}
            <div className="relative">
              {/* Mobile scroll navigation for activities */}
              {isMobile && selectedServiceActivities.length > 1 && (
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
                    {selectedServiceActivities.length} {selectedServiceActivities.length === 1 ? 'activity' : 'activities'}
                  </div>
                </div>
              )}

              <div 
                className={cn(
                  isMobile 
                    ? "flex gap-4 overflow-x-auto scroll-snap-x mobile-scroll pb-2" 
                    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                )}
              >
                {selectedServiceActivities.map((card, index) => (
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
                            {card.duration || card.price}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
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
                        
                        {/* CTA Button */}
                        <div className="pt-2 mt-auto">
                          <button 
                            onClick={handleContactClick}
                            className={cn(
                              "w-full icy-button icy-text rounded-xl font-ui tracking-wide touch-target active:scale-95",
                              isMobile ? "px-3 py-2 text-sm" : "px-4 py-2.5"
                            )}
                          >
                            {locale === 'he' ? 'צרו קשר' : 'Contact Us'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Empty State for Activities */}
            {selectedServiceActivities.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-[#2E6FF2]/20 to-[#5F8CFF]/20 border border-[#2E6FF2]/30 rounded-3xl p-12 max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#2E6FF2] to-[#5F8CFF] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Activity className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-heading text-white mb-4">
                    {locale === 'he' ? 'אין חוגים זמינים' : 'No Activities Available'}
                  </h3>
                  <p className="text-white/70 font-body text-lg leading-relaxed mb-6">
                    {locale === 'he' 
                      ? 'חוגים יתווספו בקרוב לשירות זה. בינתיים, אתם מוזמנים ליצור קשר לפרטים נוספים.'
                      : 'Activities will be added soon for this service. In the meantime, feel free to contact us for more details.'
                    }
                  </p>
                  <div className="flex justify-center">
                    <button 
                      onClick={handleBackToServices}
                      className="icy-button icy-text px-6 py-3 rounded-xl font-ui tracking-wide hover:scale-105 transition-all duration-200"
                    >
                      {locale === 'he' ? 'חזרה לשירותים' : 'Back to Services'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Contact Popup - Rendered at document body level */}
        {showContactPopup && typeof window !== 'undefined' && createPortal(
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99999] flex items-center justify-center p-4" onClick={handleCloseContact}>
            <div className="bg-[#0D1117] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-heading text-white">
                  {locale === 'he' ? 'צרו קשר' : 'Get In Touch'}
                </h3>
                <button 
                  onClick={handleCloseContact}
                  className="text-white/60 hover:text-white transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Contact Information */}
              <div className="space-y-4 mb-6">
                {/* Phone */}
                {business.phones.length > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#2E6FF2]/20 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#2E6FF2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-medium">{business.phones[0].number}</p>
                      <p className="text-white/60 text-sm">{business.phones[0].label}</p>
                    </div>
                  </div>
                )}
                
                {/* Email */}
                {business.emails.length > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#2E6FF2]/20 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#2E6FF2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-medium">{business.emails[0].email}</p>
                      <p className="text-white/60 text-sm">{business.emails[0].label}</p>
                    </div>
                  </div>
                )}
                
                {/* Address */}
                {business.addresses.length > 0 && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#2E6FF2]/20 rounded-full flex items-center justify-center mt-1">
                      <svg className="w-5 h-5 text-[#2E6FF2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {business.addresses[0].line1}
                      </p>
                      <p className="text-white/60 text-sm">
                        {business.addresses[0].city}, {business.addresses[0].country}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                {/* WhatsApp */}
                {business.phones.some(phone => phone.hasWhatsApp) && (
                  <a 
                    href={`https://wa.me/${business.phones.find(p => p.hasWhatsApp)?.number.replace(/[^\d]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:scale-105 transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    {locale === 'he' ? 'שלח הודעה בוואטסאפ' : 'Send WhatsApp Message'}
                  </a>
                )}
                
                {/* Call */}
                {business.phones.length > 0 && (
                  <a 
                    href={`tel:${business.phones[0].number}`}
                    className="w-full icy-button icy-text px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:scale-105 transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {locale === 'he' ? 'התקשר' : 'Call'}
                  </a>
                )}
                
                {/* Map Links */}
                {business.addresses.length > 0 && (
                  <div className="flex gap-2">
                    <a
                      href={`https://maps.google.com/maps?q=${encodeURIComponent(
                        `${business.addresses[0].line1 || ''} ${business.addresses[0].city || ''} ${business.addresses[0].country || ''}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-4 py-3 rounded-xl text-center font-medium backdrop-blur-md text-sm hover:scale-105 transition-all duration-200"
                    >
                      Google Maps
                    </a>
                    <a
                      href={`https://waze.com/ul?q=${encodeURIComponent(
                        `${business.addresses[0].line1 || ''} ${business.addresses[0].city || ''} ${business.addresses[0].country || ''}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 px-4 py-3 rounded-xl text-center font-medium backdrop-blur-md text-sm hover:scale-105 transition-all duration-200"
                    >
                      Waze
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
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
        {isMobile && serviceBadges.length > 2 && (
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
          {serviceBadges.map((service, index) => (
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
      {serviceBadges.length > 0 && (
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