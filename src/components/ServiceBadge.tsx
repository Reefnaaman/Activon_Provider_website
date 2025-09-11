'use client';

import { cn } from '@/lib/utils';

interface ServiceBadgeProps {
  service: {
    title: string;
    type: 'service' | 'activity';
  };
  size?: 'sm' | 'md';
  className?: string;
}

export function ServiceBadge({ service, size = 'md', className }: ServiceBadgeProps) {
  const handleClick = () => {
    const element = document.getElementById('services-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 rounded-xl text-xs',
    md: 'px-4 py-2 rounded-2xl text-sm'
  };

  return (
    <button 
      onClick={handleClick}
      className={cn(
        sizeClasses[size],
        "font-ui tracking-wide backdrop-blur-md transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer",
        service.type === 'service' 
          ? "bg-gradient-to-r from-[#FEC46C]/20 to-[#F28E35]/20 border border-[#F28E35]/30 text-[#FEC46C] hover:from-[#FEC46C]/30 hover:to-[#F28E35]/30"
          : "bg-gradient-to-r from-[#2E6FF2]/20 to-[#5F8CFF]/20 border border-[#2E6FF2]/30 text-[#2E6FF2] hover:from-[#2E6FF2]/30 hover:to-[#5F8CFF]/30",
        className
      )}
    >
      {service.title}
    </button>
  );
}