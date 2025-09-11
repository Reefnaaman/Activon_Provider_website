# Data Inventory: Mock vs Real API Data

**Generated**: September 2025  
**Project**: Activon Provider Template  
**Purpose**: Document all placeholder/mock data vs real API data for future integration work

---

## 📊 Overview

This document provides a comprehensive inventory of all data sources in the Activon Provider Template, distinguishing between:
- **Real API Data**: Actually fetched from the Activon Businesses API
- **Mock/Placeholder Data**: Template-generated data for display purposes
- **Configuration Data**: Environment variables and static configurations
- **Fallback Data**: Default values when real data is unavailable

---

## 🔌 Real API Data (From Activon Businesses API)

### API Endpoint Configuration
**File**: `/src/app/api/business/route.ts`
**Status**: ✅ **REAL DATA**

```typescript
// Environment Variables (Real API Connection)
ACTIVON_API_URL=https://dev.activon.app/n8n/webhook/businesses
ACTIVON_BEARER_TOKEN=2be523aec9781c19a322a3c64ab2bde32c7b0d5d5c2869d95665ffe3c5ac4159
```

### Business Data Structure (Real)
**File**: `/src/types/business.ts`
**Status**: ✅ **REAL DATA**

The following data comes directly from the Activon API:
- `id: number` - Business unique identifier
- `name: string` - Business name
- `description?: string` - Business description
- `is_active: boolean` - Business active status
- `category_name?: string` - Business category
- `subcategory_name?: string` - Business subcategory
- `service_count: string | number` - Count of services (API can return string!)
- `activity_count: string | number` - Count of activities (API can return string!)

### Contact Information (Real)
**Files**: `/src/types/business.ts`, `/src/lib/normalize.ts`
**Status**: ✅ **REAL DATA**

```typescript
// Real API data structure
contact_object?: {
  emails?: Array<{
    email?: string;
    address?: string; // alternative field name
    value?: string;   // alternative field name  
    label?: string;
    isPrimary?: boolean;
  }>;
  phones?: Array<{
    number?: string;
    type?: string;
    label?: string;
    isPrimary?: boolean;
    hasWhatsApp?: boolean;
  }>;
  addresses?: Array<{
    street?: string;
    line1?: string;
    city?: string;
    state?: string;
    region?: string;
    country?: string;
    postalCode?: string;
    label?: string;
    type?: string;
    isPrimary?: boolean;
  }>;
};
```

### Media Data (Real)
**Files**: `/src/types/business.ts`, `/src/lib/normalize.ts`
**Status**: ✅ **REAL DATA**

```typescript
// Real API media structure
media_object?: {
  profile?: {
    mainImageId?: string;
  };
  images?: Array<{
    id: string | number;
    uri: string;
    order?: number;
    mimeType?: string;
    uploadedAt?: string;
  }>;
};
```

### Social Media Data (Real)
**Files**: `/src/types/business.ts`, `/src/lib/normalize.ts`
**Status**: ✅ **REAL DATA**

```typescript
// Real API social media structure
social_media_object?: {
  links?: Array<{
    url: string;
    platform?: string;
    isActive?: boolean;
  }>;
};
```

---

## 🎭 Mock/Placeholder Data (Template Generated)

### Service Templates (Mock)
**File**: `/src/lib/utils.ts` (lines 87-94)
**Status**: ❌ **MOCK DATA**

```typescript
export const getServiceTemplates = () => [
  { title: 'Monthly Orange Picking', description: 'Fresh seasonal oranges picked monthly from our organic groves', price: 'From $25' },
  { title: 'Home Garden Consultation', description: 'Expert advice on setting up your perfect home garden', price: 'From $75' },
  { title: 'Organic Produce Delivery', description: 'Weekly delivery of fresh, locally grown organic vegetables', price: 'Weekly' },
  { title: 'Seasonal Fruit Boxes', description: 'Curated selection of the finest seasonal fruits', price: 'Monthly' },
  { title: 'Garden Design Service', description: 'Professional garden planning and landscape design', price: 'Quote' },
  { title: 'Plant Care Workshop', description: 'Learn essential plant care and gardening techniques', price: 'Group rates' }
];
```

**⚠️ Integration Required**: Replace with real service data from API endpoint (when available)

### Activity Templates (Mock)
**File**: `/src/lib/utils.ts` (lines 96-101)
**Status**: ❌ **MOCK DATA**

```typescript
export const getActivityTemplates = () => [
  { title: 'Weekly Nature Walk', description: 'Guided nature walks exploring local flora and wildlife', duration: '2 hours' },
  { title: 'Family Farm Tours', description: 'Educational tours of our organic farm for the whole family', duration: '3 hours' },
  { title: 'Kids Gardening Club', description: 'Hands-on gardening activities for children ages 5-12', duration: '1.5 hours' },
  { title: 'Harvest Festival', description: 'Seasonal celebration with picking, tasting, and activities', duration: 'Full day' }
];
```

**⚠️ Integration Required**: Replace with real activity data from API endpoint (when available)

### Showcase Service Cards (Mock)
**File**: `/src/components/ServicesSection.tsx` (lines 76-90)
**Status**: ❌ **MOCK DATA - DUPLICATE**

**Note**: This is a duplicate of the service templates in `utils.ts` and should be consolidated.

### Gallery Placeholder Images (Mock)
**File**: `/src/components/Gallery.tsx` (lines 97-104)
**Status**: ❌ **MOCK DATA**

