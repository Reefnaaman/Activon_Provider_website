import { BusinessApiResponse, BusinessListApiResponse, ServicesApiResponse } from '@/types/business';

// Use full URLs for both server-side and client-side requests
const getApiBase = () => {
  if (typeof window === 'undefined') {
    // Server-side: use full URL to localhost
    // Check for the actual port the server is running on
    const port = process.env.PORT || '3001';
    return `http://localhost:${port}/api`;
  } else {
    // Client-side: use relative URL for better compatibility
    return '/api';
  }
};

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Response
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string): Promise<T> {
  const apiBase = getApiBase();
  const url = `${apiBase}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.error || `HTTP ${response.status}`,
      response.status,
      response
    );
  }

  return response.json();
}

export async function fetchBusiness(id: number): Promise<BusinessApiResponse> {
  return fetchApi<BusinessApiResponse>(`/business?id=${id}`);
}

export async function fetchBusinessList(
  limit?: number,
  offset?: number
): Promise<BusinessListApiResponse> {
  const params = new URLSearchParams();
  if (limit) params.set('limit', limit.toString());
  if (offset) params.set('offset', offset.toString());
  
  return fetchApi<BusinessListApiResponse>(`/business${params.toString() ? `?${params}` : ''}`);
}

export async function fetchBusinessServices(businessId: number): Promise<ServicesApiResponse> {
  return fetchApi<ServicesApiResponse>(`/business/services?business_id=${businessId}`);
}