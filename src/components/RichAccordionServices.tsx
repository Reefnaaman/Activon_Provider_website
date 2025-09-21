'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Users, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { NormalizedBusiness, Service } from '@/types/business';
import { CTASection } from '@/components/CTASection';
import { cn, getDirectionalClasses } from '@/lib/utils';
import { useMobileDetection } from '@/hooks/useMobileDetection';

interface RichAccordionServicesProps {
  business: NormalizedBusiness;
  services?: Service[];
  className?: string;
  locale?: 'he' | 'en';
  expandServiceId?: number; // Allow external control of which service to expand
}

interface ServiceCardProps {
  service: Service;
  business: NormalizedBusiness;
  isExpanded: boolean;
  onToggle: () => void;
  locale: 'he' | 'en';
}

// Get availability status with color coding
function getAvailabilityStatus(activity: any) {
  // This would come from real data, using placeholder logic for now
  const available = Math.random() > 0.5;
  const waitlist = !available && Math.random() > 0.5;

  if (available) {
    return { status: 'available', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20' };
  } else if (waitlist) {
    return { status: 'waitlist', icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
  } else {
    return { status: 'full', icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20' };
  }
}

function ActivityCard({ activity, business, locale }: { activity: any; business: NormalizedBusiness; locale: 'he' | 'en' }) {
  const { isMobile } = useMobileDetection();
  const availability = getAvailabilityStatus(activity);
  const StatusIcon = availability.icon;

  // Debug logging to see what data we're getting
  console.log('Activity data:', {
    title: activity.title,
    age_range: activity.age_range,
    schedule: activity.schedule,
    id: activity.id
  });

  // Get activity image or fallback
  const activityImage = activity.media_object?.images?.[0]?.uri ||
                       business.gallery[0]?.uri ||
                       business.heroImage?.uri ||
                       'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&q=80';

  // Parse ages - handle both string and object formats
  const ages = (() => {
    if (typeof activity.age_range === 'string') {
      return activity.age_range;
    } else if (activity.age_range && typeof activity.age_range === 'object') {
      const { min, max } = activity.age_range;
      if (min && max) {
        return `Ages ${min}-${max}`;
      } else if (min) {
        return `Ages ${min}+`;
      } else if (max) {
        return `Ages up to ${max}`;
      }
    }
    return 'Ages 8-12'; // fallback
  })();

  // Parse schedule - handle different data types safely
  const schedule = (() => {
    if (typeof activity.schedule === 'string') {
      return activity.schedule;
    } else if (activity.schedule && typeof activity.schedule === 'object') {
      // If schedule is an object, try to extract meaningful info
      return 'See details for schedule';
    }
    return 'Mon/Wed 4-5 PM'; // fallback
  })();

  const statusLabels = {
    he: {
      available: 'פנוי',
      waitlist: 'רשימת המתנה',
      full: 'מלא'
    },
    en: {
      available: 'Available',
      waitlist: 'Waitlist',
      full: 'Full'
    }
  };

  return (
    <div className={cn(
      'rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02]',
      'bg-[#0D1117]/30 backdrop-blur-md border border-white/10',
      isMobile ? 'mb-4' : 'mb-4 md:mb-0'
    )}>
      {/* Activity Image */}
      <div className="aspect-[16/10] relative overflow-hidden">
        <img
          src={activityImage}
          alt={activity.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Status Badge */}
        <div className={cn(
          'absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md border',
          availability.bg,
          availability.color,
          'border-white/20'
        )}>
          <div className="flex items-center gap-1.5">
            <StatusIcon className="w-3 h-3" />
            {statusLabels[locale][availability.status]}
          </div>
        </div>
      </div>

      {/* Activity Content */}
      <div className="p-4">
        <h4 className="text-white font-medium text-lg mb-3">
          {typeof activity.title === 'string' ? activity.title : 'Activity'}
        </h4>

        {/* Activity Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Users className="w-4 h-4 text-blue-400" />
            <span>{ages}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>{schedule}</span>
          </div>
        </div>

        {/* CTA Buttons - Direct Contact Actions */}
        <div className="flex gap-2">
          {/* WhatsApp Button */}
          {business.phones.some(phone => phone.hasWhatsApp) && (
            <a
              href={`https://wa.me/${business.phones.find(p => p.hasWhatsApp)?.number.replace(/[^\d]/g, '')}?text=${encodeURIComponent(`Hi! I'm interested in ${activity.title}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-green-500/20 border border-green-400/30 text-green-300 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-green-500/30 active:scale-95 text-center"
            >
              {locale === 'he' ? 'וואטסאפ' : 'WhatsApp'}
            </a>
          )}

          {/* Call Button */}
          {business.phones.length > 0 && (
            <a
              href={`tel:${business.phones[0].number}`}
              className="flex-1 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-blue-500/30 active:scale-95 text-center"
            >
              {locale === 'he' ? 'התקשר' : 'Call'}
            </a>
          )}

          {/* Fallback if no contact methods */}
          {business.phones.length === 0 && (
            <div className="flex-1 bg-gray-500/20 border border-gray-400/30 text-gray-400 px-4 py-2.5 rounded-xl text-sm font-medium text-center">
              {locale === 'he' ? 'צור קשר' : 'Contact'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ service, business, isExpanded, onToggle, locale }: ServiceCardProps) {
  const { isMobile } = useMobileDetection();
  const textClasses = getDirectionalClasses(locale, 'text');

  // Get service hero image
  const serviceImage = service.service_media_object?.images?.[0]?.uri ||
                      business.gallery[0]?.uri ||
                      business.heroImage?.uri ||
                      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&q=80';

  // Get active activities
  const activeActivities = service.activities?.filter(activity => activity.is_active) || [];

  return (
    <div className="rounded-3xl overflow-hidden bg-[#0D1117]/40 backdrop-blur-[20px] border border-white/25 transition-all duration-500">
      {/* Service Header - Always Visible */}
      <div
        className="cursor-pointer transition-all duration-300 hover:bg-[#0D1117]/60"
        onClick={onToggle}
      >
        <div className={cn(
          'flex items-center gap-4',
          isMobile ? 'p-4' : 'p-6'
        )}>
          {/* Service Hero Image */}
          <div className={cn(
            'rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20',
            isMobile ? 'w-20 h-20' : 'w-24 h-24'
          )}>
            <img
              src={serviceImage}
              alt={service.service_title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Service Info */}
          <div className="flex-1 min-w-0" dir={textClasses.dir}>
            <h3 className={cn(
              'text-white font-heading mb-2',
              textClasses.className,
              isMobile ? 'text-xl' : 'text-2xl'
            )}>
              {service.service_title}
            </h3>

            {/* Age Range & Activity Count */}
            <div className="flex items-center gap-2 text-sm text-gray-300 flex-wrap">
              <span className="whitespace-nowrap">Ages 6-16</span> {/* This would come from aggregating activity age ranges */}
              <span className="text-gray-500">•</span>
              <span className="whitespace-nowrap">{activeActivities.length} programs</span>
            </div>
          </div>

          {/* Expand/Collapse Icon */}
          <div className="flex-shrink-0">
            {isExpanded ? (
              <ChevronUp className="w-6 h-6 text-gray-400 transition-transform duration-300" />
            ) : (
              <ChevronDown className="w-6 h-6 text-gray-400 transition-transform duration-300" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Activities Section */}
      {isExpanded && (
        <div className={cn(
          'border-t border-white/10 animate-in slide-in-from-top-2 duration-300',
          isMobile ? 'p-4 pt-6' : 'p-6 pt-8'
        )}>
          {activeActivities.length > 0 ? (
            <div className={cn(
              'grid gap-4',
              isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            )}>
              {activeActivities.map((activity, index) => (
                <ActivityCard
                  key={activity.id || index}
                  activity={activity}
                  business={business}
                  locale={locale}
                />
              ))}
            </div>
          ) : (
            // Empty state
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-white font-medium text-lg mb-2">
                {locale === 'he' ? 'תוכניות יתווספו בקרוב' : 'Programs Coming Soon'}
              </h4>
              <p className="text-gray-400 text-sm mb-4">
                {locale === 'he'
                  ? 'אנחנו עובדים על הוספת תוכניות חדשות לשירות זה'
                  : 'We\'re working on adding new programs for this service'
                }
              </p>
              <CTASection business={business} locale={locale} compactMode />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function RichAccordionServices({ business, services = [], className, locale = 'en', expandServiceId }: RichAccordionServicesProps) {
  const [expandedServices, setExpandedServices] = useState<Set<number>>(new Set());
  const { isMobile } = useMobileDetection();

  // Effect to handle external expand control
  useEffect(() => {
    if (expandServiceId) {
      setExpandedServices(new Set([expandServiceId]));
    }
  }, [expandServiceId]);

  // Listen for expand service events from hero badges
  useEffect(() => {
    const handleExpandService = (event: CustomEvent) => {
      const { serviceId } = event.detail;
      setExpandedServices(new Set([serviceId]));
    };

    window.addEventListener('expandService', handleExpandService as EventListener);
    return () => {
      window.removeEventListener('expandService', handleExpandService as EventListener);
    };
  }, []);

  // Only show active services
  const activeServices = services.filter(service => service.service_is_active);

  if (activeServices.length === 0) {
    return null;
  }

  const toggleService = (serviceId: number) => {
    const newExpanded = new Set(expandedServices);
    if (newExpanded.has(serviceId)) {
      newExpanded.delete(serviceId);
    } else {
      newExpanded.add(serviceId);
    }
    setExpandedServices(newExpanded);
  };

  return (
    <div className={cn('w-full space-y-4', className)} data-services-section>
      <div className="flex items-center justify-center gap-3 mb-8">
        <h2 className={cn(
          'text-white font-heading text-center',
          isMobile ? 'text-2xl' : 'text-3xl'
        )}>
          {locale === 'he' ? 'שירותים' : 'Services'}
        </h2>
        <svg
          className={cn(
            'text-white/60 animate-bounce',
            isMobile ? 'w-6 h-6' : 'w-8 h-8'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

      <div className="space-y-6">
        {activeServices.map((service) => (
          <ServiceCard
            key={service.service_id}
            service={service}
            business={business}
            isExpanded={expandedServices.has(service.service_id)}
            onToggle={() => toggleService(service.service_id)}
            locale={locale}
          />
        ))}
      </div>
    </div>
  );
}