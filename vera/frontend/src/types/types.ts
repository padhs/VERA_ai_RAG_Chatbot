// ============================================================================
// API Request & Response Interfaces
// ============================================================================

export interface QueryRequest {
  query: string;
  domain: string;
}

export interface Citation {
  act: string;
  section?: string;
  source_file?: string;
  page?: number;
}

export interface QueryResponse {
  answer: string;
  citations: Citation[];
  retrieved_chunks: number;
  generation_model: string;
  embedding_model: string;
  vector_db: string;
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

export interface AdminDoc {
  id: string;
  name: string;
  domain: LegalDomain;
  vectors: number;
  collection: string;
  filename?: string;
  indexed_at?: string;
}