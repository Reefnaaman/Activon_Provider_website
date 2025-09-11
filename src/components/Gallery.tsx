'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Images, ZoomIn, ZoomOut } from 'lucide-react';
import { NormalizedBusiness, NormalizedImage } from '@/types/business';
import { shouldShowGallery } from '@/lib/normalize';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { gallerySyncManager } from '@/lib/gallerySync';
import { useMobileDetection, useTouchGestures } from '@/hooks/useMobileDetection';

interface GalleryProps {
  business: NormalizedBusiness;
  className?: string;
  locale?: 'he' | 'en';
  backgroundMode?: boolean;
  syncedMirror?: boolean;
}

interface LightboxProps {
  images: NormalizedImage[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

interface TouchState {
  startX: number;
  startY: number;
  startDistance: number;
  scale: number;
  translateX: number;
  translateY: number;
}

interface PinchState {
  initialDistance: number;
  initialScale: number;
  centerX: number;
  centerY: number;
}

function Lightbox({ images, currentIndex, onClose, onNext, onPrev }: LightboxProps) {
  const { isMobile, isTouchDevice } = useMobileDetection();
  const { onTouchStart, onTouchMove, onTouchEnd } = useTouchGestures();
  const imageRef = useRef<HTMLDivElement>(null);
  const [touchState, setTouchState] = useState<TouchState>({
    startX: 0,
    startY: 0,
    startDistance: 0,
    scale: 1,
    translateX: 0,
    translateY: 0,
  });
  const [isZoomed, setIsZoomed] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  
  const currentImage = images[currentIndex];

  // Calculate distance between two touch points
  const getDistance = (touch1: React.Touch, touch2: React.Touch) => {
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  // Handle pinch-to-zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      // Single touch - prepare for swipe
      setTouchState(prev => ({
        ...prev,
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
      }));
    } else if (e.touches.length === 2) {
      // Pinch gesture
      const distance = getDistance(e.touches[0], e.touches[1]);
      const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      
      setTouchState(prev => ({
        ...prev,
        startDistance: distance,
        startX: centerX,
        startY: centerY,
      }));
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    
    if (e.touches.length === 2) {
      // Pinch zoom
      const distance = getDistance(e.touches[0], e.touches[1]);
      const scale = Math.max(0.5, Math.min(3, (distance / touchState.startDistance) * touchState.scale));
      
      setTouchState(prev => ({
        ...prev,
        scale,
      }));
      setIsZoomed(scale > 1.1);
    } else if (e.touches.length === 1 && isZoomed) {
      // Pan when zoomed
      const deltaX = e.touches[0].clientX - touchState.startX;
      const deltaY = e.touches[0].clientY - touchState.startY;
      
      setTouchState(prev => ({
        ...prev,
        translateX: prev.translateX + deltaX * 0.5,
        translateY: prev.translateY + deltaY * 0.5,
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
      }));
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length === 0 && !isZoomed) {
      // Single tap or swipe gesture
      const gesture = onTouchEnd();
      if (gesture) {
        if (gesture.isLeftSwipe && images.length > 1) {
          onNext();
        } else if (gesture.isRightSwipe && images.length > 1) {
          onPrev();
        } else if (Math.abs(gesture.distanceX) < 50 && Math.abs(gesture.distanceY) < 50) {
          // Tap to toggle UI
          setShowThumbnails(!showThumbnails);
        }
      }
    }
    
    // Reset touch state after pinch
    if (e.touches.length < 2) {
      setTouchState(prev => ({
        ...prev,
        startDistance: 0,
      }));
    }
  };

  // Reset zoom on image change
  useEffect(() => {
    setTouchState({
      startX: 0,
      startY: 0,
      startDistance: 0,
      scale: 1,
      translateX: 0,
      translateY: 0,
    });
    setIsZoomed(false);
  }, [currentIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          onPrev();
          break;
        case 'ArrowRight':
          onNext();
          break;
        case ' ':
          e.preventDefault();
          setShowThumbnails(!showThumbnails);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev, showThumbnails]);

  const resetZoom = () => {
    setTouchState({
      startX: 0,
      startY: 0,
      startDistance: 0,
      scale: 1,
      translateX: 0,
      translateY: 0,
    });
    setIsZoomed(false);
  };

  const zoomIn = () => {
    setTouchState(prev => {
      const newScale = Math.min(3, prev.scale * 1.5);
      setIsZoomed(newScale > 1.1);
      return { ...prev, scale: newScale };
    });
  };

  const zoomOut = () => {
    setTouchState(prev => {
      const newScale = Math.max(0.5, prev.scale * 0.75);
      setIsZoomed(newScale > 1.1);
      return { ...prev, scale: newScale };
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
      {/* Mobile-optimized controls */}
      <div className={cn(
        "absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-300",
        isMobile && showThumbnails ? 'opacity-0' : 'opacity-100'
      )}>
        <div className="flex items-center justify-between">
          {/* Close button */}
          <button
            onClick={onClose}
            className="touch-target-lg icy-glass rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
          >
            <X className={cn(isMobile ? 'h-6 w-6' : 'h-5 w-5', 'text-white')} />
          </button>

          {/* Zoom controls */}
          {isTouchDevice && (
            <div className="flex items-center gap-2">
              <button
                onClick={zoomOut}
                disabled={touchState.scale <= 0.6}
                className="touch-target icy-glass rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 disabled:opacity-50"
              >
                <ZoomOut className="h-4 w-4 text-white" />
              </button>
              <button
                onClick={resetZoom}
                className="px-3 py-1 icy-glass rounded-lg text-white text-xs font-medium"
              >
                {Math.round(touchState.scale * 100)}%
              </button>
              <button
                onClick={zoomIn}
                disabled={touchState.scale >= 3}
                className="touch-target icy-glass rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 disabled:opacity-50"
              >
                <ZoomIn className="h-4 w-4 text-white" />
              </button>
            </div>
          )}

          {/* Image counter */}
          {images.length > 1 && (
            <div className="px-3 py-1 icy-glass rounded-full text-white text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </div>

      {/* Main image container */}
      <div 
        ref={imageRef}
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `scale(${touchState.scale}) translate(${touchState.translateX}px, ${touchState.translateY}px)`,
          transition: isZoomed ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        <div className="relative max-w-full max-h-full w-full h-full">
          <Image
            src={currentImage.uri}
            alt={`Gallery image ${currentIndex + 1}`}
            fill
            className="object-contain"
            quality={90}
            priority
          />
        </div>
      </div>

      {/* Navigation buttons - Hidden on mobile when zoomed */}
      {images.length > 1 && (!isMobile || !isZoomed) && (
        <>
          <button
            onClick={onPrev}
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 touch-target-lg icy-glass rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105",
              isMobile ? 'opacity-70' : ''
            )}
          >
            <ChevronLeft className={cn(isMobile ? 'h-6 w-6' : 'h-5 w-5', 'text-white')} />
          </button>
          <button
            onClick={onNext}
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2 touch-target-lg icy-glass rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105",
              isMobile ? 'opacity-70' : ''
            )}
          >
            <ChevronRight className={cn(isMobile ? 'h-6 w-6' : 'h-5 w-5', 'text-white')} />
          </button>
        </>
      )}

      {/* Mobile thumbnail strip */}
      {isMobile && images.length > 1 && (
        <div className={cn(
          "absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent transition-transform duration-300",
          showThumbnails ? 'translate-y-0' : 'translate-y-full'
        )}>
          <div className="flex gap-2 overflow-x-auto pb-2 scroll-snap-x mobile-scroll">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => {
                  if (index < currentIndex) onPrev();
                  else if (index > currentIndex) onNext();
                  setShowThumbnails(false);
                }}
                className={cn(
                  "flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 scroll-snap-start",
                  index === currentIndex ? 'border-white' : 'border-transparent'
                )}
              >
                <Image
                  src={image.uri}
                  alt={`Thumbnail ${index + 1}`}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobile instructions */}
      {isMobile && (
        <div className={cn(
          "absolute bottom-4 left-4 right-4 text-center transition-opacity duration-300",
          showThumbnails ? 'opacity-0' : 'opacity-60'
        )}>
          <p className="text-white text-xs">
            {images.length > 1 ? 'Swipe for next • ' : ''}Pinch to zoom • Tap for thumbnails
          </p>
        </div>
      )}
    </div>
  );
}

export function Gallery({ business, className, locale = 'en', backgroundMode = false, syncedMirror = false }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const { isMobile, isTouchDevice } = useMobileDetection();

  // Background mode: show gallery images as full-screen background with animation
  if (backgroundMode) {
    // Create a comprehensive image collection with placeholders
    const backgroundImages = [];
    
    // Add business gallery images
    if (business.gallery.length > 0) {
      backgroundImages.push(...business.gallery.map(img => img.uri));
    }
    
    // Add hero image if available
    if (business.heroImage?.uri && !backgroundImages.includes(business.heroImage.uri)) {
      backgroundImages.push(business.heroImage.uri);
    }
    
    // Add nature and orange-themed placeholder images matching our services
    const placeholderImages = [
      'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=1920&h=1080&fit=crop&q=80', // Orange groves - citrus harvest scene
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop&q=80', // Forest path - nature walk trail
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1920&h=1080&fit=crop&q=80', // Garden consultation - beautiful garden landscape
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&h=1080&fit=crop&q=80', // Farm landscape - organic farming scene
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&h=1080&fit=crop&q=80', // Fresh organic produce - farmers market display
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop&q=80'  // Harvest festival - autumn harvest celebration
    ];
    
    // Ensure we have at least 3-6 images for a good slideshow
    while (backgroundImages.length < 4) {
      backgroundImages.push(placeholderImages[backgroundImages.length % placeholderImages.length]);
    }
    
    // Limit to max 6 images to keep performance good
    const finalImages = backgroundImages.slice(0, 6);

    return (
      <div className="absolute inset-0">
        <AnimatedGalleryBackground images={finalImages} businessName={business.name} syncedMirror={syncedMirror} />
      </div>
    );
  }

  if (!shouldShowGallery(business)) {
    return null;
  }

  const strings = {
    he: {
      title: 'תמונות',
    },
    en: {
      title: 'Photos',
    },
  };

  const t = strings[locale];

  // Show up to 6 images in the grid
  const displayImages = business.gallery.slice(0, 6);
  const hasMoreImages = business.gallery.length > 6;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % business.gallery.length);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + business.gallery.length) % business.gallery.length);
    }
  };

  return (
    <>
      <section className={cn('w-full h-full flex flex-col', className)}>
        <div className="flex items-center gap-2 mb-4">
          <Images className="h-4 w-4 text-[#AEB4C1]" />
          <h2 className="text-lg font-subheading text-white">
            {t.title}
          </h2>
          {hasMoreImages && (
            <span className="text-xs text-[#AEB4C1] font-caption">
              +{business.gallery.length - 4}
            </span>
          )}
        </div>

        {/* Main Gallery Grid - Mobile-Optimized */}
        <div className="flex-1 min-h-0">
          {displayImages.length > 0 && (
            <div className={cn(
              "h-full grid gap-2",
              // Mobile-first grid layout
              displayImages.length === 1 ? "grid-cols-1" :
              displayImages.length === 2 ? "grid-cols-2" :
              "grid-cols-2 sm:grid-cols-3"
            )} style={{
              // Dynamic grid for larger screens
              gridTemplateColumns: !isMobile ? (
                displayImages.length === 1 ? '1fr' 
                : displayImages.length === 2 ? '1fr 1fr'
                : displayImages.length === 3 ? '2fr 1fr'
                : '1fr 1fr'
              ) : undefined,
              gridTemplateRows: !isMobile ? (
                displayImages.length <= 2 ? '1fr'
                : displayImages.length === 3 ? '1fr 1fr'
                : '1fr 1fr'
              ) : undefined
            }}>
              {/* First image - responsive layout */}
              <button
                onClick={() => openLightbox(0)}
                className={cn(
                  "group relative overflow-hidden rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 touch-target active:scale-95",
                  // Mobile: always single column span
                  isMobile ? "col-span-1" : (
                    displayImages.length === 3 ? "row-span-2" : "col-span-1"
                  ),
                  // Touch feedback
                  isTouchDevice && "active:transform active:scale-95"
                )}
              >
                <Image
                  src={displayImages[0].uri}
                  alt={`Gallery image 1`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent group-hover:from-black/40 transition-colors duration-300" />
                {displayImages.length > 4 && (
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded-full font-caption">
                    +{displayImages.length - 1}
                  </div>
                )}
              </button>

              {/* Additional images */}
              {displayImages.slice(1, isMobile ? 3 : 4).map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => openLightbox(index + 1)}
                  className={cn(
                    "group relative overflow-hidden rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 touch-target active:scale-95",
                    // Mobile: maintain aspect ratio
                    isMobile ? "aspect-square" : "aspect-square",
                    // Touch feedback
                    isTouchDevice && "active:transform active:scale-95"
                  )}
                >
                  <Image
                    src={image.uri}
                    alt={`Gallery image ${index + 2}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                </button>
              ))}
            </div>
          )}

          {/* Empty State */}
          {displayImages.length === 0 && (
            <div className="h-full flex items-center justify-center rounded-2xl bg-white/5 border border-white/10">
              <div className="text-center">
                <Images className="h-8 w-8 text-[#AEB4C1] mx-auto mb-2" />
                <p className="text-sm text-[#AEB4C1] font-caption">No photos</p>
              </div>
            </div>
          )}
        </div>

        {hasMoreImages && (
          <div className="text-center">
            <button
              onClick={() => openLightbox(6)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {locale === 'he' ? 'הצג עוד תמונות' : 'View more photos'}
            </button>
          </div>
        )}
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={business.gallery}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </>
  );
}

interface AnimatedGalleryBackgroundProps {
  images: string[];
  businessName: string;
  syncedMirror?: boolean;
}

function AnimatedGalleryBackground({ images, businessName, syncedMirror = false }: AnimatedGalleryBackgroundProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Use shared sync manager for synchronized galleries
  useEffect(() => {
    if (images.length <= 1) return;

    // Start the global sync and subscribe to updates
    gallerySyncManager.startSync(images.length);
    const unsubscribe = gallerySyncManager.subscribe((index) => {
      setCurrentImageIndex(index);
    });

    return unsubscribe;
  }, [images.length]);

  // Use the synced current image index
  const activeImageIndex = currentImageIndex;

  return (
    <>
      {/* Background Images with Crossfade Animation */}
      {images.map((image, index) => (
        <div
          key={index}
          className={cn(
            'absolute inset-0 transition-all duration-[2000ms] ease-in-out',
            index === activeImageIndex 
              ? 'opacity-100 scale-105' 
              : 'opacity-0 scale-100'
          )}
        >
          <Image
            src={image}
            alt={`${businessName} background ${index + 1}`}
            fill
            className={cn("object-cover", syncedMirror && "scale-y-[-1]")}
            priority={index === 0}
            sizes="100vw"
            style={{ filter: 'brightness(0.7)' }}
          />
        </div>
      ))}
      
      {/* Gradient Overlay for Content Readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-black/60"></div>
      
      {/* Subtle Animation Indicators - Hidden on mobile */}
      <div className="absolute bottom-8 right-8 z-10 flex gap-2 hidden lg:flex">
        {images.map((_, index) => (
          <div
            key={index}
            className={cn(
              'w-2 h-2 rounded-full transition-all duration-500',
              index === currentImageIndex 
                ? 'bg-white/80 scale-125' 
                : 'bg-white/30 scale-100'
            )}
          />
        ))}
      </div>
    </>
  );
}