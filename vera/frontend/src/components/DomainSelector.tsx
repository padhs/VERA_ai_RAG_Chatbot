'use client';

import React from 'react';
import { LegalDomain, LEGAL_DOMAINS } from '@/types/types';

interface DomainSelectorProps {
  selectedDomain: LegalDomain;
  onDomainChange: (domain: LegalDomain) => void;
  disabled?: boolean;
}

const DomainSelector: React.FC<DomainSelectorProps> = ({
  selectedDomain,
  onDomainChange,
  disabled = false,
}) => {
  const formatDomainName = (domain: LegalDomain): string => {
    return domain
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <select
      value={selectedDomain}
      onChange={(e) => onDomainChange(e.target.value as LegalDomain)}
      disabled={disabled}
      className="px-3 py-2 border border-neutral-800 rounded-lg bg-neutral-900 text-neutral-50 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed h-[52px]"
    >
      {LEGAL_DOMAINS.map((domain) => (
        <option key={domain} value={domain}>
          {formatDomainName(domain)}
        </option>
      ))}
    </select>
  );
};

export default DomainSelector;