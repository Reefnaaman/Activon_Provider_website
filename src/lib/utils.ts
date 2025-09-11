import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility functions as specified in the technical spec
export const truncate = (s?: string, n = 400) =>
  s ? (s.length > n ? s.slice(0, n - 1) + '…' : s) : '';

export const initials = (s?: string) =>
  (s || '')
    .trim()
    .split(/\s+/)
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

export const digitsOnly = (s: string) => s.replace(/\D+/g, '');

export const telHref = (num: string) => `tel:${num.replace(/\s+/g, '')}`;

export const mailto = (email: string) => `mailto:${email}`;

export const waHref = (num: string) => `https://wa.me/${digitsOnly(num)}`;

export const pickMapQuery = (a?: {
  line1?: string;
  city?: string;
  region?: string;
  country?: string;
}) => {
  if (!a) return '';
  const parts = [a.line1, a.city, a.region, a.country].filter(Boolean);
  return encodeURIComponent(parts.join(', '));
};

export const formatAddress = (a?: {
  line1?: string;
  city?: string;
  region?: string;
  country?: string;
  postalCode?: string;
}) => {
  if (!a) return '';
  const parts = [a.line1, a.city, a.region, a.country, a.postalCode]
    .filter(Boolean);
  return parts.join(', ');
};

// Helper to check if we have enough address info for map linking
export const hasCompleteAddress = (a?: {
  line1?: string;
  city?: string;
}) => {
  return !!(a?.line1 && a?.city);
};

// Normalize phone number to international format (basic implementation)
export const normalizePhoneToInternational = (phone: string, countryCode = '+972') => {
  const digits = digitsOnly(phone);
  if (digits.startsWith('0')) {
    return `${countryCode}${digits.slice(1)}`;
  }
  if (!digits.startsWith(countryCode.slice(1))) {
    return `${countryCode}${digits}`;
  }
  return `+${digits}`;
};

// Safe number conversion (handles string inputs from API)
export const toNumber = (x: any): number => {
  const n = typeof x === 'string' ? parseInt(x, 10) : x;
  return Number.isFinite(n) ? n : 0;
};

// Pluralization helper
export const pluralize = (count: number, singular: string, plural?: string) => {
  const word = count === 1 ? singular : (plural || `${singular}s`);
  return `${count} ${word}`;
};

// Service and Activity Templates (matching ServicesSection)
export const getServiceTemplates = () => [
  { title: 'Monthly Orange Picking', description: 'Fresh seasonal oranges picked monthly from our organic groves', price: 'From $25' },
  { title: 'Home Garden Consultation', description: 'Expert advice on setting up your perfect home garden', price: 'From $75' },
  { title: 'Organic Produce Delivery', description: 'Weekly delivery of fresh, locally grown organic vegetables', price: 'Weekly' },
  { title: 'Seasonal Fruit Boxes', description: 'Curated selection of the finest seasonal fruits', price: 'Monthly' },
  { title: 'Garden Design Service', description: 'Professional garden planning and landscape design', price: 'Quote' },
  { title: 'Plant Care Workshop', description: 'Learn essential plant care and gardening techniques', price: 'Group rates' }
];

export const getActivityTemplates = () => [
  { title: 'Weekly Nature Walk', description: 'Guided nature walks exploring local flora and wildlife', duration: '2 hours' },
  { title: 'Family Farm Tours', description: 'Educational tours of our organic farm for the whole family', duration: '3 hours' },
  { title: 'Kids Gardening Club', description: 'Hands-on gardening activities for children ages 5-12', duration: '1.5 hours' },
  { title: 'Harvest Festival', description: 'Seasonal celebration with picking, tasting, and activities', duration: 'Full day' }
];

// Get service names for a business (based on count)
export const getBusinessServices = (serviceCount: number, activityCount: number) => {
  const services = [];
  const serviceTemplates = getServiceTemplates();
  const activityTemplates = getActivityTemplates();
  
  // Add services
  for (let i = 0; i < Math.min(serviceCount, serviceTemplates.length); i++) {
    services.push({
      ...serviceTemplates[i],
      type: 'service' as const
    });
  }
  
  // Add activities
  for (let i = 0; i < Math.min(activityCount, activityTemplates.length); i++) {
    services.push({
      ...activityTemplates[i],
      type: 'activity' as const
    });
  }
  
  return services;
};

