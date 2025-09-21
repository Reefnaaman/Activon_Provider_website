'use client';

import { cn } from '@/lib/utils';
import { useMobileDetection } from '@/hooks/useMobileDetection';

interface ServiceBadgeProps {
  service: {
    title: string;
    type: 'service' | 'activity';
    serviceId?: number; // Optional service ID for targeted expansion
  };
  size?: 'sm' | 'md';
  className?: string;
}

// Simple universal icon for all services
function getServiceIcon(title: string): string {
  return '⭐'; // Universal star for all services - simple and consistent
}

export function ServiceBadge({ service, size = 'md', className }: ServiceBadgeProps) {
  const { isMobile } = useMobileDetection();

  const handleClick = () => {
    if (service.serviceId) {
      // If we have a specific service ID, scroll to services and expand that service
      const element = document.querySelector('[data-services-section]');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });

        // Trigger custom event to expand the specific service
        window.dispatchEvent(new CustomEvent('expandService', {
          detail: { serviceId: service.serviceId }
        }));
      }
    } else {
      // Fallback to general services section scroll - use mobile-specific ID on mobile
      const sectionId = isMobile ? 'mobile-services-section' : 'services-section';
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const icon = getServiceIcon(service.title);

  const sizeClasses = {
    sm: 'px-3 py-1.5 rounded-xl text-xs gap-1.5',
    md: 'px-4 py-2 rounded-2xl text-sm gap-2'
  };

  const iconSizeClasses = {
    sm: 'text-sm',
    md: 'text-base'
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex items-center justify-center font-ui tracking-wide backdrop-blur-[20px] transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer border',
        sizeClasses[size],
        service.type === 'service'
          ? "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 shadow-lg"
          : "bg-gradient-to-r from-[#2E6FF2]/20 to-[#5F8CFF]/20 border border-[#2E6FF2]/30 text-[#2E6FF2] hover:from-[#2E6FF2]/30 hover:to-[#5F8CFF]/30",
        className
      )}
    >
      <span className={cn('leading-none', iconSizeClasses[size])}>{icon}</span>
      <span className="font-medium">{service.title}</span>
    </button>
  );
}