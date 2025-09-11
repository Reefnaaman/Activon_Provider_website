# Activon Provider Template

A Next.js 15 template for creating dynamic business profile pages powered by the Activon API. Each business gets their own dynamic page (e.g., `https://activon.com/AdamNinja`) with professional glassmorphism design and full responsive layouts.

## 🎯 The Why Behind Activon

**Mission**: Transform how businesses connect with their communities by providing **single, conversion-oriented pages** that eliminate friction between discovery and action.

**The Problem We Solve**:
- Businesses struggle with complex, multi-page websites that confuse rather than convert
- Service providers need professional online presence without technical complexity  
- Communities lack centralized, accessible ways to discover local businesses and services
- Traditional websites fail to handle sparse or inconsistent business data gracefully

**Our Solution Philosophy**:
- **One-Section Focus**: Each business gets a single, powerful page that tells their complete story
- **Conversion-Oriented**: Every element is designed to drive action - whether that's WhatsApp, calls, or emails
- **Resilient by Design**: Template gracefully handles incomplete data, ensuring every business looks professional
- **Community-Centric**: Hebrew/RTL-first design serves local communities authentically
- **Custom Domain Ready**: Each business can have their own domain (e.g., `https://AdamNinja.com`) for maximum brand ownership

**Impact Scenarios**:
- **Local Service Provider**: "מכבי שוהם שחייה" (Shoham Swimming Club) gets professional presence with contact info, social links, and service details
- **Small Business Owner**: "Reef and adam's oranges" can instantly share their WhatsApp, location, and services through a branded URL
- **Community Discovery**: Residents can explore local businesses through the directory, each with consistent, accessible information
- **Professional Presence**: Every business appears polished and trustworthy, regardless of their data completeness

## 🚀 Project Overview

This template creates beautiful, SEO-optimized business profile pages that integrate with the Activon Businesses API. Each business automatically gets:

- **Dynamic Routes**: `https://yoursite.com/b/[business-id]` 
- **Custom URLs**: Can be mapped to custom domains like `https://AdamNinja.com`
- **Professional Design**: Activon brand guidelines with glassmorphism effects
- **Mobile-First**: One-section layout on desktop, optimized for mobile
- **RTL Support**: Hebrew language support built-in
- **SEO Optimized**: Meta tags, JSON-LD structured data, Open Graph

## 🛠 Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the project
cd /Users/reefnaaman/Desktop/Projects/Activon_Provider_Template

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
# Edit .env.local with your Activon API credentials

# Start development server
npm run dev
```

### Environment Variables
Create `.env.local` in the project root:
```bash
# Activon API Configuration
ACTIVON_API_URL=https://dev.activon.app/n8n/webhook/businesses
ACTIVON_BEARER_TOKEN=your_bearer_token_here

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### Development Commands
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run type-check # Run TypeScript checks
```

## 🎨 Design System

### Activon Brand Guidelines Implementation

**Colors:**
- Navy Dark: `#0D1117` (main background)
- Activon Blue: `#2E6FF2` (brand primary)
- Cyan Accents: `#5F8CFF` to `#2E6FF2` gradients
- Orange Highlights: `#FEC46C` (light), `#F28E35` (dark)
- Text Colors: `#FFFFFF` (headings), `#AEB4C1` (body)

**Typography:**
- Headlines: `font-sf-pro` (SF Pro Display)
- Body Text: `font-sf-text` (SF Pro Text)
- Fallbacks: Inter, system-ui, sans-serif

**Glass Morphism Effects:**
- Cards: `bg-white/10 backdrop-blur-md border border-white/10`
- Hover: `hover:bg-white/15 hover:scale-105`
- Transitions: `transition-all duration-300`

**Layout:**
- Desktop: One-section layout with optimal content flow
- Mobile: Mobile-first responsive design
- RTL: Full Hebrew/Arabic language support

## 📱 Mobile-First Design Philosophy

The template prioritizes mobile experience:
- **Single Column**: Mobile layouts use single-column stacks
- **Touch Targets**: All buttons are 44px+ for touch accessibility  
- **Progressive Enhancement**: Desktop adds horizontal layouts
- **Performance**: Optimized images and lazy loading
- **Responsive Typography**: Fluid text scaling across devices

