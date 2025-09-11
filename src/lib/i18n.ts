export type SupportedLocale = 'he' | 'en';

export const defaultLocale: SupportedLocale = 'he';

export const localeConfig = {
  he: {
    label: 'עברית',
    direction: 'rtl' as const,
  },
  en: {
    label: 'English',
    direction: 'ltr' as const,
  },
};

export const translations = {
  he: {
    // Hero & Business Info
    business: 'עסק',
    services: 'שירותים',
    activities: 'פעילויות',
    
    // CTA Labels
    'chat-whatsapp': 'שיחה בוואטסאפ',
    'call': 'התקשר',
    'email': 'שלח אימייל',
    'contact': 'צור קשר',
    
    // Section Titles
    'what-i-offer': 'מה אני מציע/ה',
    'photos': 'תמונות',
    'contact-location': 'יצירת קשר ומיקום',
    
    // Contact Labels
    'phone': 'טלפון',
    'email-label': 'אימייל',
    'address': 'כתובת',
    'whatsapp': 'וואטסאפ',
    'view-on-map': 'הצג במפה',
    'social-media': 'רשתות חברתיות',
    
    // Gallery
    'view-more-photos': 'הצג עוד תמונות',
    
    // Status Labels
    'new': 'חדש',
    'full': 'מלא',
    'waitlist': 'רשימת המתנה',
    'online': 'מקוון',
    'in-person': 'פרונטלי',
    'hybrid': 'היברידי',
    
    // General
    'coming-soon': 'פרטים נוספים יהיו זמינים בקרוב',
    'not-found': 'העסק לא נמצא',
    'back-to-directory': 'חזרה לרשימת העסקים',
    'business-directory': 'מדריך העסקים של אקטיבון',
    'discover-businesses': 'גלה עסקים ושירותים מדהימים',
    'no-businesses': 'לא נמצאו עסקים פעילים. אנא בדוק את הגדרות ה-API.',
  },
  en: {
    // Hero & Business Info
    business: 'Business',
    services: 'services',
    activities: 'activities',
    
    // CTA Labels
    'chat-whatsapp': 'Chat on WhatsApp',
    'call': 'Call',
    'email': 'Email',
    'contact': 'Contact',
    
    // Section Titles
    'what-i-offer': 'What I Offer',
    'photos': 'Photos',
    'contact-location': 'Contact & Location',
    
    // Contact Labels
    'phone': 'Phone',
    'email-label': 'Email',
    'address': 'Address',
    'whatsapp': 'WhatsApp',
    'view-on-map': 'View on Map',
    'social-media': 'Social Media',
    
    // Gallery
    'view-more-photos': 'View more photos',
    
    // Status Labels
    'new': 'New',
    'full': 'Full',
    'waitlist': 'Waitlist',
    'online': 'Online',
    'in-person': 'In-person',
    'hybrid': 'Hybrid',
    
    // General
    'coming-soon': 'Detailed information coming soon',
    'not-found': 'Business Not Found',
    'back-to-directory': 'Back to Directory',
    'business-directory': 'Activon Business Directory',
    'discover-businesses': 'Discover amazing businesses and services',
    'no-businesses': 'No active businesses found. Please check your API configuration.',
  },
} as const;

export function getDirection(locale: SupportedLocale): 'ltr' | 'rtl' {
  return localeConfig[locale].direction;
}

export function getTranslation(locale: SupportedLocale, key: keyof typeof translations.en): string {
  return translations[locale][key] || translations.en[key];
}

// Hook for client components
export function useTranslations(locale: SupportedLocale = defaultLocale) {
  return {
    t: (key: keyof typeof translations.en) => getTranslation(locale, key),
    direction: getDirection(locale),
    locale,
  };
}