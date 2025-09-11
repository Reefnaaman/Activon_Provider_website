export type NormalizedImage = {
  id: string;
  uri: string;
  order: number;
  mimeType?: string;
  uploadedAt?: string; // ISO
};

export type NormalizedEmail = {
  email: string;
  label?: string;
  isPrimary?: boolean;
};

export type NormalizedPhone = {
  number: string;        // raw string; digits-only helper provided
  type?: string;
  label?: string;
  isPrimary?: boolean;
  hasWhatsApp?: boolean;
};

export type NormalizedAddress = {
  line1?: string;        // e.g., street
  city?: string;
  region?: string;       // state
  country?: string;
  postalCode?: string;
  label?: string;
  type?: string;         // e.g., "hq"
  isPrimary?: boolean;
};

export type NormalizedSocialLink = {
  url: string;
  platform?: 'instagram' | 'facebook' | 'tiktok' | 'youtube' | 'linkedin' | string;
  isActive?: boolean;
};

export type NormalizedBusiness = {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  categoryName?: string | null;
  subcategoryName?: string | null;
  serviceCount: number;   // normalized number
  activityCount: number;  // normalized number

  // Media
  heroImage?: NormalizedImage | null;
  gallery: NormalizedImage[]; // sorted by order

  // Contact
  emails: NormalizedEmail[];
  phones: NormalizedPhone[];
  addresses: NormalizedAddress[];

  // Social
  socialLinks: NormalizedSocialLink[];

  // Raw (optional for debugging)
  _raw?: unknown;
};

// Raw API response types (as observed from the spec)
export type RawBusiness = {
  id: number;
  name: string;
  description?: string;
  media_object?: {
    profile?: {
      mainImageId?: string;
    };
    images?: Array<{
      id: string | number;
      uri: string;
      order?: number;
      mimeType?: string;
      uploadedAt?: string;
    }>;
  };
  contact_object?: {
    emails?: Array<{
      email?: string;
      address?: string; // alternative field name
      value?: string;   // alternative field name
      label?: string;
      isPrimary?: boolean;
    }>;
    phones?: Array<{
      number?: string;
      type?: string;
      label?: string;
      isPrimary?: boolean;
      hasWhatsApp?: boolean;
    }>;
    addresses?: Array<{
      street?: string;
      line1?: string;
      city?: string;
      state?: string;
      region?: string;
      country?: string;
      postalCode?: string;
      label?: string;
      type?: string;
      isPrimary?: boolean;
    }>;
  };
  social_media_object?: {
    links?: Array<{
      url: string;
      platform?: string;
      isActive?: boolean;
    }>;
  };
  ein?: string;
  is_active: boolean;
  category_id?: number | null;
  subcategory_id?: number | null;
  category_name?: string | null;
  subcategory_name?: string | null;
  service_count: string | number; // Can be string!
  activity_count: string | number; // Can be string!
};

export type BusinessApiResponse = {
  success: boolean;
  data: RawBusiness;
};

export type BusinessListApiResponse = {
  success: boolean;
  data: RawBusiness[];
};

// CTA types
export type CTAType = 'whatsapp' | 'call' | 'email' | 'none';

export type CTA = {
  label: string;
  href: string;
  type: CTAType;
  disabled?: boolean;
};

// Utility types
export type LocaleDirection = 'ltr' | 'rtl';
export type SupportedLocale = 'he' | 'en';