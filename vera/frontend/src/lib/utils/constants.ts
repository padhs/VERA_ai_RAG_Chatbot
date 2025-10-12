// ============================================================================
// Legal Domains
// ============================================================================

export interface LegalDomain {
  value: string;
  label: string;
  description: string;
  color: string;
}

export const LEGAL_DOMAINS: LegalDomain[] = [
  {
    value: 'general',
    label: 'General Law',
    description: 'General legal queries and basic law concepts',
    color: 'bg-gray-100 text-gray-800',
  },
  {
    value: 'criminal',
    label: 'Criminal Law',
    description: 'Criminal offenses, procedures, and penalties',
    color: 'bg-red-100 text-red-800',
  },
  {
    value: 'corporate',
    label: 'Corporate Law',
    description: 'Business law, companies act, and corporate governance',
    color: 'bg-blue-100 text-blue-800',
  },
  {
    value: 'it',
    label: 'IT Law',
    description: 'Technology law, cyber security, and digital rights',
    color: 'bg-purple-100 text-purple-800',
  },
  {
    value: 'family',
    label: 'Family Law',
    description: 'Marriage, divorce, custody, and family matters',
    color: 'bg-pink-100 text-pink-800',
  },
  {
    value: 'property',
    label: 'Property Law',
    description: 'Real estate, land rights, and property transactions',
    color: 'bg-green-100 text-green-800',
  },
  {
    value: 'labor',
    label: 'Labor Law',
    description: 'Employment law, workplace rights, and labor disputes',
    color: 'bg-yellow-100 text-yellow-800',
  },
  {
    value: 'tax',
    label: 'Tax Law',
    description: 'Taxation, financial regulations, and compliance',
    color: 'bg-indigo-100 text-indigo-800',
  },
  {
    value: 'constitutional',
    label: 'Constitutional Law',
    description: 'Constitutional rights, duties, and fundamental principles',
    color: 'bg-orange-100 text-orange-800',
  },
  {
    value: 'environmental',
    label: 'Environmental Law',
    description: 'Environmental protection, regulations, and sustainability',
    color: 'bg-emerald-100 text-emerald-800',
  },
];

// ============================================================================
// API Configuration
// ============================================================================

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// ============================================================================
// File Upload Configuration
// ============================================================================

export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_TYPES: ['.pdf', '.doc', '.docx', '.txt'],
  ALLOWED_MIME_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ],
} as const;

// ============================================================================
// UI Constants
// ============================================================================

export const UI_CONFIG = {
  TOAST_DURATION: 4000,
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
  PAGINATION_SIZE: 10,
} as const;

// ============================================================================
// Chat Configuration
// ============================================================================

export const CHAT_CONFIG = {
  MAX_MESSAGE_LENGTH: 2000,
  MAX_HISTORY_MESSAGES: 50,
  TYPING_INDICATOR_DELAY: 1000,
  AUTO_SCROLL_THRESHOLD: 100,
} as const;

// ============================================================================
// Utility Functions
// ============================================================================

export function getDomainInfo(domainValue: string): LegalDomain | undefined {
  return LEGAL_DOMAINS.find(domain => domain.value === domainValue);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}
