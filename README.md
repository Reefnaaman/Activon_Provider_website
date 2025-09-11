# Activon Provider Template

A modern, responsive business profile template built with Next.js 15, featuring glassmorphism design, RTL support, and SEO optimization. This template renders beautiful single-page business profiles using the Activon Business API.

## ✨ Features

- **🎨 Modern Glassmorphism Design** - 2025-ready UI with glass effects, floating animations, and gradient overlays
- **🌐 RTL & Hebrew Support** - Full right-to-left layout support with Hebrew localization
- **📱 Fully Responsive** - Optimized for all screen sizes and devices
- **🔒 Secure API Integration** - Server-side proxy to protect API credentials
- **🚀 SEO Optimized** - Meta tags, Open Graph, Twitter Cards, and JSON-LD structured data
- **⚡ Performance First** - Image optimization, lazy loading, and caching strategies
- **♿ Accessible** - WCAG compliant with proper keyboard navigation and screen reader support
- **📸 Smart Gallery** - Lightbox view with responsive grid layout
- **🎯 Smart CTAs** - Intelligent contact method prioritization (WhatsApp → Call → Email)
- **🏷️ Dynamic Badges** - Service and activity count display with category information

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Docker and Docker Compose (for containerized deployment)
- Activon Business API access (webhook URL and bearer token)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd activon-provider-template
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
# Activon API Configuration
ACTIVON_API_URL=https://your-n8n-webhook-url
ACTIVON_BEARER_TOKEN=your-bearer-token-here

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) to see the business directory.

## 🐳 Docker Setup

### Running with Docker

For containerized deployment, use the provided Docker configuration:

#### Option 1: Docker Compose (Recommended)

1. **Start the application**:
```bash
docker-compose up --build
```

2. **Run in background**:
```bash
docker-compose up -d --build
```

3. **Stop the services**:
```bash
docker-compose down
```

#### Option 2: Docker Commands

1. **Build the Docker image**:
```bash
docker build -t activon-website .
```

2. **Run the container**:
```bash
docker run -d -p 3000:3000 --name activon-container activon-website
```

3. **View container status**:
```bash
docker ps
```

4. **Check logs**:
```bash
docker logs activon-container
```

5. **Stop the container**:
```bash
docker stop activon-container
```

### Docker Configuration

The Docker setup includes:

- **Multi-stage build** for optimized production images
- **Security best practices** with non-root user execution
- **Next.js standalone output** for minimal container size
- **Production environment** configuration
- **Health checks** and proper signal handling

### Environment Variables for Docker

When using Docker, you can pass environment variables:

```bash
docker run -d -p 3000:3000 \
  -e ACTIVON_API_URL=https://your-webhook-url \
  -e ACTIVON_BEARER_TOKEN=your-token \
  -e NEXT_PUBLIC_APP_URL=http://localhost:3000 \
  --name activon-container \
  activon-website
```

Or create a `.env` file and use it with Docker Compose:

```yaml
# docker-compose.yml
services:
  activon-website:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env
```

### Docker Files Structure

```
├── Dockerfile              # Multi-stage production build
├── docker-compose.yml      # Orchestration configuration  
└── .dockerignore           # Build context optimization
```

## 📖 Usage

### Viewing a Business Profile

Navigate to `/b/{business_id}` to view a specific business profile:
- `/b/17` - Example business profile
- `/b/45` - Hebrew swimming club example

### API Endpoints

The template includes a built-in API proxy:

- `GET /api/business?id={id}` - Fetch single business
- `GET /api/business?limit={limit}&offset={offset}` - Fetch business list

## 🏗️ Architecture

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/business/      # API proxy routes
│   ├── b/[id]/           # Business profile pages
│   ├── layout.tsx        # Root layout with RTL support
│   └── page.tsx          # Business directory
├── components/           # Reusable UI components
│   ├── Hero.tsx         # Business hero section
│   ├── CTASection.tsx   # Call-to-action buttons
│   ├── ServicesSection.tsx # Services/activities display
│   ├── Gallery.tsx      # Image gallery with lightbox
│   ├── ContactSection.tsx # Contact information
│   └── SEO.tsx         # Meta tags and structured data
├── lib/                 # Utility functions and logic
│   ├── api.ts          # API client functions
│   ├── normalize.ts    # Data normalization logic
│   ├── utils.ts        # Helper utilities
│   └── i18n.ts        # Internationalization support
└── types/              # TypeScript type definitions
    └── business.ts     # Business data types
