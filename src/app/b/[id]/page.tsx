import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { fetchBusiness, fetchBusinessServices } from '@/lib/api';
import { normalizeBusiness } from '@/lib/normalize';
import { generateMetadata as generateBusinessMetadata, StructuredDataScript } from '@/components/SEO';
import { Hero } from '@/components/Hero';
import { CTASection } from '@/components/CTASection';
import { ServicesSection } from '@/components/ServicesSection';
import { Gallery } from '@/components/Gallery';
import { ContactSection } from '@/components/ContactSection';
import { SocialPlatformButton } from '@/components/SocialPlatformButton';
import { ServiceBadge } from '@/components/ServiceBadge';
import { detectLanguage, getDirectionalClasses, getLanguageSpecificClasses, pluralize, getBusinessServices, cn } from '@/lib/utils';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { BusinessNavbar } from '@/components/BusinessNavbar';
import { MobileHero } from '@/components/mobile/MobileHero';
import { Service } from '@/types/business';
import { MobileStickyBar } from '@/components/mobile/MobileStickyBar';

interface BusinessPageProps {
  params: { id: string };
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const businessId = parseInt(resolvedParams.id);
    if (isNaN(businessId)) {
      return { title: 'Business Not Found • Activon' };
    }

    const response = await fetchBusiness(businessId);
    if (!response.success || !response.data.is_active) {
      return { title: 'Business Not Found • Activon' };
    }

    const business = normalizeBusiness(response.data);
    return generateBusinessMetadata(business);
  } catch (error) {
    return { title: 'Business Not Found • Activon' };
  }
}

