import Link from 'next/link';
import Image from 'next/image';
import { fetchBusinessList } from '@/lib/api';
import { normalizeBusiness } from '@/lib/normalize';
import { pluralize, detectLanguage, cn } from '@/lib/utils';

export default async function HomePage() {
  try {
    const response = await fetchBusinessList(20, 0);
    const activeBusinesses = response.success 
      ? response.data
          .filter(b => b.is_active)
          .map(normalizeBusiness)
      : [];

    return (
      <main className="min-h-screen bg-[#0D1117] relative overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-[#FEC46C] to-[#F28E35] rounded-full blur-3xl opacity-15"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-[#2E6FF2] to-[#5F8CFF] rounded-full blur-3xl opacity-10"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="container mx-auto max-w-7xl px-4 py-16 md:py-24">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-display text-white mb-6">
                <span className="bg-gradient-to-l from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                  Activon
                </span>{" "}
                Business Directory
              </h1>
              <p className="text-lg md:text-xl text-[#AEB4C1] font-body max-w-3xl mx-auto">
                Discover amazing businesses and services powered by the Activon platform
              </p>
            </div>

            {activeBusinesses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeBusinesses.map((business) => {
                  // Smart language detection
                  const businessLocale = detectLanguage(business.name, business.description);
                  const isRTL = businessLocale === 'he';
                  
                  // Get image for card
                  const cardImage = business.heroImage?.uri || 
                    (business.gallery.length > 0 ? business.gallery[0].uri : null);
                  
                  return (
                    <Link
                      key={business.id}
                      href={`/b/${business.id}`}
                      className="group block"
                    >
                      <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-4xl overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-white/15 h-full">
                        {/* Image Section */}
                        <div className="aspect-[16/9] relative bg-gradient-to-br from-[#2E6FF2]/20 to-[#5F8CFF]/20">
                          {cardImage ? (
                            <Image
                              src={cardImage}
                              alt={business.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-20 h-20 bg-gradient-to-br from-[#2E6FF2] to-[#5F8CFF] rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-2xl">
                                  {business.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                          )}
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        </div>
                        
                        {/* Content Section */}
                        <div className="p-6" dir={isRTL ? 'rtl' : 'ltr'}>
                          <div className={cn(
                            "flex items-start gap-3 mb-4",
                            isRTL ? "flex-row-reverse" : "flex-row"
                          )}>
                            <div className="flex-1">
                              <h3 className={cn(
                                "text-xl font-subheading text-white line-clamp-2 mb-2",
                                isRTL ? "text-right" : "text-left"
                              )}>
                                {business.name}
                              </h3>
                              
                              {business.description && (
                                <p className={cn(
                                  "text-[#AEB4C1] font-body line-clamp-3 text-sm leading-relaxed",
                                  isRTL ? "text-right" : "text-left"
                                )}>
                                  {business.description}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {/* Tags */}
                          <div className={cn(
                            "flex flex-wrap gap-2 mt-4",
                            isRTL ? "justify-end" : "justify-start"
                          )}>
                            {business.serviceCount > 0 && (
                              <span className="px-3 py-1.5 bg-gradient-to-r from-[#2E6FF2]/20 to-[#5F8CFF]/20 text-[#5F8CFF] rounded-full border border-[#2E6FF2]/30 text-xs font-ui">
                                {pluralize(business.serviceCount, 'service').replace(' ', '+ ')}
                              </span>
                            )}
                            {business.activityCount > 0 && (
                              <span className="px-3 py-1.5 bg-gradient-to-r from-[#FEC46C]/20 to-[#F28E35]/20 text-[#FEC46C] rounded-full border border-[#F28E35]/30 text-xs font-ui">
                                {business.activityCount}+ {isRTL ? 'פעילויות' : 'activities'}
                              </span>
                            )}
                            {business.categoryName && (
                              <span className="px-3 py-1.5 bg-white/10 text-white/80 rounded-full border border-white/20 text-xs font-ui">
                                {business.categoryName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-4xl p-8 max-w-md mx-auto">
                  <p className="text-[#AEB4C1] font-body">
                    No active businesses found. Please check your API configuration.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  } catch (error) {
    return (
      <main className="min-h-screen bg-[#0D1117] flex items-center justify-center relative overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-[#FEC46C] to-[#F28E35] rounded-full blur-3xl opacity-15"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center">
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-4xl p-8 max-w-md mx-4">
            <h1 className="text-2xl font-heading text-white mb-4">
              Unable to load businesses
            </h1>
            <p className="text-[#AEB4C1] font-body">
              Please check your API configuration and try again.
            </p>
          </div>
        </div>
      </main>
    );
  }
}