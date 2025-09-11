'use client';

import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Instagram, 
  Facebook, 
  ExternalLink,
  Youtube,
  Linkedin,
  Copy,
  Check,
  Navigation
} from 'lucide-react';
import { useState } from 'react';
import { NormalizedBusiness } from '@/types/business';
import { shouldShowContactSection } from '@/lib/normalize';
import { telHref, mailto, waHref, pickMapQuery, formatAddress, hasCompleteAddress } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { SocialPlatformButton } from './SocialPlatformButton';
import { useMobileDetection } from '@/hooks/useMobileDetection';

interface ContactSectionProps {
  business: NormalizedBusiness;
  className?: string;
  locale?: 'he' | 'en';
}

function ContactItem({ 
  icon: Icon, 
  label, 
  value, 
  href, 
  secondary,
  allowCopy = false,
  onClick
}: { 
  icon: React.ComponentType<{ className?: string }>; 
  label: string;
  value: string;
  href?: string;
  secondary?: React.ReactNode;
  allowCopy?: boolean;
  onClick?: () => void;
}) {
  const { isMobile, isTouchDevice } = useMobileDetection();
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      // Haptic feedback
      if ('vibrate' in navigator && isTouchDevice) {
        navigator.vibrate(50);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleClick = () => {
    if (onClick) onClick();
    // Haptic feedback for touch devices
    if ('vibrate' in navigator && isTouchDevice) {
      navigator.vibrate(30);
    }
  };

  const content = (
    <div className={cn(
      "flex items-start gap-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/15 transition-all duration-300 touch-target active:scale-95",
      isMobile ? "p-4" : "p-4"
    )}>
      <Icon className={cn(
        "text-cyan-300 mt-0.5 flex-shrink-0",
        isMobile ? "h-5 w-5" : "h-5 w-5"
      )} />
      <div className="flex-grow min-w-0">
        <div className={cn(
          "text-[#AEB4C1] font-ui",
          isMobile ? "text-sm" : "text-sm"
        )}>{label}</div>
        <div className={cn(
          "text-white font-body",
          isMobile ? "text-base break-words" : "break-all"
        )}>{value}</div>
        {secondary && <div className="mt-1">{secondary}</div>}
      </div>
      
      {/* Copy button for mobile */}
      {allowCopy && isMobile && (
        <button
          onClick={handleCopy}
          className="touch-target-lg icy-glass rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 flex-shrink-0"
          aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-300" />
          ) : (
            <Copy className="h-4 w-4 text-white" />
          )}
        </button>
      )}
    </div>
  );

  if (href) {
    return (
      <a 
        href={href} 
        onClick={handleClick}
        className={cn(
          "block transition-all duration-200",
          isMobile ? "active:scale-95" : "hover:scale-105"
        )}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <div onClick={handleClick}>
      {content}
    </div>
  );
}

function SocialIcon({ platform }: { platform?: string }) {
  const icons = {
    instagram: Instagram,
    facebook: Facebook,
    youtube: Youtube,
    linkedin: Linkedin,
    tiktok: ExternalLink, // TikTok not in lucide-react
  };

  const Icon = platform ? icons[platform.toLowerCase() as keyof typeof icons] || ExternalLink : ExternalLink;
  return <Icon className="h-4 w-4" />;
}