## 🎯 Conversion-Oriented Design Principles

### Smart CTA Prioritization
The template uses intelligent decision-making to maximize conversions:
1. **WhatsApp First**: If available, WhatsApp is prioritized as the primary CTA (highest conversion for local businesses)
2. **Phone Fallback**: Direct calling as secondary option for immediate contact
3. **Email Last**: Professional email contact for formal inquiries
4. **Graceful Degradation**: Even businesses with minimal contact info get professional presentation

### Data Resilience Philosophy
Every business deserves a professional presence, regardless of data completeness:
- **Empty Images**: Beautiful initials tiles with brand colors
- **Missing Descriptions**: Clean layout focuses on contact and services
- **Sparse Contact Info**: Single contact methods still get prominent CTAs
- **No Services Listed**: Generic "Contact" CTA maintains professional appearance

### Real-World Success Scenarios
Based on actual businesses in our system:

**Scenario 1: Full-Service Business (ID 17 - "Reef and adam's oranges")**
- Complete contact info with WhatsApp, phone, email, and address
- Social media presence (Instagram)
- Service and activity counts for credibility
- **Result**: Professional page with multiple contact options and social proof

**Scenario 2: Minimal Data Business (ID 54 - "Fff")**  
- Only basic name, description, and phone number
- **Result**: Clean, focused page with single clear CTA - "Call"
- Initials hero maintains visual appeal despite no images

**Scenario 3: Community Organization (ID 45 - "מכבי שוהם שחייה")**
- Hebrew name with RTL support
- Email-first contact (swimming club preference)
- Complete address for location-based service
- Social media for community engagement
- **Result**: Culturally appropriate, community-focused presentation

## 🏗 Architecture

### File Structure
```
src/
├── app/
│   ├── api/business/route.ts    # API proxy for Activon
│   ├── b/[id]/page.tsx         # Dynamic business pages
│   ├── layout.tsx              # Root layout with RTL
│   ├── page.tsx                # Homepage directory
│   └── globals.css             # Activon design system
├── components/
│   ├── Hero.tsx                # Business hero section
│   ├── CTASection.tsx          # Contact buttons
│   ├── ContactSection.tsx      # Contact information
│   ├── Gallery.tsx             # Image gallery
│   ├── ServicesSection.tsx     # Services display
│   └── SEO.tsx                 # SEO components
├── lib/
│   ├── api.ts                  # API client
│   ├── normalize.ts            # Data transformation
│   └── utils.ts                # Utility functions
└── types/
    └── business.ts             # TypeScript definitions
```

### Data Flow
1. **API Proxy** (`/api/business`) fetches from Activon API
2. **Data Normalization** transforms API responses
3. **Type Safety** with comprehensive TypeScript types
4. **Component Rendering** with proper error boundaries
5. **SEO Generation** with dynamic metadata

## 🌐 Dynamic Business Pages

Each business automatically gets a dynamic page at `/b/[business-id]`:

### URL Structure
- **Development**: `http://localhost:3001/b/17`
- **Production**: `https://yoursite.com/b/17`
- **Custom Domain**: `https://AdamNinja.com` (with DNS mapping)

### Page Features
- **Hero Section**: Business image or initials with glassmorphism
- **CTA Buttons**: Smart contact prioritization (WhatsApp → Call → Email)
- **Services/Activities**: Dynamic badges with counts
- **Gallery**: Lightbox image viewing
- **Contact Info**: Comprehensive contact details
- **SEO Meta**: Dynamic titles, descriptions, JSON-LD

### Mobile-First Layout
- **Mobile**: Vertical stack, touch-optimized
- **Desktop**: Single-section horizontal layout
- **Responsive**: Fluid breakpoints at 768px, 1024px

## 🔧 API Integration

### Activon Businesses API
- **Endpoint**: `/n8n/webhook/businesses`
- **Authentication**: Bearer token
- **Data**: Business profiles, contacts, media
- **Caching**: 60-second revalidation

### API Client Features
- **Server-Side**: Full URL for SSR compatibility
- **Client-Side**: Environment-based URLs  
- **Error Handling**: Comprehensive error boundaries
- **Type Safety**: Full TypeScript coverage

