import {
  RawBusiness,
  NormalizedBusiness,
  NormalizedImage,
  NormalizedEmail,
  NormalizedPhone,
  NormalizedAddress,
  NormalizedSocialLink,
  CTA,
  CTAType,
} from '@/types/business';
import { toNumber, digitsOnly, telHref, mailto, waHref } from './utils';

export function normalizeBusiness(raw: RawBusiness): NormalizedBusiness {
  // Normalize images
  const images: NormalizedImage[] = Array.isArray(raw?.media_object?.images)
    ? raw.media_object.images.map((i: any) => ({
        id: String(i.id ?? ''),
        uri: String(i.uri ?? ''),
        order: Number.isFinite(i.order) ? i.order : 0,
        mimeType: i.mimeType,
        uploadedAt: i.uploadedAt
      }))
    : [];

  images.sort((a, b) => a.order - b.order);

  // Find hero image
  const mainId = raw?.media_object?.profile?.mainImageId;
  const heroImage = images.find(i => i.id === mainId) || images[0] || null;

  // Normalize emails
  const toEmail = (e: any): NormalizedEmail | null => {
    const val = e?.email ?? e?.address ?? e?.value;
    return val ? {
      email: String(val),
      label: e?.label,
      isPrimary: !!e?.isPrimary
    } : null;
  };

  const emails: NormalizedEmail[] = Array.isArray(raw?.contact_object?.emails)
    ? raw.contact_object.emails.map(toEmail).filter(Boolean) as NormalizedEmail[]
    : [];

  // Normalize phones
  const phones: NormalizedPhone[] = Array.isArray(raw?.contact_object?.phones)
    ? raw.contact_object.phones.map((p: any) => ({
        number: String(p?.number ?? '').trim(),
        type: p?.type ?? undefined,
        label: p?.label ?? undefined,
        isPrimary: !!p?.isPrimary,
        hasWhatsApp: !!p?.hasWhatsApp
      }))
    : [];

  // Normalize addresses
  const addresses: NormalizedAddress[] = Array.isArray(raw?.contact_object?.addresses)
    ? raw.contact_object.addresses.map((a: any) => ({
        line1: a?.street || a?.line1 || undefined,
        city: a?.city || undefined,
        region: a?.state || a?.region || undefined,
        country: a?.country || undefined,
        postalCode: a?.postalCode || undefined,
        label: a?.label || undefined,
        type: a?.type || undefined,
        isPrimary: !!a?.isPrimary
      }))
    : [];

  // Normalize social links
  const socialLinks: NormalizedSocialLink[] = Array.isArray(raw?.social_media_object?.links)
    ? raw.social_media_object.links
        .filter((l: any) => !!l?.url)
        .map((l: any) => ({
          url: String(l.url),
          platform: l.platform,
          isActive: !!l.isActive
        }))
    : [];

  return {
    id: Number(raw?.id),
    name: String(raw?.name ?? '').trim(),
    description: raw?.description ? String(raw.description) : undefined,
    isActive: !!raw?.is_active,
    categoryName: raw?.category_name ?? null,
    subcategoryName: raw?.subcategory_name ?? null,
    serviceCount: toNumber(raw?.service_count),
    activityCount: toNumber(raw?.activity_count),
    heroImage,
    gallery: images,
    emails,
    phones,
    addresses,
    socialLinks,
    _raw: raw
  };
}

export function pickCTA(business: NormalizedBusiness): CTA {
  // Sort phones by primary status
  const primaryPhone = business.phones
    .slice()
    .sort((a, b) => Number(b.isPrimary || false) - Number(a.isPrimary || false))[0];

  // Priority: WhatsApp > Call > Email > None
  if (primaryPhone?.hasWhatsApp && primaryPhone?.number) {
    return {
      label: 'WhatsApp',
      href: waHref(primaryPhone.number),
      type: 'whatsapp'
    };
  }

  if (primaryPhone?.number) {
    return {
      label: 'Call',
      href: telHref(primaryPhone.number),
      type: 'call'
    };
  }

  const primaryEmail = business.emails.find(e => e.isPrimary) || business.emails[0];
  if (primaryEmail?.email) {
    return {
      label: 'Email',
      href: mailto(primaryEmail.email),
      type: 'email'
    };
  }

  return {
    label: 'Contact',
    href: '#',
    type: 'none',
    disabled: true
  };
}

export function pickSecondaryCTA(business: NormalizedBusiness, primaryType: CTAType): CTA | null {
  const primaryPhone = business.phones
    .slice()
    .sort((a, b) => Number(b.isPrimary || false) - Number(a.isPrimary || false))[0];
  const primaryEmail = business.emails.find(e => e.isPrimary) || business.emails[0];

  // If primary is WhatsApp and we have phone, show Call as secondary
  if (primaryType === 'whatsapp' && primaryPhone?.number) {
    return {
      label: 'Call',
      href: telHref(primaryPhone.number),
      type: 'call'
    };
  }

  // If primary is Call and we have email, show Email as secondary
  if (primaryType === 'call' && primaryEmail?.email) {
    return {
      label: 'Email',
      href: mailto(primaryEmail.email),
      type: 'email'
    };
  }

  return null;
}

// Helper to check if a section should be visible
export function shouldShowServicesSection(business: NormalizedBusiness): boolean {
  return business.serviceCount > 0 || business.activityCount > 0;
}

export function shouldShowGallery(business: NormalizedBusiness): boolean {
  return business.gallery.length > 0;
}

export function shouldShowContactSection(business: NormalizedBusiness): boolean {
  return business.phones.length > 0 || 
         business.emails.length > 0 || 
         business.addresses.length > 0 ||
         business.socialLinks.length > 0;
}