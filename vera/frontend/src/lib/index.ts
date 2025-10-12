// ============================================================================
// API Client Exports
// ============================================================================

export { default as apiClient, uploadDocument, queryAssistant, getAdminDocuments, checkHealth } from './api';

// ============================================================================
// Hooks Exports
// ============================================================================

export { useApi, useUploadDocument, useQueryAssistant, useAdminDocuments, useHealthCheck } from './hooks/useApi';
export { useChat } from './hooks/useChat';
export { useAdmin } from './hooks/useAdmin';

// ============================================================================
// Types Exports
// ============================================================================

export type {
  UploadRequest,
  UploadResponse,
  QueryRequest,
  QueryResponse,
  AdminDoc,
  AdminDocsResponse,
  HealthStatus,
  ApiError,
  ApiResponse,
  LoadingState,
  ApiState,
} from '@/types/api';

export type { ChatMessage } from './hooks/useChat';

// ============================================================================
// Constants Exports
// ============================================================================

export { 
  LEGAL_DOMAINS, 
  API_CONFIG, 
  UPLOAD_CONFIG, 
  UI_CONFIG, 
  CHAT_CONFIG,
  getDomainInfo,
  formatFileSize,
  formatDate,
  formatNumber,
} from './utils/constants';

export type { LegalDomain } from './utils/constants';
