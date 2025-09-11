'use client';

import Image from 'next/image';
import { Facebook, Instagram } from 'lucide-react';
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
                  href="/products" 
                  className="hover:text-white hover:bg-white/5 px-3 py-2 rounded-xl transition-all duration-300 touch-target"
                >
                  {locale === 'he' ? 'מוצרים' : 'Products'}
                </a>
              </li>
              <li>
                <a 
                  href="/studio" 
                  className="hover:text-white hover:bg-white/5 px-3 py-2 rounded-xl transition-all duration-300 touch-target"
                >
                  {locale === 'he' ? 'סטודיו' : 'Studio'}
                </a>
              </li>
              <li>
                <a 
                  href="/clients" 
                  className="hover:text-white hover:bg-white/5 px-3 py-2 rounded-xl transition-all duration-300 touch-target"
                >
                  {locale === 'he' ? 'לקוחות' : 'Clients'}
                </a>
              </li>
              <li>
                <a 
                  href="/pricing" 
                  className="hover:text-white hover:bg-white/5 px-3 py-2 rounded-xl transition-all duration-300 touch-target"
                >
                  {locale === 'he' ? 'מחירים' : 'Pricing'}
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
                  href="/privacy" 
                  className="hover:text-white hover:bg-white/5 px-3 py-2 rounded-xl transition-all duration-300 touch-target"
                >
                  {locale === 'he' ? 'פרטיות' : 'Privacy'}
                </a>
              </li>
              <li>
                <a 
                  href="/terms" 
                  className="hover:text-white hover:bg-white/5 px-3 py-2 rounded-xl transition-all duration-300 touch-target"
                >
                  {locale === 'he' ? 'תנאי שימוש' : 'Terms'}
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Band 2: Divider */}
        <hr 
          className="footer-divider my-12 border-none h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" 
          aria-hidden="true" 
        />

        {/* Band 3: Bottom Bar (copyright left, socials right) */}
        <div className={cn(
          "footer-bottom flex flex-col gap-6 items-center",
          "md:flex-row md:justify-between",
          isRTL && "md:rtl:flex-row-reverse"
        )}>
          <p className="footer-copy text-[#AEB4C1] font-caption">
            © Activon LLABC {new Date().getFullYear()}
          </p>

          <ul 
            className="footer-social flex gap-4" 
            aria-label="Social links"
          >
            <li>
              <a 
                href="https://facebook.com/activon" 
                aria-label="Facebook"
                className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-cyan-400/20 border border-white/5 hover:border-cyan-400/30 text-[#AEB4C1] hover:text-cyan-300 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-cyan-500/20"
              >
                <Facebook className="w-4 h-4" aria-hidden="true" />
              </a>
            </li>
            <li>
              <a 
                href="https://instagram.com/activon" 
                aria-label="Instagram"
                className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-gradient-to-r hover:from-[#FEC46C]/20 hover:to-[#F28E35]/20 border border-white/5 hover:border-[#F28E35]/30 text-[#AEB4C1] hover:text-[#FEC46C] transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-orange-500/20"
              >
                <Instagram className="w-4 h-4" aria-hidden="true" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}