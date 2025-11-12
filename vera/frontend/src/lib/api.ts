import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { QueryRequest, QueryResponse } from '@/types/types';

// ============================================================================
// API Client Configuration
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// ============================================================================
// Request Interceptor
// ============================================================================

apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// ============================================================================
// Response Interceptor
// ============================================================================

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  (error) => {
    console.error('[API Response Error]', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ============================================================================
// API Endpoints
// ============================================================================

export const api = {
  /**
   * Send a query to the legal AI assistant
   */
  query: async (data: QueryRequest): Promise<QueryResponse> => {
    const response = await apiClient.post<QueryResponse>('/api/v1/query', data);
    return response.data;
  },

  /**
   * Check backend health status
   */
  health: async (): Promise<{ status: string }> => {
    const response = await apiClient.get<{ status: string }>('/api/v1/health');
    return response.data;
  },
};

export default apiClient;