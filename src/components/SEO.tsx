import { Metadata } from 'next';
import { NormalizedBusiness } from '@/types/business';
import { truncate, normalizePhoneToInternational } from '@/lib/utils';

interface SEOProps {
  business: NormalizedBusiness;
}

export function generateMetadata(business: NormalizedBusiness): Metadata {
  const title = `${business.name} • Activon`;
  const description = truncate(business.description, 155) || `${business.name} on Activon`;
  const ogImage = business.heroImage?.uri;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage, alt: business.name }] : [],
      type: 'website',
      siteName: 'Activon',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export function generateLocalBusinessLD(business: NormalizedBusiness) {
  // Only generate if we have sufficient data
  if (!business.name) return null;

  const primaryPhone = business.phones.find(p => p.isPrimary) || business.phones[0];
  const primaryEmail = business.emails.find(e => e.isPrimary) || business.emails[0];
  const primaryAddress = business.addresses.find(a => a.isPrimary) || business.addresses[0];
  
  // Require at least one contact method or address
  if (!primaryPhone && !primaryEmail && !primaryAddress) return null;

  const structuredData: any = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    description: business.description,
  };

  if (primaryPhone) {
    structuredData.telephone = normalizePhoneToInternational(primaryPhone.number);
  }

  if (primaryEmail) {
    structuredData.email = primaryEmail.email;
  }

  if (primaryAddress && (primaryAddress.city || primaryAddress.line1)) {
    structuredData.address = {
      '@type': 'PostalAddress',
      streetAddress: primaryAddress.line1,
      addressLocality: primaryAddress.city,
      addressRegion: primaryAddress.region,
      postalCode: primaryAddress.postalCode,
      addressCountry: primaryAddress.country,
    };
  }

  // Add social media links
  if (business.socialLinks.length > 0) {
    structuredData.sameAs = business.socialLinks
      .filter(link => link.isActive !== false)
      .map(link => link.url);
  }

  // Add image if available
  if (business.heroImage?.uri) {
    structuredData.image = business.heroImage.uri;
  }

  return structuredData;
}

export function StructuredDataScript({ business }: SEOProps) {
  const structuredData = generateLocalBusinessLD(business);
  
  if (!structuredData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  );
}