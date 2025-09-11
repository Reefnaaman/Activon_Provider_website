import Image from 'next/image';
import { NormalizedBusiness } from '@/types/business';
import { initials, truncate, pluralize } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface HeroProps {
  business: NormalizedBusiness;
  className?: string;
}

export function Hero({ business, className }: HeroProps) {
  const businessInitials = initials(business.name);
  const truncatedDescription = truncate(business.description, 400);

  return (
    <section className={cn('w-full', className)}>
      {/* Hero Image or Initials */}
      <div className="relative aspect-video lg:aspect-square w-full overflow-hidden bg-white/10 backdrop-blur-md border border-white/10 rounded-4xl transition-all duration-300 hover:scale-105">
        {business.heroImage?.uri ? (
          <Image
            src={business.heroImage.uri}
            alt={business.name}
            fill
            className="object-cover rounded-4xl"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600/20 to-cyan-500/20">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400">
              <span className="text-4xl font-display text-white">
                {businessInitials}
              </span>
            </div>
          </div>
        )}
        
        {/* Overlay for better text readability when there's an image */}
        {business.heroImage?.uri && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-4xl" />
        )}
        
        {/* Business name overlay for images */}
        {business.heroImage?.uri && (
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-3xl md:text-4xl font-display text-white mb-2">
              {business.name}
            </h1>
          </div>
        )}
      </div>

      {/* Business Info */}
      <div className="mt-8 space-y-6">
        {/* Show name only if no hero image */}
        {!business.heroImage?.uri && (
          <h1 className="text-3xl md:text-4xl font-display text-white">
            {business.name}
          </h1>
        )}
        
        {truncatedDescription && (
          <p className="text-lg md:text-xl text-[#AEB4C1] leading-relaxed font-body">
            {truncatedDescription}
          </p>
        )}

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-3">
          {business.categoryName && (
            <span className="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl text-white font-ui transition-all duration-300 hover:bg-white/15">
              {business.categoryName}
            </span>
          )}
          
          {business.subcategoryName && (
            <span className="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl text-white font-ui transition-all duration-300 hover:bg-white/15">
              {business.subcategoryName}
            </span>
          )}
          
          {business.serviceCount > 0 && (
            <span className="bg-gradient-to-r from-blue-500/20 to-cyan-400/20 border border-cyan-400/30 px-4 py-2 rounded-2xl text-cyan-300 font-ui transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-500/30 hover:to-cyan-400/30">
              {pluralize(business.serviceCount, 'service').replace(' ', '+ ')}
            </span>
          )}
          
          {business.activityCount > 0 && (
            <span className="bg-gradient-to-r from-[#FEC46C]/20 to-[#F28E35]/20 border border-[#F28E35]/30 px-4 py-2 rounded-2xl text-[#FEC46C] font-ui transition-all duration-300 hover:bg-gradient-to-r hover:from-[#FEC46C]/30 hover:to-[#F28E35]/30">
              {business.activityCount}+ activities
            </span>
          )}
        </div>
      </div>
    </section>
  );
}