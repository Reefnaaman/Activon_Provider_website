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

// Service and Activity types from API
export type ServiceMediaObject = {
  images?: Array<{
    id: string;
    uri: string;
    order: number;
    fileSize?: number;
    mimeType?: string;
    uploadedAt?: string;
  }>;
  videos?: Array<any>;
  gallery?: Array<any>;
  profile?: {
    mainImageId?: string;
    profileImageIds?: string[];
    profileVideoIds?: string[];
  };
};

export type ActivityPricingOption = {
  id: string;
  type: 'monthly' | 'weekly' | 'yearly' | 'one-time';
  price: number;
  isActive: boolean;
  isDefault: boolean;
  subscriptionDetails?: {
    autoRenew: boolean;
    billingCycle: string;
    lessonsPerCycle?: number;
  };
};

export type Activity = {
  id: number;
  title: string;
  description?: string;
  service_id: number;
  category_id?: number;
  subcategory_id?: number;
  is_active: boolean;
  is_mobile?: boolean;
  is_online?: boolean;
  max_capacity?: number;
  gender?: string | null;
  age_range?: {
    min: number;
    max: number;
  };
  tags?: {
    tags: string[];
  };
  color?: string;
  is_free_trial?: boolean;
  media_object?: ServiceMediaObject;
  pricing_object?: {
    notes?: string;
    options?: ActivityPricingOption[];
    currency?: string;
    discounts?: Array<any>;
    taxIncluded?: boolean;
  };
  locations_object?: any;
  instance_definition?: string;
};

export type Service = {
  service_id: number;
  service_title: string;
  service_description?: string;
  service_media_object?: ServiceMediaObject;
  service_is_active: boolean;
  service_category_id?: number;
  service_subcategory_id?: number;
  activity_count: string | number;
  activities: Activity[];
};

export type ServicesApiResponse = Service[];

// Utility types
export type LocaleDirection = 'ltr' | 'rtl';
export type SupportedLocale = 'he' | 'en';