import { NextRequest, NextResponse } from 'next/server';
import { BusinessApiResponse, BusinessListApiResponse } from '@/types/business';

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
    const id = searchParams.get('id');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    if (!ACTIVON_API_URL || !ACTIVON_BEARER_TOKEN) {
      return NextResponse.json(
        { success: false, error: 'API configuration missing' },
        { status: 500 }
      );
    }

    // Always fetch all businesses from the API (since it returns a list)
    const url = `${ACTIVON_API_URL}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ACTIVON_BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
      // Add caching headers
      next: {
        revalidate: 60, // Revalidate every 60 seconds
      },
    });

    if (!response.ok) {
      console.error(`API request failed: ${response.status} ${response.statusText}`);
      const responseText = await response.text();
      console.error('Response body:', responseText.slice(0, 500));
      return NextResponse.json(
        { success: false, error: 'Failed to fetch business data' },
        { status: response.status }
      );
    }

    // Check content type before parsing JSON
    const contentType = response.headers.get('content-type');
    console.log('Response content-type:', contentType);
    
    if (!contentType?.includes('application/json')) {
      const responseText = await response.text();
      console.error('Non-JSON response received:', responseText.slice(0, 500));
      return NextResponse.json(
        { success: false, error: 'API returned non-JSON response (possible incorrect endpoint)' },
        { status: 500 }
      );
    }

    const data = await response.json();
    
    // Assume the API returns an array of businesses directly or wrapped in a data property
    let businessList;
    if (Array.isArray(data)) {
      businessList = data;
    } else if (data.data && Array.isArray(data.data)) {
      businessList = data.data;
    } else {
      console.error('Unexpected API response format:', data);
      return NextResponse.json(
        { success: false, error: 'Invalid API response format' },
        { status: 500 }
      );
    }
    
    if (id) {
      // Filter for single business by ID
      const businessId = parseInt(id);
      const business = businessList.find((b: any) => b.id === businessId);
      
      if (!business) {
        return NextResponse.json(
          { success: false, error: 'Business not found' },
          { status: 404 }
        );
      }
      
      // Return single business response
      return NextResponse.json({
        success: true,
        data: business
      } as BusinessApiResponse, {
        headers: {
          'Cache-Control': 's-maxage=60, stale-while-revalidate',
        },
      });
    } else {
      // Apply pagination if requested
      let filteredList = businessList;
      
      if (limit || offset) {
        const limitNum = limit ? parseInt(limit) : filteredList.length;
        const offsetNum = offset ? parseInt(offset) : 0;
        filteredList = filteredList.slice(offsetNum, offsetNum + limitNum);
      }
      
      // Return business list response
      return NextResponse.json({
        success: true,
        data: filteredList
      } as BusinessListApiResponse, {
        headers: {
          'Cache-Control': 's-maxage=60, stale-while-revalidate',
        },
      });
    }
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}