```typescript
// Placeholder images for businesses without gallery images
const placeholderImages = [
  'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=1920&h=1080&fit=crop&q=80',
  'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=1920&h=1080&fit=crop&q=80',
  'https://images.unsplash.com/photo-1576089172869-4f5f6f315620?w=1920&h=1080&fit=crop&q=80',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560785477-d43ff3facd2c?w=1920&h=1080&fit=crop&q=80',
  'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=1920&h=1080&fit=crop&q=80'
];
```

**⚠️ Integration Note**: These are fallback images when businesses lack sufficient gallery images.

### Service Showcase Images (Mock)
**File**: `/src/components/ServicesSection.tsx` (lines 104-111, 127-132)
**Status**: ❌ **MOCK DATA**

```typescript
// Service images (fallback when business has no gallery)
[
  'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=400&h=300&fit=crop&q=80', // Orange picking
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&q=80', // Garden consultation
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop&q=80', // Organic produce
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&q=80', // Fruit boxes
  'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&q=80', // Garden design
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&q=80'  // Plant care
]
```

**⚠️ Integration Required**: Should use real service images from API when available.

---

## ⚙️ Configuration Data

### Environment Variables
**File**: `/.env.local`
**Status**: ⚙️ **CONFIGURATION**

```bash
# Real API Configuration
ACTIVON_API_URL=https://dev.activon.app/n8n/webhook/businesses
ACTIVON_BEARER_TOKEN=2be523aec9781c19a322a3c64ab2bde32c7b0d5d5c2869d95665ffe3c5ac4159
NEXT_PUBLIC_APP_URL=http://localhost:3000

# External Services
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBz8i57SBBiF1uRDhNL-0TnZXpDVLQ_CZs
```

### Static UI Assets
**Status**: ⚙️ **CONFIGURATION**

- Map platform icons: `/public/icons/Google_maps.svg.png`, `/public/icons/Waze.png`
- These are static UI assets, not dynamic data

---

## 🔄 Hybrid Data (Real + Fallbacks)

### Hero Section Display
**File**: `/src/app/b/[id]/page.tsx`
**Status**: 🔄 **HYBRID**

- **Real Data**: `business.name`, `business.description`, `business.categoryName`
- **Fallback Logic**: Uses first letter of business name for initials when no hero image
- **Mock Element**: Generated initials display when no real hero image available

### CTA (Call-to-Action) Generation  
**File**: `/src/lib/normalize.ts` (lines 101-139)
**Status**: 🔄 **HYBRID**

- **Real Data**: Phone numbers, email addresses, WhatsApp flags
- **Template Logic**: Smart prioritization (WhatsApp → Call → Email → None)
- **Fallback**: "Contact" button with `disabled: true` when no contact info

### Business Services Display
**File**: `/src/lib/utils.ts` (lines 104-126)
**Status**: 🔄 **HYBRID**

- **Real Data**: `serviceCount`, `activityCount` from API  
- **Mock Data**: Service/activity names, descriptions, and details
- **Logic**: Uses real counts to determine how many mock templates to show

---

## 🔍 Integration Points & Recommendations

### High Priority - Service & Activity Data
**Current State**: Only counts are real; all details are mocked
**Files Affected**: 
- `/src/lib/utils.ts` (templates)
- `/src/components/ServicesSection.tsx` (showcase mode)

**Integration Required**:
1. Add API endpoints for:
   - `/api/business/{id}/services`
   - `/api/business/{id}/activities`
2. Update TypeScript types to include real service/activity objects
3. Replace template data with API calls

### Medium Priority - Image Galleries
**Current State**: Real images are used when available, Unsplash placeholders as fallbacks
**Files Affected**: 
- `/src/components/Gallery.tsx`
- `/src/components/ServicesSection.tsx`

**Integration Recommendations**:
1. Keep placeholder system for businesses with no images
2. Consider adding service-specific image fields to API
3. Implement image optimization and CDN integration

### Low Priority - UI Enhancements  
**Current State**: Template text and labels
**Files Affected**: Various component files

**Integration Options**:
1. Add customizable business page templates
2. Multi-language content from API
3. Business-specific branding options

---

## 📋 Quick Reference Checklist

### ✅ Fully Integrated (Real API Data)
- [x] Business basic info (name, description, category)
- [x] Contact information (emails, phones, addresses)  
- [x] Social media links
- [x] Media objects (hero image, gallery images)
- [x] Business active status
- [x] Service and activity counts

### ❌ Mock Data (Needs API Integration)
- [ ] Service details (names, descriptions, prices)
- [ ] Activity details (names, descriptions, durations)  
- [ ] Service-specific images
- [ ] Business-specific branding/theming

### 🔄 Hybrid (Real + Templates)
- [x] CTA button generation (real contact data + smart templates)
- [x] Gallery display (real images + placeholder fallbacks)
- [x] Service badges (real counts + template names)

---

## 🎯 Next Steps for Complete Integration

1. **API Endpoint Development**:
   - Create `/api/business/{id}/services` endpoint
   - Create `/api/business/{id}/activities` endpoint
   - Add service/activity image support to media API

2. **Type System Updates**:
   - Extend business types to include detailed service/activity objects
   - Add image references for services/activities
   - Remove mock template dependencies

3. **Component Updates**:
   - Replace `getServiceTemplates()` and `getActivityTemplates()` with API calls
   - Update `ServicesSection.tsx` to use real data
   - Implement loading states for service/activity data

4. **Testing & Validation**:
   - Test with businesses that have no services/activities
   - Verify fallback behavior still works
   - Ensure performance with large service/activity lists

---

**Status Legend**:
- ✅ **REAL DATA**: Comes from Activon API
- ❌ **MOCK DATA**: Template-generated placeholder data  
- ⚙️ **CONFIGURATION**: Environment variables and static configuration
- 🔄 **HYBRID**: Combination of real data with template logic/fallbacks