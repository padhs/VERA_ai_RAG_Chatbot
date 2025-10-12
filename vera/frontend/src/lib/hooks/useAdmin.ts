import { useState, useCallback, useEffect } from 'react';
import { UploadRequest } from '@/types/api';
import { useUploadDocument, useAdminDocuments, useHealthCheck } from './useApi';

// ============================================================================
// Admin Hook
// ============================================================================

export function useAdmin() {
  const [selectedDomain, setSelectedDomain] = useState<string>('general');
  const [isUploading, setIsUploading] = useState(false);
  
  // API hooks
  const uploadDocument = useUploadDocument();
  const adminDocuments = useAdminDocuments();
  const healthCheck = useHealthCheck();

  // Auto-fetch documents and health on mount
  useEffect(() => {
    adminDocuments.fetchDocuments();
    healthCheck.check();
  }, [adminDocuments, healthCheck]);

  // Upload a document
  const uploadFile = useCallback(async (file: File, domain: string) => {
    setIsUploading(true);
    
    try {
      const request: UploadRequest = {
        file,
        domain,
      };

      const { data, error } = await uploadDocument.upload(request);
      
      if (error) {
        throw new Error(error);
      }

      // Refresh documents list after successful upload
      await adminDocuments.fetchDocuments();
      
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      };
    } finally {
      setIsUploading(false);
    }
  }, [uploadDocument, adminDocuments]);

  // Refresh documents
  const refreshDocuments = useCallback(async () => {
    return adminDocuments.fetchDocuments();
  }, [adminDocuments]);

  // Check system health
  const checkSystemHealth = useCallback(async () => {
    return healthCheck.check();
  }, [healthCheck]);

  // Get documents statistics
  const getDocumentsStats = useCallback(() => {
    const documents = adminDocuments.data?.documents || [];
    const totalDocuments = documents.length;
    const totalVectors = documents.reduce((sum, doc) => sum + doc.vectors, 0);
    
    // Group by domain
    const domainStats = documents.reduce((acc, doc) => {
      const domain = doc.collection.split('_')[0] || 'general';
      acc[domain] = (acc[domain] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalDocuments,
      totalVectors,
      domainStats,
      documents,
    };
  }, [adminDocuments.data]);

  // Get health status
  const getHealthStatus = useCallback(() => {
    const health = healthCheck.data;
    if (!health) {
      return {
        status: 'unknown',
        message: 'Health status not available',
        isHealthy: false,
      };
    }

    return {
      status: health.status,
      message: health.service || 'Service status',
      isHealthy: health.status === 'healthy',
      version: health.version,
      uptime: health.uptime_seconds,
    };
  }, [healthCheck.data]);

  return {
    // State
    selectedDomain,
    isUploading,
    documents: adminDocuments.data?.documents || [],
    documentsLoading: adminDocuments.loading,
    documentsError: adminDocuments.error,
    healthLoading: healthCheck.loading,
    healthError: healthCheck.error,
    
    // Actions
    uploadFile,
    refreshDocuments,
    checkSystemHealth,
    setSelectedDomain,
    
    // Computed values
    documentsStats: getDocumentsStats(),
    healthStatus: getHealthStatus(),
  };
}
