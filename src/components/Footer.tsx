'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
  locale?: 'he' | 'en';
}

export function Footer({ className, locale = 'en' }: FooterProps) {
  const isRTL = locale === 'he';
  
  return (
    <footer 
      id="site-footer" 
      role="contentinfo" 
      className={cn('w-full mt-auto bg-[#0D1117] border-t border-white/5', className)}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="container max-w-6xl mx-auto px-4 py-16">
        {/* Band 1: Brand + Primary Nav (centered stack) */}
        <div className="footer-brand text-center space-y-8">
          <a 
            className={cn(
              "brand inline-flex items-center gap-3 hover:opacity-80 transition-opacity",
              isRTL ? "flex-row-reverse" : "flex-row"
            )} 
            href="/"
          >
            <div className="brand-mark relative w-10 h-10 overflow-hidden rounded-xl" aria-hidden="true">
              <Image 
                src="/assets/activon/Activon_logo.png" 
                alt="Activon" 
                width={40} 
                height={40}
                className="object-contain"
              />
            </div>
            <span className="brand-name text-3xl font-display text-white">
              <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                Activon
              </span>
            </span>
          </a>

          <nav className="footer-nav" aria-label="Footer">
            <ul className={cn(
              "flex flex-wrap justify-center gap-x-8 gap-y-4 text-[#AEB4C1] font-body",
              isRTL && "rtl:space-x-reverse"
            )}>
              <li>
                <a
                  href="/"
                  className="hover:text-white hover:bg-white/5 px-3 py-2 rounded-xl transition-all duration-300 touch-target"
                >
                  {locale === 'he' ? 'דף הבית' : 'Homepage'}
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="hover:text-white hover:bg-white/5 px-3 py-2 rounded-xl transition-all duration-300 touch-target"
                >
                  {locale === 'he' ? 'בלוג' : 'Blog'}
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="hover:text-white hover:bg-white/5 px-3 py-2 rounded-xl transition-all duration-300 touch-target"
                >
                  {locale === 'he' ? 'תנאי שימוש' : 'Terms & Conditions'}
                </a>
              </li>
            </ul>
          </nav>
        </div>

      </div>
    </footer>
  );
}