// RTL/LTR Language Support
export function detectLanguage(text: string): 'he' | 'en' {
  // Hebrew unicode range: \u0590-\u05FF
  const hebrewRegex = /[\u0590-\u05FF]/;
  return hebrewRegex.test(text) ? 'he' : 'en';
}

export function isRTL(locale: 'he' | 'en' | string): boolean {
  return locale === 'he';
}

export function getDirectionalClasses(locale: 'he' | 'en' | string, type: 'text' | 'flex' | 'container' = 'text') {
  const rtl = isRTL(locale);
  
  switch (type) {
    case 'text':
      return {
        dir: rtl ? 'rtl' : 'ltr',
        textAlign: rtl ? 'text-right' : 'text-left',
        className: rtl ? 'text-right' : 'text-left'
      };
    
    case 'flex':
      return {
        dir: rtl ? 'rtl' : 'ltr',
        flexDirection: rtl ? 'flex-row-reverse' : 'flex-row',
        className: rtl ? 'flex-row-reverse' : 'flex-row'
      };
    
    case 'container':
      return {
        dir: rtl ? 'rtl' : 'ltr',
        className: cn(
          rtl ? 'space-x-reverse' : '',
          rtl ? 'text-right' : 'text-left'
        )
      };
    
    default:
      return { dir: rtl ? 'rtl' : 'ltr' };
  }
}

export function getLanguageSpecificClasses(locale: 'he' | 'en' | string) {
  const rtl = isRTL(locale);
  
  return {
    // Text direction and alignment
    textDir: rtl ? 'rtl' : 'ltr',
    textAlign: rtl ? 'text-right' : 'text-left',
    
    // Flexbox direction
    flexRow: rtl ? 'flex-row-reverse' : 'flex-row',
    flexCol: 'flex-col', // Column direction doesn't change
    
    // Spacing
    spaceX: rtl ? 'space-x-reverse' : '',
    
    // Margins and padding classes
    ml: (size: string) => rtl ? `mr-${size}` : `ml-${size}`,
    mr: (size: string) => rtl ? `ml-${size}` : `mr-${size}`,
    pl: (size: string) => rtl ? `pr-${size}` : `pl-${size}`,
    pr: (size: string) => rtl ? `pl-${size}` : `pr-${size}`,
    
    // Positioning classes
    left: (size: string) => rtl ? `right-${size}` : `left-${size}`,
    right: (size: string) => rtl ? `left-${size}` : `right-${size}`,
    
    // Border classes  
    borderLeft: rtl ? 'border-r' : 'border-l',
    borderRight: rtl ? 'border-l' : 'border-r',
    
    // Rounded corners
    roundedLeft: rtl ? 'rounded-r' : 'rounded-l',
    roundedRight: rtl ? 'rounded-l' : 'rounded-r',
  };
}

/**
 * ACTIVON DIRECTIONAL STYLING LAW
 * Universal rules for icon, logo, and arrow positioning
 */
export function getIconPositioning(locale: 'he' | 'en' | string, type: 'leading' | 'trailing' = 'trailing') {
  const rtl = isRTL(locale);
  
  // RULE: Icons/arrows follow reading direction
  // - English (LTR): trailing icons go RIGHT, leading icons go LEFT
  // - Hebrew (RTL): trailing icons go LEFT, leading icons go RIGHT
  
  if (type === 'trailing') {
    // Trailing icons (arrows, external link icons, etc.)
    return {
      flexClass: rtl ? 'flex-row-reverse' : 'flex-row',
      position: rtl ? 'left' : 'right',
      description: `Icon appears on the ${rtl ? 'left' : 'right'} side for ${locale.toUpperCase()} text`
    };
  } else {
    // Leading icons (logos, brand icons, etc.)
    return {
      flexClass: rtl ? 'flex-row' : 'flex-row',  
      position: rtl ? 'right' : 'left',
      description: `Icon appears on the ${rtl ? 'right' : 'left'} side for ${locale.toUpperCase()} text`
    };
  }
}