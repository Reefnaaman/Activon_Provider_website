import { NextRequest, NextResponse } from 'next/server';
import { ServicesApiResponse } from '@/types/business';

const ACTIVON_API_URL = process.env.ACTIVON_API_URL;
const ACTIVON_BEARER_TOKEN = process.env.ACTIVON_BEARER_TOKEN;

if (!ACTIVON_API_URL || !ACTIVON_BEARER_TOKEN) {
  console.error('Missing required environment variables: ACTIVON_API_URL and ACTIVON_BEARER_TOKEN');
}

// Disable SSL verification for development (the dev API has a self-signed certificate)
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const businessId = searchParams.get('business_id');

    if (!businessId) {
      return NextResponse.json(
        { success: false, error: 'business_id parameter is required' },
        { status: 400 }
      );
    }

    if (!ACTIVON_API_URL || !ACTIVON_BEARER_TOKEN) {
      return NextResponse.json(
        { success: false, error: 'API configuration missing' },
        { status: 500 }
      );
    }

    // Fetch services from the Activon API
    // ACTIVON_API_URL is the base URL for businesses, we need to append /services
    const baseUrl = ACTIVON_API_URL.replace(/\/$/, ''); // Remove trailing slash if present
    const url = `${baseUrl}/services?business_id=${businessId}`;
    
    console.log('Fetching services from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ACTIVON_BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`Failed to fetch services for business ${businessId}:`, response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      
      return NextResponse.json(
        { success: false, error: `Failed to fetch services: ${response.statusText}` },
        { status: response.status }
      );
    }

    const services: ServicesApiResponse = await response.json();

    // Return the services directly (they're already in the correct format)
    return NextResponse.json(services);

  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
