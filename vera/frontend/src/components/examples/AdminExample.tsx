'use client';

import React from 'react';
import { useAdmin, LEGAL_DOMAINS, formatNumber } from '@/lib';
import FileUploader from '../FileUploader';
import DocTable from '../DocTable';
import LoadingSpinner from '../LoadingSpinner';

/**
 * Example component showing how to use the new API layer for admin functionality
 * This demonstrates the useAdmin hook and proper TypeScript integration
 */
export default function AdminExample() {
  const {
    isUploading,
    documents,
    documentsLoading,
    documentsError,
    healthLoading,
    healthError,
    uploadFile,
    refreshDocuments,
    checkSystemHealth,
    documentsStats,
    healthStatus,
  } = useAdmin();

  const handleFileUpload = async (file: File, domain: string) => {
    const result = await uploadFile(file, domain);
    if (result.success) {
      console.log('Upload successful:', result.data);
    } else {
      console.error('Upload failed:', result.error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-800">Admin Panel</h1>
        
        {/* Health Status */}
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
            healthStatus.isHealthy ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              healthStatus.isHealthy ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-sm font-medium">
              {healthStatus.isHealthy ? 'Healthy' : 'Unhealthy'}
            </span>
          </div>
          
          <button
            onClick={checkSystemHealth}
            disabled={healthLoading}
            className="p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <LoadingSpinner size="sm" className={healthLoading ? '' : 'hidden'} />
            <span className={healthLoading ? 'hidden' : ''}>🔄</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-800 mb-2">Documents</h3>
          <div className="text-3xl font-bold text-primary-600">
            {formatNumber(documentsStats.totalDocuments)}
          </div>
          <p className="text-sm text-neutral-600">Total indexed documents</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-800 mb-2">Vectors</h3>
          <div className="text-3xl font-bold text-sage-600">
            {formatNumber(documentsStats.totalVectors)}
          </div>
          <p className="text-sm text-neutral-600">Total vector embeddings</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-800 mb-2">Domains</h3>
          <div className="text-3xl font-bold text-accent-600">
            {Object.keys(documentsStats.domainStats).length}
          </div>
          <p className="text-sm text-neutral-600">Active legal domains</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">
              Upload Legal Document
            </h2>
            <p className="text-sm text-neutral-600 mb-6">
              Upload legal documents to expand NyayAI&apos;s knowledge base. 
              Supported formats: PDF, DOC, DOCX, TXT (max 50MB).
            </p>
            
            <FileUploader
              onUpload={handleFileUpload}
              disabled={isUploading}
              maxSize={50}
            />
            
            {isUploading && (
              <div className="mt-4 flex items-center gap-3 p-4 bg-primary-50 rounded-lg">
                <LoadingSpinner size="sm" />
                <span className="text-sm text-primary-700">Uploading document...</span>
              </div>
            )}
          </div>

          {/* Domain Stats */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Domain Distribution</h3>
            <div className="space-y-3">
              {Object.entries(documentsStats.domainStats).map(([domain, count]) => {
                const domainInfo = LEGAL_DOMAINS.find(d => d.value === domain);
                return (
                  <div key={domain} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${domainInfo?.color || 'bg-gray-100 text-gray-800'}`}>
                        {domainInfo?.label || domain}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-neutral-600">
                      {count} documents
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="space-y-6">
          <DocTable
            documents={documents}
            loading={documentsLoading}
            onRefresh={refreshDocuments}
          />

          {/* System Information */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">System Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">API Status</span>
                <span className={`text-sm font-medium ${
                  healthStatus.isHealthy ? 'text-green-600' : 'text-red-600'
                }`}>
                  {healthStatus.isHealthy ? 'Online' : 'Offline'}
                </span>
              </div>
              
              {healthStatus.version && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Version</span>
                  <span className="text-sm text-neutral-800">{healthStatus.version}</span>
                </div>
              )}
              
              {healthStatus.uptime && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Uptime</span>
                  <span className="text-sm text-neutral-800">
                    {Math.floor(healthStatus.uptime / 3600)}h {Math.floor((healthStatus.uptime % 3600) / 60)}m
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {(documentsError || healthError) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-red-800 mb-2">Errors:</h4>
          {documentsError && (
            <p className="text-sm text-red-700">Documents: {documentsError}</p>
          )}
          {healthError && (
            <p className="text-sm text-red-700">Health: {healthError}</p>
          )}
        </div>
      )}
    </div>
  );
}