export function ContactSection({ business, className, locale = 'en' }: ContactSectionProps) {
  const { isMobile } = useMobileDetection();
  
  if (!shouldShowContactSection(business)) {
    return null;
  }

  const strings = {
    he: {
      title: 'יצירת קשר ומיקום',
      phone: 'טלפון',
      email: 'אימייל',
      address: 'כתובת',
      whatsapp: 'וואטסאפ',
      viewOnMap: 'הצג במפה',
      socialMedia: 'רשתות חברתיות',
    },
    en: {
      title: 'Contact & Location',
      phone: 'Phone',
      email: 'Email',
      address: 'Address',
      whatsapp: 'WhatsApp',
      viewOnMap: 'View on Map',
      socialMedia: 'Social Media',
    },
  };

  const t = strings[locale];

  // Analytics tracking
  const handleContactClick = (type: string, platform?: string) => {
    if (typeof window !== 'undefined') {
      console.log('Contact clicked:', {
        type,
        platform,
        business_id: business.id,
        isMobile,
      });
    }
  };

  // Navigation helper for mobile
  const openInMaps = (address: any) => {
    const query = pickMapQuery(address);
    if (isMobile) {
      // Try native maps app first, fallback to Google Maps
      const mapsUrl = `maps://maps.google.com/maps?q=${query}`;
      const fallbackUrl = `https://maps.google.com/maps?q=${query}`;
      
      const link = document.createElement('a');
      link.href = mapsUrl;
      link.style.display = 'none';
      document.body.appendChild(link);
      
      setTimeout(() => {
        document.body.removeChild(link);
        window.open(fallbackUrl, '_blank');
      }, 500);
      
      link.click();
    } else {
      window.open(`https://maps.google.com/maps?q=${query}`, '_blank');
    }
  };

  return (
    <section className={cn('w-full', isMobile ? 'space-y-4' : 'space-y-6', className)}>
      <h2 className={cn(
        "font-heading text-white",
        isMobile ? "text-2xl" : "text-3xl md:text-4xl"
      )}>
        {t.title}
      </h2>

      <div className={cn(isMobile ? 'space-y-3' : 'space-y-3')}>
        {/* Phones */}
        {business.phones.map((phone, index) => (
          <div key={index} className="space-y-2">
            <ContactItem
              icon={Phone}
              label={phone.label || t.phone}
              value={phone.number}
              href={telHref(phone.number)}
              allowCopy={true}
              onClick={() => handleContactClick('phone', phone.number)}
            />
            {phone.hasWhatsApp && (
              <ContactItem
                icon={MessageCircle}
                label={t.whatsapp}
                value={phone.number}
                href={waHref(phone.number)}
                allowCopy={false} // WhatsApp handles its own copy
                onClick={() => handleContactClick('whatsapp', phone.number)}
              />
            )}
          </div>
        ))}

        {/* Emails */}
        {business.emails.map((email, index) => (
          <ContactItem
            key={index}
            icon={Mail}
            label={email.label || t.email}
            value={email.email}
            href={mailto(email.email)}
            allowCopy={true}
            onClick={() => handleContactClick('email', email.email)}
          />
        ))}

        {/* Addresses */}
        {business.addresses.map((address, index) => (
          <div key={index} className="space-y-2">
            <ContactItem
              icon={MapPin}
              label={address.label || t.address}
              value={formatAddress(address)}
              href={undefined} // Handle manually for mobile optimization
              allowCopy={true}
              onClick={() => {
                handleContactClick('address', formatAddress(address));
                if (hasCompleteAddress(address)) {
                  openInMaps(address);
                }
              }}
              secondary={
                hasCompleteAddress(address) ? (
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openInMaps(address);
                      }}
                      className={cn(
                        "inline-flex items-center gap-2 px-3 py-1.5 icy-glass rounded-lg text-white text-sm font-medium transition-all duration-200 hover:scale-105 touch-target active:scale-95"
                      )}
                    >
                      <Navigation className="h-4 w-4" />
                      {t.viewOnMap}
                    </button>
                  </div>
                ) : null
              }
            />
          </div>
        ))}
      </div>

      {/* Social Media */}
      {business.socialLinks.length > 0 && (
        <div className={cn(isMobile ? 'space-y-3' : 'space-y-3')}>
          <h3 className={cn(
            "font-medium text-white",
            isMobile ? "text-lg" : "text-lg"
          )}>
            {t.socialMedia}
          </h3>
          
          <div className={cn(
            "gap-3",
            isMobile 
              ? "flex overflow-x-auto mobile-scroll pb-2" 
              : "grid grid-cols-1 sm:grid-cols-2"
          )}>
            {business.socialLinks.map((social, index) => (
              <SocialPlatformButton
                key={index}
                platform={social.platform || 'link'}
                url={social.url}
                className={cn(
                  isMobile 
                    ? "flex-shrink-0 w-48 scroll-snap-start" 
                    : "w-full"
                )}
                locale={locale}
                onClick={() => handleContactClick('social', social.platform)}
              />
            ))}
          </div>
          
          {/* Mobile scroll hint */}
          {isMobile && business.socialLinks.length > 2 && (
            <div className="text-center">
              <p className="text-white/60 text-xs font-ui">
                Scroll to see all social links →
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}