'use client';

import React from 'react';
import { LegalDomain, LEGAL_DOMAINS } from '@/types/api';

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
      className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
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