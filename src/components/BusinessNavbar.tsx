'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Home, Briefcase, MapPin, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMobileDetection, useTouchGestures } from '@/hooks/useMobileDetection';

interface BusinessNavbarProps {
  businessLocale: 'he' | 'en';
  hasServices: boolean;
  businessName?: string;
}

export function BusinessNavbar({ businessLocale, hasServices, businessName }: BusinessNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const { isMobile } = useMobileDetection();
  const { onTouchStart, onTouchMove, onTouchEnd } = useTouchGestures();
  const containerClasses = {
    dir: businessLocale === 'he' ? 'rtl' : 'ltr',
  };

  const langClasses = {
    spaceX: businessLocale === 'he' ? 'space-x-reverse' : '',
  };

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
      setShowScrollToTop(scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle mobile menu close on resize
  useEffect(() => {
    const handleResize = () => {
      if (!isMobile && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile, isMobileMenuOpen]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen && !(event.target as Element).closest('.mobile-nav-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      // Close mobile menu after navigation
      setIsMobileMenuOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Add haptic feedback on supported devices
    if ('vibrate' in navigator && isMobile) {
      navigator.vibrate(30);
    }
  };

  // Handle touch gestures for mobile menu
  const handleDrawerTouchEnd = () => {
    const gesture = onTouchEnd();
    if (gesture?.isRightSwipe) {
      setIsMobileMenuOpen(false);
    }
  };

  const navbarClasses = cn(
    'fixed top-0 left-0 right-0 z-30 transition-all duration-300',
    isScrolled ? 'bg-[#0D1117]/90 backdrop-blur-md shadow-lg' : '',
    'safe-padding-top'
  );

  return (
    <>
      <nav className={navbarClasses} dir={containerClasses.dir}>
        <div className={cn(
          "flex items-center justify-between px-4 sm:px-6 py-3",
          businessLocale === 'he' ? 'flex-row-reverse' : '',
          langClasses.spaceX
        )}>
          {/* Logo/Brand - Hidden on mobile */}
          <div className={cn("flex items-center", isMobile ? 'hidden' : '')}>
            <button 
              onClick={scrollToTop}
              className="h-10 sm:h-12 px-3 sm:px-4 icy-glass rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-105 min-w-[120px]"
            >
              <span className="text-white font-ui tracking-wider text-lg">
                {businessName || 'Business'}
              </span>
            </button>
          </div>

          {/* Desktop Navigation Menu */}
          <div className="hidden md:flex items-center gap-3">
            {hasServices && (
              <button 
                onClick={() => scrollToSection('services-section')}
                className="px-6 py-3 font-ui tracking-wide bg-[#0D1117]/80 backdrop-blur-md border border-white/20 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:border-white/40 text-white cursor-pointer touch-target"
              >
                {businessLocale === 'he' ? 'שירותים' : 'Services'}
              </button>
            )}
            <button 
              onClick={() => scrollToSection('contact-section')}
              className="px-6 py-3 font-ui tracking-wide bg-[#0D1117]/80 backdrop-blur-md border border-white/20 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:border-white/40 text-white cursor-pointer touch-target"
            >
              {businessLocale === 'he' ? 'צור קשר' : 'Contact'}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden mobile-nav-container">
            <button
              onClick={toggleMobileMenu}
              className={cn(
                "w-10 h-10 icy-glass rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 touch-target",
                isMobileMenuOpen && 'bg-white/20'
              )}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-white" />
              ) : (
                <Menu className="h-5 w-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-backdrop md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Mobile Menu Drawer */}
      <div 
        className={cn(
          'mobile-nav-drawer md:hidden mobile-nav-container',
          isMobileMenuOpen && 'open'
        )}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={handleDrawerTouchEnd}
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="p-6 border-b border-white/10">
            <div className={cn(
              "flex items-center justify-between",
              businessLocale === 'he' ? 'flex-row-reverse' : ''
            )}>
              <h2 className="text-white font-heading text-lg">
                {businessLocale === 'he' ? 'תפריט' : 'Menu'}
              </h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-8 h-8 icy-glass rounded-lg flex items-center justify-center touch-target"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 p-6 space-y-4">
            <button
              onClick={() => scrollToSection('hero-section')}
              className={cn(
                "w-full flex items-center gap-3 p-4 rounded-xl icy-glass text-white font-ui transition-all duration-200 hover:bg-white/15 touch-target-lg",
                businessLocale === 'he' ? 'flex-row-reverse text-right' : 'text-left'
              )}
            >
              <Home className="h-5 w-5" />
              <span>{businessLocale === 'he' ? 'בית' : 'Home'}</span>
            </button>

            {hasServices && (
              <button
                onClick={() => scrollToSection('services-section')}
                className={cn(
                  "w-full flex items-center gap-3 p-4 rounded-xl icy-glass text-white font-ui transition-all duration-200 hover:bg-white/15 touch-target-lg",
                  businessLocale === 'he' ? 'flex-row-reverse text-right' : 'text-left'
                )}
              >
                <Briefcase className="h-5 w-5" />
                <span>{businessLocale === 'he' ? 'שירותים' : 'Services'}</span>
              </button>
            )}

            <button
              onClick={() => scrollToSection('contact-section')}
              className={cn(
                "w-full flex items-center gap-3 p-4 rounded-xl icy-glass text-white font-ui transition-all duration-200 hover:bg-white/15 touch-target-lg",
                businessLocale === 'he' ? 'flex-row-reverse text-right' : 'text-left'
              )}
            >
              <MapPin className="h-5 w-5" />
              <span>{businessLocale === 'he' ? 'צור קשר' : 'Contact'}</span>
            </button>
          </div>

          {/* Drawer Footer */}
          <div className="p-6 border-t border-white/10">
            <p className={cn(
              "text-white/60 text-sm font-body",
              businessLocale === 'he' ? 'text-right' : 'text-left'
            )}>
              {businessLocale === 'he' ? 'החלק כדי לסגור' : 'Swipe to close'}
            </p>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className={cn(
            "fixed bottom-6 z-40 w-12 h-12 icy-glass rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 touch-target shadow-lg",
            businessLocale === 'he' ? 'left-6' : 'right-6'
          )}
          aria-label={businessLocale === 'he' ? 'חזור למעלה' : 'Scroll to top'}
        >
          <ArrowUp className="h-5 w-5 text-white" />
        </button>
      )}
    </>
  );
}