## 🎯 SEO Optimization

### Meta Tags
- Dynamic titles and descriptions
- Open Graph for social sharing
- Twitter Cards for Twitter sharing
- Canonical URLs for SEO

### JSON-LD Structured Data
```json
{
  "@type": "LocalBusiness",
  "name": "Business Name",
  "description": "Business Description",
  "address": { ... },
  "contactPoint": { ... }
}
```

### Performance
- Image optimization with Next.js Image
- Lazy loading for images
- CDN-ready static assets
- Server-side rendering for SEO

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on git push

### Environment Variables for Production
```bash
ACTIVON_API_URL=https://api.activon.com/businesses
ACTIVON_BEARER_TOKEN=production_token
NEXT_PUBLIC_APP_URL=https://yoursite.com
```

### Custom Domains
Each business can have custom domains:
1. Set up DNS CNAME to point to your main domain
2. Configure domain routing in your hosting provider
3. Business accessible at `https://BusinessName.com`

## 🔍 Development Notes

### Key Features
- **Type-Safe**: Full TypeScript coverage
- **Responsive**: Mobile-first design approach  
- **Accessible**: WCAG compliance considerations
- **Performant**: Optimized images and caching
- **SEO-Ready**: Meta tags and structured data
- **RTL Support**: Hebrew/Arabic language ready

### Recent Updates
- Fixed environment variable loading issues
- Implemented Activon design guidelines
- Added glassmorphism effects throughout
- Optimized for one-section desktop layout
- Enhanced mobile-first responsive design

### Known Issues
- Next.js 15 viewport metadata warnings (resolved)
- Environment variables require correct directory setup
- API proxy needs absolute URLs for SSR

## 📞 Support

For development issues:
- Check console for API connection errors
- Verify environment variables are loaded
- Ensure server restart after env changes
- Test API endpoints directly: `/api/business`

## 🎨 Customization

### Modifying Design
- Edit `src/app/globals.css` for color scheme
- Update component styles in individual files
- Modify glassmorphism effects in CSS utilities
- Adjust responsive breakpoints as needed

### Adding Features
- New components go in `src/components/`
- API modifications in `src/lib/api.ts`
- Types in `src/types/business.ts`
- Utils in `src/lib/utils.ts`

## 🌟 Future Vision & Community Impact

### The Bigger Picture
Activon Provider Template is more than just business pages - it's building the infrastructure for community-driven commerce:

**Phase 1 (Current)**: **Professional Business Presence**
- Every business gets a beautiful, conversion-focused page
- Custom domains enable true brand ownership (`https://BusinessName.com`)
- Resilient design handles any level of business data

**Phase 2 (Roadmap)**: **Rich Service & Activity Discovery**
- Detailed activity cards with schedules, capacity, and booking
- Smart filtering by time, location, age, skill level, language
- Real-time availability and waitlist management
- Integrated payment and booking flows

**Phase 3 (Vision)**: **Community Ecosystem**
- Local business networks and referrals
- Community event integration
- Multi-language support for diverse communities
- Business analytics and growth insights

### Community-First Values
- **Hebrew/RTL Priority**: Authentic support for Middle Eastern communities
- **Small Business Focus**: Designed for local service providers, not enterprise
- **Accessibility**: WCAG compliant, mobile-first, touch-friendly
- **Data Privacy**: Secure API proxy protects business credentials
- **Open Source Philosophy**: Template can be adapted for any community

### Success Metrics
- **Business Growth**: Increased contact rates through optimized CTAs
- **Community Connection**: Local discovery and engagement
- **Professional Equity**: Every business looks polished, regardless of size
- **Cultural Authenticity**: RTL and Hebrew language support

### Why This Matters
In an era of complex websites and social media noise, Activon brings clarity:
- **One URL per business** = Easy sharing and discovery
- **Single page focus** = Clear action, no confusion
- **Community-centric** = Serves real local needs
- **Professionally designed** = Every business gets enterprise-quality presence

---

**Last Updated**: September 2025  
**Version**: 1.0.0  
**Framework**: Next.js 15.5.2 with App Router  
**Styling**: Tailwind CSS + Activon Design System  
**Mission**: Empowering communities through beautiful, conversion-focused business pages