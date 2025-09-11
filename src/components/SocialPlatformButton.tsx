'use client';

import { 
  Instagram, 
  Facebook, 
  Youtube, 
  Linkedin, 
  ExternalLink,
  MessageCircle,
  Twitter,
  Phone
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SocialPlatformButtonProps {
  platform: string;
  url: string;
  className?: string;
  locale?: 'he' | 'en';
}

interface PlatformConfig {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  brandColor: string;
  hoverColor: string;
  bgColor: string;
  borderColor: string;
  gradient?: string;
  isGradient?: boolean;
}

const platformConfigs: Record<string, PlatformConfig> = {
  instagram: {
    icon: Instagram,
    name: 'Instagram',
    brandColor: '#E4405F', // Fallback color
    hoverColor: '#C13584',
    bgColor: 'rgba(228, 64, 95, 0.08)',
    borderColor: 'rgba(228, 64, 95, 0.25)',
    gradient: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
    isGradient: true
  },
  facebook: {
    icon: Facebook,
    name: 'Facebook',
    brandColor: '#1877F2',
    hoverColor: '#166FE5',
    bgColor: 'rgba(24, 119, 242, 0.08)',
    borderColor: 'rgba(24, 119, 242, 0.25)'
  },
  whatsapp: {
    icon: MessageCircle,
    name: 'WhatsApp',
    brandColor: '#25D366',
    hoverColor: '#128C7E',
    bgColor: 'rgba(37, 211, 102, 0.08)',
    borderColor: 'rgba(37, 211, 102, 0.25)'
  },
  youtube: {
    icon: Youtube,
    name: 'YouTube',
    brandColor: '#FF0000',
    hoverColor: '#E50000',
    bgColor: 'rgba(255, 0, 0, 0.08)',
    borderColor: 'rgba(255, 0, 0, 0.25)'
  },
  linkedin: {
    icon: Linkedin,
    name: 'LinkedIn',
    brandColor: '#0A66C2',
    hoverColor: '#004182',
    bgColor: 'rgba(10, 102, 194, 0.08)',
    borderColor: 'rgba(10, 102, 194, 0.25)'
  },
  twitter: {
    icon: Twitter,
    name: 'Twitter',
    brandColor: '#1DA1F2',
    hoverColor: '#0C85D0',
    bgColor: 'rgba(29, 161, 242, 0.08)',
    borderColor: 'rgba(29, 161, 242, 0.25)'
  },
  tiktok: {
    icon: ExternalLink,
    name: 'TikTok',
    brandColor: '#000000',
    hoverColor: '#333333',
    bgColor: 'rgba(0, 0, 0, 0.08)',
    borderColor: 'rgba(0, 0, 0, 0.25)'
  },
  call: {
    icon: Phone,
    name: 'Call',
    brandColor: '#34C759',
    hoverColor: '#30D158',
    bgColor: 'rgba(52, 199, 89, 0.12)',
    borderColor: 'rgba(52, 199, 89, 0.3)',
    gradient: 'linear-gradient(135deg, #34C759 0%, #30D158 100%)',
    isGradient: true
  }
};

export function SocialPlatformButton({ platform, url, className, locale = 'en' }: SocialPlatformButtonProps) {
  const config = platformConfigs[platform.toLowerCase()] || {
    icon: ExternalLink,
    name: platform || 'Link',
    brandColor: '#6B7280',
    hoverColor: '#4B5563',
    bgColor: 'rgba(107, 114, 128, 0.08)',
    borderColor: 'rgba(107, 114, 128, 0.25)'
  };

  const Icon = config.icon;
  const isInstagram = platform.toLowerCase() === 'instagram';
  const isCall = platform.toLowerCase() === 'call';
  const hasGradient = isInstagram || isCall;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-ui transition-all duration-300 tracking-wide backdrop-blur-md hover:scale-105 hover:shadow-lg',
        locale === 'he' ? 'flex-row-reverse text-right' : 'text-left',
        hasGradient ? 'text-white' : '',
        className
      )}
      style={{
        background: hasGradient ? config.gradient : config.bgColor
      }}
    >
      <Icon className="h-4 w-4" />
      <span 
        className="text-sm tracking-wide transition-colors duration-300"
        style={{ color: hasGradient ? 'white' : config.brandColor }}
      >
        {config.name}
      </span>
    </a>
  );
}