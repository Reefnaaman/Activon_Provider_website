# Services & Activities System Redesign

## Overview
The document describes the migration to the API live data for business services and activities.
This Document will describe the technical changes made for the web app, all the api and design flows and concepts are to be implemented in the mobile views.
Complete transformation from hard-coded service templates to a dynamic, API-driven services and activities system with enhanced user experience and proper Hebrew localization.

## Main points for implementation

Do not use any of the hard coded data, only the api.
Keep the slug support the business ID.
Always set main colors for the pages, and not spesific components.
Always consider the docker file.


## 🎯 Key Objectives Achieved

### 1. **Dynamic Data Integration**
- Replaced hard-coded service templates with real API data
- Integrated with `/api/business/services` endpoint
- Real-time service and activity information display

### 2. **Enhanced User Experience**
- Interactive service selection with visual feedback
- Separate activities view for each service
- Improved navigation and clear visual hierarchy

### 3. **Multilingual Support**
- Proper Hebrew translations throughout
- RTL/LTR text direction handling
- Cultural adaptation of UI elements

---

## 🔄 Architecture Changes

### **Before: Hard-Coded Templates**
```typescript
const serviceTemplates = [
  { title: 'Monthly Orange Picking', description: '...', price: 'From $25' },
  { title: 'Home Garden Consultation', description: '...', price: 'From $75' },
  // ... more hard-coded data
];
```

### **After: Dynamic API Integration**
```typescript
// Real API call
const services = await fetchBusinessServices(businessId);

// Dynamic rendering based on actual data
services.forEach(service => {
  // Display real service with actual activities
  service.activities.forEach(activity => {
    // Show real pricing, capacity, descriptions
  });
});
```

---

## 🎨 Design System Updates

### **Visual Hierarchy**

#### **Services Section**
- **Header**: "Our Services" with animated scroll hint
- **Cards**: Clean card design with real images from API
- **Selection State**: Blue highlighting for selected services
- **Interactive Elements**: "View Activities" buttons on all services

#### **Activities Section**
- **Header**: "Our Activities" (החוגים שלנו) in rounded rectangle
- **Context**: "Activities for [Service Name]" with activity count
- **Navigation**: "Clear Selection" button to return to services
- **Cards**: Consistent styling with services, showing real pricing

### **Color Palette**
```css
/* Selection & Highlights */
--selected-bg: rgba(46, 111, 242, 0.2);
--selected-border: rgba(46, 111, 242, 0.5);
--highlight-shadow: rgba(46, 111, 242, 0.2);

/* Service Cards */
--service-bg: #0D1117;
--service-border: rgba(255, 255, 255, 0.1);
--service-hover: #161B22;

/* Activity Icons */
--activity-icon: #2E6FF2;
```

### **Typography**
- **Headers**: `font-heading` with proper tracking
- **Service Titles**: `font-subheading` with hover color transitions
- **Descriptions**: `font-body` with optimized line heights
- **Buttons**: `font-ui` with consistent tracking

---

## 🎭 User Experience Flow

### **1. Initial State**
```
Services Section (Always Visible)
├── Service Card 1 [View Activities]
├── Service Card 2 [View Activities] 
└── Service Card 3 [View Activities]
```

### **2. Service Selection**
```
Services Section (With Selection)
├── Service Card 1 [HIGHLIGHTED] ← Selected
├── Service Card 2 [View Activities]
└── Service Card 3 [View Activities]

Activities Section (Appears Below)
├── Header: "Our Activities" (החוגים שלנו)
├── Context: "Activities for Service 1"
├── Activity Card 1 [Contact Us]
├── Activity Card 2 [Contact Us]
└── [Clear Selection] Button
```

### **3. Empty State (No Activities)**
```
Activities Section
├── Header: "Our Activities" (החוגים שלנו)
├── Beautiful Empty State Card
│   ├── Gradient Background
│   ├── Activity Icon
│   ├── "No Activities Available" Message
│   ├── Encouraging Description
│   └── [Back to Services] Button
```

---

## 📱 Responsive Design

### **Desktop Layout**
- **Grid System**: 3-column grid for service/activity cards
- **Dual Sections**: Services always visible, activities appear below
- **Hover Effects**: Scale transforms and shadow enhancements
- **Visual Separation**: Clear spacing between sections

### **Mobile Layout**
- **Horizontal Scroll**: Touch-optimized card scrolling
- **Navigation Hints**: Scroll indicators and counters
- **Touch Targets**: Optimized button sizes (44px minimum)
- **Compact Cards**: Reduced padding and font sizes

---

## 🌐 Localization Features