export default async function BusinessPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  try {
    const resolvedParams = await params;
    const resolvedSearchParams = searchParams ? await searchParams : {};
    const businessId = parseInt(resolvedParams.id);
    if (isNaN(businessId)) {
      notFound();
    }

    const response = await fetchBusiness(businessId);
    
    if (!response.success || !response.data.is_active) {
      notFound();
    }

    const business = normalizeBusiness(response.data);
    
    // Fetch real services data for this business
    let services: Service[] = [];
    try {
      services = await fetchBusinessServices(businessId);
    } catch (error) {
      console.error('Failed to fetch services:', error);
      // Continue without services if fetch fails
    }
    
    // Detect language from business name for RTL/LTR support
    let businessLocale = detectLanguage(business.name);
    
    // Allow forcing RTL mode via URL parameter for testing
    if (resolvedSearchParams?.rtl === 'true') {
      businessLocale = 'he';
    }
    
    const textClasses = getDirectionalClasses(businessLocale, 'text');
    const flexClasses = getDirectionalClasses(businessLocale, 'flex');
    const containerClasses = getDirectionalClasses(businessLocale, 'container');
    const langClasses = getLanguageSpecificClasses(businessLocale);
    
    // Create service badges from real services data
    const serviceBadges = [];
    
    // Add service badges
    services.forEach(service => {
      if (service.service_is_active) {
        serviceBadges.push({
          title: service.service_title,
          type: 'service' as const
        });
        
        // Add activity badges from this service
        if (service.activities) {
          service.activities.forEach(activity => {
            if (activity.is_active) {
              serviceBadges.push({
                title: activity.title,
                type: 'activity' as const
              });
            }
          });
        }
      }
    });
    
    // Fallback to generic badges if no services data
    if (serviceBadges.length === 0 && (business.serviceCount > 0 || business.activityCount > 0)) {
      if (business.serviceCount > 0) {
        serviceBadges.push({
          title: `${business.serviceCount} ${business.serviceCount === 1 ? 'Service' : 'Services'}`,
          type: 'service' as const
        });
      }
      if (business.activityCount > 0) {
        serviceBadges.push({
          title: `${business.activityCount} ${business.activityCount === 1 ? 'Activity' : 'Activities'}`,
          type: 'activity' as const
        });
      }
    }

    return (
      <>
        <StructuredDataScript business={business} />
        
        {/* First Section: Full-Screen Gallery Background with Curved Overlays */}
        <section className="h-screen relative overflow-hidden" dir={containerClasses.dir}>
          {/* Background Gallery */}
          <div className="absolute inset-0">
            <Gallery business={business} backgroundMode />
          </div>
          
          {/* Sophisticated ICY Navbar */}
          <BusinessNavbar 
            businessLocale={businessLocale} 
            hasServices={business.serviceCount > 0}
            businessName={business.name.length > 20 ? business.name.substring(0, 20) + '...' : business.name}
          />

          {/* Desktop Layout: Business Info Shape - ONLY ON DESKTOP */}
          <div className={cn(
            "absolute top-1/2 -translate-y-3/4 z-20 hidden lg:block",
            businessLocale === 'he' ? 'right-0' : 'left-0'
          )}>
            <div className={cn(
              "bg-[#0D1117]/80 backdrop-blur-md border border-white/10 p-8 shadow-2xl max-w-4xl min-h-[320px] flex flex-col justify-center",
              businessLocale === 'he' ? 'rounded-l-[4rem]' : 'rounded-r-[4rem]'
            )} dir={textClasses.dir}>
              <h1 className={cn(
                "text-4xl font-display icy-text mb-6 tracking-tight",
                textClasses.className
              )}>
                {business.name}
              </h1>
              {business.description && (
                <p className={cn(
                  "icy-text/80 font-body mb-8 leading-relaxed text-lg",
                  textClasses.className
                )}>
                  {business.description.length > 200 ? business.description.substring(0, 200) + '...' : business.description}
                </p>
              )}
              
              {/* Meta Information */}
              <div className={cn(
                "flex flex-wrap gap-3 mb-8",
                businessLocale === 'he' ? 'justify-end' : 'justify-start'
              )}>
                {business.categoryName && (
                  <span className="icy-blue px-4 py-2 rounded-2xl text-white text-sm font-ui tracking-wide">
                    {business.categoryName}
                  </span>
                )}
                {serviceBadges.map((service, index) => (
                  <ServiceBadge
                    key={`service-${index}`}
                    service={service}
                    size="md"
                  />
                ))}
              </div>

            </div>
          </div>

          {/* Desktop Layout: Contact Buttons Shape - ONLY ON DESKTOP */}
          <div className={cn(
            "absolute top-1/2 -translate-y-16 z-20 hidden lg:block",
            businessLocale === 'he' ? 'left-0' : 'right-0'
          )}>
            <div className={cn(
              "bg-[#0D1117]/80 backdrop-blur-md border border-white/10 p-8 shadow-2xl min-h-[320px] flex flex-col justify-center",
              businessLocale === 'he' ? 'rounded-r-[4rem]' : 'rounded-l-[4rem]'
            )} dir={textClasses.dir}>
              <h3 className={cn(
                "text-2xl font-heading icy-text mb-6 tracking-tight text-center",
                textClasses.className
              )}>
                {businessLocale === 'he' ? 'צרו קשר' : 'Get In Touch'}
              </h3>
              {/* Mixed CTA and Social Links with Instagram prioritized */}
              <div className="flex flex-col gap-3">
                {/* Instagram First (if available) */}
                {business.socialLinks.filter(social => social.platform?.toLowerCase() === 'instagram').map((social, index) => (
                  <SocialPlatformButton
                    key={`instagram-${index}`}
                    platform={social.platform || 'link'}
                    url={social.url}
                    className="w-full px-6 py-3 text-sm"
                    locale={businessLocale}
                  />
                ))}
                
                {/* CTA Buttons */}
                <CTASection business={business} compactMode locale={businessLocale} />
                
                {/* Other Social Links (excluding Instagram) */}
                {business.socialLinks.filter(social => social.platform?.toLowerCase() !== 'instagram').length > 0 && (
                  <div className="flex flex-col gap-3">
                    {business.socialLinks.filter(social => social.platform?.toLowerCase() !== 'instagram').map((social, index) => (
                      <SocialPlatformButton
                        key={`other-${index}`}
                        platform={social.platform || 'link'}
                        url={social.url}
                        className="w-full px-6 py-3 text-sm"
                        locale={businessLocale}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* New Mobile Hero Component */}
          <MobileHero business={business} locale={businessLocale} serviceBadges={serviceBadges} />
          
          {/* Desktop Only: Section Peek - Visual hint that there's content below */}
          {serviceBadges.length > 0 && (
            <div className="hidden lg:block absolute bottom-0 left-0 right-0 h-40 overflow-hidden pointer-events-none z-20">
              <div className="absolute bottom-0 left-[16%] w-1/2 h-40 rounded-t-[200px] transform translate-y-12 flex justify-center overflow-hidden bg-[#0D1117]/80 backdrop-blur-md border border-white/10">
                {/* Background image removed to match hero card styling */}
                <div className="text-white font-heading text-4xl tracking-wide absolute top-10 flex items-center gap-3 flex-row z-10">
                  <span>{businessLocale === 'he' ? 'השירותים שלנו' : 'Our Services'}</span>
                  <svg 
                    className="w-6 h-6 text-white/70 animate-bounce" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>
            </div>
          )}
          
        </section>

        {/* Services Section - Desktop and Mobile Layouts */}
        {business.serviceCount > 0 && (
          <>
            {/* Desktop Services Section */}
            <section id="services-section" className="hidden lg:block min-h-screen relative px-6 overflow-hidden">
              {/* Synchronized Gallery Background with Vertical Mirror */}
              <div className="absolute inset-0">
                <Gallery business={business} backgroundMode syncedMirror />
              </div>
              <div className="absolute inset-0 bg-[#0D1117]/80"></div>
              <div className="relative z-10 max-w-7xl mx-auto py-16">
                <ServicesSection business={business} services={services} showcaseMode />
              </div>
              
              {/* Desktop Only: Section Peek - Visual hint of next section */}
              <div className="absolute bottom-0 left-0 right-0 h-40 overflow-hidden pointer-events-none z-20">
                <div className="absolute bottom-0 right-[16%] w-1/2 h-40 bg-[#F5F5F7]/80 rounded-t-[200px] transform translate-y-12 flex justify-center">
                  <div className="text-gray-900 font-heading text-4xl tracking-wide absolute top-10 flex items-center gap-3" dir="ltr">
                    <span>{businessLocale === 'he' ? 'מצאו אותנו כאן' : 'Find Us Here'}</span>
                    <svg 
                      className="w-6 h-6 text-gray-500 animate-bounce" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                </div>
              </div>
            </section>

            {/* Mobile Services Section - Solid Background */}
            <section className="lg:hidden relative py-16 mt-16 overflow-hidden min-h-[400px]">
              {/* Solid dark background */}
              <div className="absolute inset-0 bg-[#0D1117]"></div>
              
              {/* Content container - Always on top */}
              <div className="relative z-20 px-4">
                <h2 className={cn(
                  "text-2xl font-heading text-white mb-6",
                  businessLocale === 'he' ? 'text-right' : 'text-center'
                )}>
                  {businessLocale === 'he' ? 'השירותים שלנו' : 'Our Services'}
                </h2>
                <div className="bg-white/8 backdrop-blur-[20px] border border-white/25 rounded-4xl p-6 shadow-2xl overflow-hidden">
                  <div className="relative z-10">
                    <ServicesSection business={business} services={services} />
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Desktop Contact Section */}
        <section id="contact-section" className="hidden lg:flex min-h-screen relative py-16 px-6 items-center justify-center overflow-hidden">
          {/* Synchronized Gallery Background - Normal Direction (like 1st section) */}
          <div className="absolute inset-0">
            <Gallery business={business} backgroundMode />
          </div>
          {/* Background with gradient - bright grey like Apple */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#F5F5F7]/80 via-[#F5F5F7]/80 to-[#E8E8ED]/80"></div>
          <div className="relative z-10 max-w-6xl mx-auto w-full pt-8">

            {/* Map Preview */}
            {business.addresses.length > 0 && (
              <div className="bg-[#0D1117] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <div className="aspect-[16/9] bg-gradient-to-br from-[#2E6FF2]/20 to-[#5F8CFF]/20 relative">
                  {/* Google Maps Embed */}
                  {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
                    <iframe
                      src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(
                        `${business.addresses[0].line1 || ''} ${business.addresses[0].city || ''} ${business.addresses[0].country || ''}`
                      )}`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-t-3xl"
                    ></iframe>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2E6FF2]/20 to-[#5F8CFF]/20">
                      <div className="text-center text-white">
                        <div className="text-4xl mb-4">🗺️</div>
                        <p className="font-body">Map Preview</p>
                        <p className="text-sm text-white/60 mt-2">Configure Google Maps API key to show interactive map</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Address Info Overlay */}
                <div className="p-8 bg-white/5 backdrop-blur-md">
                  <div className={cn(
                    "flex items-start",
                    businessLocale === 'he' ? 'justify-between flex-row-reverse' : 'justify-between'
                  )}>
                    {/* Map Buttons - Left side */}
                    <div className="flex gap-3">
                      {/* Google Maps */}
                      <a
                        href={`https://maps.google.com/maps?q=${encodeURIComponent(
                          `${business.addresses[0].line1 || ''} ${business.addresses[0].city || ''} ${business.addresses[0].country || ''}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-105"
                        title="Open in Google Maps"
                      >
                        <img 
                          src="/icons/Google_maps.svg.png" 
                          className="w-full h-full p-2 object-contain" 
                          alt="Google Maps"
                        />
                      </a>
                      
                      {/* Waze */}
                      <a
                        href={`https://waze.com/ul?q=${encodeURIComponent(
                          `${business.addresses[0].line1 || ''} ${business.addresses[0].city || ''} ${business.addresses[0].country || ''}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-105"
                        title="Open in Waze"
                      >
                        <img 
                          src="/icons/Waze.png" 
                          className="w-full h-full p-2 object-contain rounded-md" 
                          alt="Waze"
                        />
                      </a>
                    </div>
                    {/* Title and Address - Right side */}
                    <div className="flex flex-col items-end">
                      <h4 className="font-heading text-white text-lg mb-2 text-right">
                        {business.name}
                      </h4>
                      <p className="text-[#AEB4C1] font-body text-sm text-left">
                        {business.addresses[0].line1}<br />
                        {business.addresses[0].city}, {business.addresses[0].country}
                      </p>
                    </div>
                  </div>
                </div>
                </div>
            )}

            {/* Fallback for businesses without addresses */}
            {business.addresses.length === 0 && (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-[#2E6FF2] to-[#5F8CFF] rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-display text-white">
                    {business.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-2xl font-heading text-white mb-4">
                  Get In Touch
                </h3>
                <p className="text-[#AEB4C1] font-body text-lg mb-6">
                  Contact us to learn more about our services
                </p>
                <div className="flex justify-center">
                  <CTASection business={business} />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Mobile Contact Section - Optimized Performance */}
        <section className="lg:hidden relative bg-gradient-to-b from-[#F5F5F7] to-[#E8E8ED] overflow-hidden">
          {/* Lightweight background - no heavy gallery on mobile */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-[#2E6FF2]/20 via-[#5F8CFF]/10 to-[#2E6FF2]/20"></div>
            {/* Subtle pattern overlay for visual interest */}
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(46, 111, 242, 0.1) 0%, transparent 50%), 
                               radial-gradient(circle at 75% 75%, rgba(95, 140, 255, 0.1) 0%, transparent 50%)`
            }}></div>
          </div>
          
          <div className="relative z-10 py-12 px-4">
            <h2 className={cn(
              "text-2xl font-heading text-gray-900 mb-8 text-center",
              businessLocale === 'he' ? 'text-right' : 'text-left'
            )}>
              {businessLocale === 'he' ? 'מצאו אותנו כאן' : 'Find Us Here'}
            </h2>
            
            {/* Address Info with Embedded Map */}
            {business.addresses.length > 0 && (
              <div className="bg-[#0D1117] border border-white/10 rounded-2xl overflow-hidden mb-6">
                {/* Embedded Google Maps */}
                <div className="aspect-[4/3] bg-gradient-to-br from-[#2E6FF2]/20 to-[#5F8CFF]/20 relative">
                  {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
                    <iframe
                      src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(
                        `${business.addresses[0].line1 || ''} ${business.addresses[0].city || ''} ${business.addresses[0].country || ''}`
                      )}`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-t-2xl"
                    ></iframe>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2E6FF2]/20 to-[#5F8CFF]/20">
                      <div className="text-center text-white">
                        <div className="text-4xl mb-4">🗺️</div>
                        <p className="font-body">Map Preview</p>
                        <p className="text-sm text-white/60 mt-2">Configure Google Maps API key to show interactive map</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Address Information */}
                <div className="p-6">
                  <h3 className="font-heading text-white mb-2">{business.name}</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    {business.addresses[0].line1}<br />
                    {business.addresses[0].city}, {business.addresses[0].country}
                  </p>
                  
                  {/* Map Navigation Buttons */}
                  <div className="flex gap-3">
                    <a
                      href={`https://maps.google.com/maps?q=${encodeURIComponent(
                        `${business.addresses[0].line1 || ''} ${business.addresses[0].city || ''} ${business.addresses[0].country || ''}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-4 py-3 rounded-xl text-center font-medium backdrop-blur-md text-xs"
                    >
                      Open in Google Maps
                    </a>
                    <a
                      href={`https://waze.com/ul?q=${encodeURIComponent(
                        `${business.addresses[0].line1 || ''} ${business.addresses[0].city || ''} ${business.addresses[0].country || ''}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 px-4 py-3 rounded-xl text-center font-medium backdrop-blur-md text-xs"
                    >
                      Open in Waze
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Options */}
            <div className="bg-[#0D1117]/90 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="font-heading text-white mb-4">Get In Touch</h3>
              <ContactSection business={business} />
            </div>
          </div>
        </section>

        {/* Mobile Sticky CTA Bar */}
        <MobileStickyBar business={business} locale={businessLocale} />
      </>
    );
  } catch (error) {
    console.error('Error fetching business:', error);
    notFound();
  }
}