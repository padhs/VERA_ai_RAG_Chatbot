// ============================================================================
// API Request & Response Interfaces
// ============================================================================

export interface ChatRequest {
  question: string;
}

export interface ChatResponse {
  answer: string;
  sources: string[];
  fallback?: boolean;
  reason?: string;
  error?: string;
  status?: string;
  message?: string;
}

// ============================================================================
// Chat Message Interface
// ============================================================================

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

// ============================================================================
// Error Handling
// ============================================================================

export interface ApiError {
  message: string;
  status?: number;
  details?: string;
}

// ============================================================================
// Domain Constants
// ============================================================================

export const LEGAL_DOMAINS = [
  'it_act',
  'criminal_law', 
  'environment_law',
  'rbi_guidelines'
] as const;

export type LegalDomain = typeof LEGAL_DOMAINS[number];