```

### Data Flow

1. **API Request** → Server-side proxy → Activon API
2. **Data Normalization** → Raw API data → Typed, clean data structures
3. **Component Rendering** → Normalized data → UI components
4. **SEO Generation** → Business data → Meta tags + JSON-LD

### Key Design Patterns

- **Normalization Layer**: Transforms inconsistent API data into clean, typed structures
- **Component Composition**: Modular components with clear responsibilities
- **Progressive Enhancement**: Works without JavaScript, enhanced with interactions
- **Responsive First**: Mobile-first CSS with desktop enhancements

## 🎨 Design System

### Glassmorphism Classes

- `.glass-card` - Primary glass effect for cards
- `.glass-surface` - Subtle glass effect for surfaces
- `.glass-subtle` - Minimal glass effect for badges
- `.shadow-glass` / `.shadow-glass-lg` - Glass-compatible shadows
- `.hover-lift` - Smooth hover animations

### Modern Animations

- `.animate-float` - Floating animation for hero initials
- `.animate-glow` - Glowing effect for CTAs
- `.animate-shimmer` - Shimmer effect on glass cards
- `.hover-lift` - Interactive hover transformations

### Gradient System

- `.gradient-primary` - Purple-blue primary gradient
- `.gradient-secondary` - Orange-peach secondary gradient
- `.hero-gradient` - Multi-stop hero background

## 🌍 Internationalization

### Default Language
Hebrew (RTL) is the default locale with English (LTR) support available.

### Adding Languages

1. Extend `SupportedLocale` type in `src/types/business.ts`
2. Add translations to `translations` object in `src/lib/i18n.ts`
3. Configure locale direction in `localeConfig`

### RTL Support Features

- Automatic layout direction switching
- RTL-aware CSS utilities (`rtl:text-right`, `rtl:flex-row-reverse`)
- Hebrew typography and spacing optimization
- Proper text alignment and component mirroring

## 📊 SEO & Analytics

### Meta Tags
- Dynamic page titles: `{business.name} • Activon`
- Smart descriptions (truncated to 155 characters)
- Open Graph and Twitter Card support
- Automatic image optimization for social sharing

### Structured Data
JSON-LD LocalBusiness schema including:
- Business name and description
- Contact information (phone, email)
- Address with postal formatting
- Social media profiles
- Business images

### Analytics Ready
Built-in event tracking hooks for:
- CTA clicks (WhatsApp, Call, Email)
- Social media clicks
- Gallery interactions
- Address/map clicks

## 🔧 Customization

### Styling
- Modify CSS variables in `src/app/globals.css`
- Adjust glassmorphism opacity and blur values
- Customize color gradients and animations
- Update responsive breakpoints

### Components
- Each component accepts `locale` and `className` props
- Override component behavior by extending interfaces
- Add new sections by creating components and updating the page layout

### Business Logic
- Customize CTA prioritization in `src/lib/normalize.ts`
- Modify data normalization rules
- Add new business data fields and rendering logic
- Implement custom filtering and sorting

## 🚀 Deployment

### Docker Deployment (Recommended)

#### Production Docker Deployment
1. Build the production image:
```bash
docker build -t activon-website:latest .
```

2. Run with production environment:
```bash
docker run -d -p 3000:3000 \
  -e NODE_ENV=production \
  -e ACTIVON_API_URL=https://your-production-webhook \
  -e ACTIVON_BEARER_TOKEN=your-production-token \
  -e NEXT_PUBLIC_APP_URL=https://your-domain.com \
  --name activon-production \
  activon-website:latest
```

3. Or use Docker Compose for production:
```bash
docker-compose -f docker-compose.yml up -d
```

#### Container Orchestration
- **Docker Swarm**: Use the provided `docker-compose.yml`
- **Kubernetes**: Create deployment manifests based on the Docker image
- **AWS ECS/Fargate**: Deploy using the built container image
- **Google Cloud Run**: Direct deployment from container registry

### Vercel Deployment
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### Traditional Deployment
1. Build the project: `npm run build`
2. Set environment variables on your platform
3. Deploy the generated `.next` folder
4. Ensure Node.js runtime support

### Environment Variables
Required for production:
- `ACTIVON_API_URL` - Your Activon webhook endpoint
- `ACTIVON_BEARER_TOKEN` - API authentication token
- `NEXT_PUBLIC_APP_URL` - Your deployment URL

## 🧪 Development

### Running Tests
```bash
npm run test        # Run test suite
npm run test:watch  # Watch mode for development
```

### Linting
```bash
npm run lint        # Check code quality
npm run lint:fix    # Auto-fix linting issues
```

### Type Checking
```bash
npm run typecheck   # TypeScript verification
```

## 📱 Browser Support

- **Modern Browsers**: Full glassmorphism effects with backdrop-filter
- **Older Browsers**: Graceful degradation to solid backgrounds
- **Mobile Safari**: Optimized backdrop-filter performance
- **Progressive Enhancement**: Core functionality without JavaScript

## 🔒 Security

- **No Client-Side Secrets**: All API calls through server proxy
- **Input Validation**: Proper data sanitization and type checking
- **XSS Protection**: Safe HTML rendering with Next.js
- **HTTPS Only**: Secure connections for all external requests

## 🐛 Troubleshooting

### Common Issues

**Empty business directory:**
- Verify API credentials in `.env.local`
- Check if businesses have `is_active: true`
- Confirm API endpoint accessibility

**Images not loading:**
- Add your image domain to `next.config.js`
- Verify image URLs are publicly accessible
- Check Content Security Policy settings

**RTL layout issues:**
- Ensure `dir="rtl"` is set in HTML
- Use RTL-specific CSS utilities
- Test with Hebrew content

### Performance Issues

**Slow page loads:**
- Enable image optimization in Next.js config
- Implement proper caching headers
- Use lazy loading for gallery images

**Glass effects not working:**
- Check browser support for `backdrop-filter`
- Enable hardware acceleration
- Reduce blur values on mobile devices

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📞 Support

For questions or support:
- Create an issue on GitHub
- Review the troubleshooting section
- Check the technical specification document

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.