### **Hebrew Support (עברית)**
| Element | English | Hebrew |
|---------|---------|---------|
| Activities Header | "Our Activities" | "החוגים שלנו" |
| Contact Button | "Contact Us" | "צרו קשר" |
| Back Navigation | "Back to Services" | "חזרה לשירותים" |
| Clear Selection | "Clear Selection" | "בטל בחירה" |
| Empty State | "No Activities Available" | "אין חוגים זמינים" |
| WhatsApp CTA | "Send WhatsApp Message" | "שלח הודעה בוואטסאפ" |
| Call CTA | "Call" | "התקשר" |

### **RTL/LTR Handling**
- Automatic text direction detection
- Proper flex direction adjustments
- Icon and button positioning adaptation

---

## 💬 Contact Integration

### **Contact Popup Modal**
Triggered by "Contact Us" buttons in activity cards:

#### **Information Display**
- **Phone**: Number with label and direct call link
- **Email**: Address with label
- **Address**: Full address with location icon

#### **Action Buttons**
- **WhatsApp**: Direct message with proper number formatting
- **Call**: One-click phone dialing
- **Google Maps**: Navigation link with encoded address
- **Waze**: Alternative navigation option

#### **Technical Implementation**
- **React Portal**: Renders at document body level
- **Z-Index**: Maximum priority (`z-[99999]`)
- **Backdrop**: Click-outside-to-close functionality
- **Animations**: Smooth scale and opacity transitions

---

## 🔧 Technical Improvements

### **API Integration**
```typescript
// New Services API Endpoint
GET /api/business/services?business_id={id}

// Response Structure
{
  service_id: number,
  service_title: string,
  service_description: string,
  service_media_object: { images: [...] },
  activities: [
    {
      id: number,
      title: string,
      description: string,
      pricing_object: { options: [...] },
      max_capacity: number
    }
  ]
}
```

### **State Management**
```typescript
// Component State
const [selectedService, setSelectedService] = useState<Service | null>(null);
const [viewMode, setViewMode] = useState<'services' | 'activities'>('services');
const [showContactPopup, setShowContactPopup] = useState(false);
```

### **Performance Optimizations**
- **Lazy Loading**: Images load only when needed
- **Memoization**: Expensive calculations cached
- **Portal Rendering**: Contact modal rendered at body level
- **Event Delegation**: Efficient click handling

---

## 🎯 Business Impact

### **User Engagement**
- **Clearer Information**: Real service details instead of generic templates
- **Better Navigation**: Intuitive service → activities flow
- **Direct Contact**: One-click contact options in context
- **Visual Appeal**: Professional card-based design

### **Content Management**
- **Dynamic Updates**: Services reflect real business offerings
- **Scalability**: System handles any number of services/activities
- **Localization**: Proper Hebrew support for Israeli market
- **Maintenance**: No more manual template updates

### **Conversion Optimization**
- **Contextual CTAs**: Contact buttons appear when users show interest
- **Multiple Contact Options**: Phone, WhatsApp, email, navigation
- **Clear Pricing**: Real pricing information displayed
- **Professional Presentation**: Enhanced business credibility

---

## 📊 Before vs After Comparison

| Aspect | Before | After |
|--------|--------|-------|
| **Data Source** | Hard-coded templates | Real API data |
| **Service Count** | Fixed 6 services | Dynamic based on business |
| **Activities** | Generic placeholders | Real activities with pricing |
| **Languages** | English only | English + Hebrew (עברית) |
| **Contact Flow** | Generic "Learn More" | Contextual "Contact Us" popup |
| **Visual Design** | Static cards | Interactive with selection states |
| **Mobile Experience** | Basic responsive | Optimized touch interface |
| **Content Updates** | Manual code changes | Automatic via API |

---

## 🚀 Future Enhancements

### **Potential Additions**
- **Booking Integration**: Direct activity booking from cards
- **Calendar View**: Show activity schedules and availability  
- **Reviews System**: Customer feedback on activities
- **Social Sharing**: Share specific services/activities
- **Favorites**: Save preferred activities for later
- **Filtering**: Filter activities by price, duration, capacity

### **Technical Improvements**
- **Caching Strategy**: Implement service data caching
- **Image Optimization**: Lazy loading and WebP format
- **Analytics**: Track service/activity engagement
- **A/B Testing**: Test different card layouts and CTAs

---

## 📝 Development Notes

### **Key Files Modified**
- `src/components/ServicesSection.tsx` - Main component redesign
- `src/app/b/[id]/page.tsx` - Service data fetching integration
- `src/app/api/business/services/route.ts` - New API endpoint
- `src/types/business.ts` - Service and Activity type definitions
- `src/lib/api.ts` - API client functions
- `src/components/mobile/MobileHero.tsx` - Mobile service badges

### **Dependencies Added**
- React DOM Portal for modal rendering
- Enhanced TypeScript types for API responses

### **Environment Configuration**
- SSL certificate handling for dev environment
- API endpoint configuration via environment variables

---

