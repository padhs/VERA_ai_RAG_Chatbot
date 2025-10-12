import { useState, useCallback } from 'react';
import { ApiState } from '@/types/api';

// ============================================================================
// Generic API Hook
// ============================================================================

export function useApi<T>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await apiCall();
      setState({ data, loading: false, error: null });
      return { data, error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { data: null, error: errorMessage };
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// ============================================================================
// Specific API Hooks
// ============================================================================

import { 
  UploadRequest, 
  UploadResponse, 
  QueryRequest, 
  QueryResponse, 
  AdminDocsResponse, 
  HealthStatus 
} from '@/types/api';
import { 
  uploadDocument, 
  queryAssistant, 
  getAdminDocuments, 
  checkHealth 
} from '@/lib/api';

/**
 * Hook for uploading documents
 */
export function useUploadDocument() {
  const api = useApi<UploadResponse>();

  const upload = useCallback(async (request: UploadRequest) => {
    return api.execute(() => uploadDocument(request));
  }, [api]);

  return {
    ...api,
    upload,
  };
}

/**
 * Hook for querying the assistant
 */
export function useQueryAssistant() {
  const api = useApi<QueryResponse>();

  const query = useCallback(async (request: QueryRequest) => {
    return api.execute(() => queryAssistant(request));
  }, [api]);

  return {
    ...api,
    query,
  };
}

/**
 * Hook for fetching admin documents
 */
export function useAdminDocuments() {
  const api = useApi<AdminDocsResponse>();

  const fetchDocuments = useCallback(async () => {
    return api.execute(() => getAdminDocuments());
  }, [api]);

  return {
    ...api,
    fetchDocuments,
  };
}

/**
 * Hook for health checks
 */
export function useHealthCheck() {
  const api = useApi<HealthStatus>();

  const check = useCallback(async () => {
    return api.execute(() => checkHealth());
  }, [api]);

  return {
    ...api,
    check,
  };
}
