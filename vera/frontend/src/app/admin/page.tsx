'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaGavel, FaArrowLeft, FaHeartbeat, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import FileUploader from '@/components/FileUploader';
import DocTable from '@/components/DocTable';
import LoadingSpinner from '@/components/LoadingSpinner';
import { apiEndpoints } from '@/lib/axios';
import type { AdminDoc } from '@/types/types';
import PageContainer from '@/components/layout/PageContainer';

interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  message?: string;
  timestamp?: string;
}

export default function AdminPage() {
  const [documents, setDocuments] = useState<AdminDoc[]>([]);
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [isLoadingHealth, setIsLoadingHealth] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
    checkHealth();
  }, []);

  const fetchDocuments = async () => {
    setIsLoadingDocs(true);
    try {
      const response = await apiEndpoints.getDocs();
      setDocuments(response.data || []);
    } catch (error: unknown) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to fetch documents');
    } finally {
      setIsLoadingDocs(false);
    }
  };

  const checkHealth = async () => {
    setIsLoadingHealth(true);
    try {
      await apiEndpoints.health();
      setHealthStatus({
        status: 'healthy',
        message: 'Service is running normally',
        timestamp: new Date().toISOString(),
      });
    } catch (error: unknown) {
      console.error('Health check failed:', error);
      setHealthStatus({
        status: 'unhealthy',
        message: 'Service is not responding',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoadingHealth(false);
    }
  };

  const handleFileUpload = async (file: File, domain: string) => {
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('domain', domain);

    try {
      await apiEndpoints.upload(formData);
      
      toast.success('Document uploaded successfully!');
      
      // Refresh documents list
      await fetchDocuments();
      
      // Reset form
      return true;
    } catch (error: unknown) {
      console.error('Upload error:', error);
      
      const errorMessage = (error as { response?: { data?: { message?: string; detail?: string } } }).response?.data?.message || 
        (error as { response?: { data?: { message?: string; detail?: string } } }).response?.data?.detail || 
        'Failed to upload document';
      
      toast.error(errorMessage);
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  const getHealthStatusColor = () => {
    if (!healthStatus) return 'text-neutral-500';
    return healthStatus.status === 'healthy' ? 'text-green-600' : 'text-red-600';
  };

  const getHealthStatusIcon = () => {
    if (!healthStatus) return <LoadingSpinner size="sm" />;
    return healthStatus.status === 'healthy' ? 
      <FaCheckCircle className="text-green-600" size={16} /> : 
      <FaExclamationTriangle className="text-red-600" size={16} />;
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <PageContainer maxWidth="7xl" padding="none">
        {/* Admin Header */}
        <div className="bg-white border-b border-neutral-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-neutral-600 hover:text-primary-600 transition-colors"
              >
                <FaArrowLeft size={16} />
                Back
              </Link>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <FaGavel className="text-white" size={16} />
                </div>
                <h1 className="text-xl font-semibold text-neutral-800">Admin Panel</h1>
              </div>
            </div>

            {/* Health Status */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-neutral-100 rounded-lg">
                <FaHeartbeat size={14} />
                <span className="text-sm font-medium text-neutral-700">System Status:</span>
                <div className="flex items-center gap-2">
                  {getHealthStatusIcon()}
                  <span className={`text-sm font-medium ${getHealthStatusColor()}`}>
                    {healthStatus?.status === 'healthy' ? 'Healthy' : 
                     healthStatus?.status === 'unhealthy' ? 'Unhealthy' : 'Checking...'}
                  </span>
                </div>
              </div>
              
              <button
                onClick={checkHealth}
                disabled={isLoadingHealth}
                className="p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
              >
                <LoadingSpinner size="sm" className={isLoadingHealth ? '' : 'hidden'} />
                <FaHeartbeat size={14} className={isLoadingHealth ? 'hidden' : ''} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h2 className="text-lg font-semibold text-neutral-800 mb-4">
                Upload Legal Document
              </h2>
              <p className="text-sm text-neutral-600 mb-6">
                Upload legal documents to expand NyayAI&apos;s knowledge base. Supported formats: PDF, DOC, DOCX, TXT.
              </p>
              
              <FileUploader
                onUpload={handleFileUpload}
                disabled={isUploading}
                maxSize={50} // 50MB max
              />
              
              {isUploading && (
                <div className="mt-4 flex items-center gap-3 p-4 bg-primary-50 rounded-lg">
                  <LoadingSpinner size="sm" />
                  <span className="text-sm text-primary-700">Uploading document...</span>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-primary-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600">
                    {documents.length}
                  </div>
                  <div className="text-sm text-primary-700">Documents</div>
                </div>
                <div className="text-center p-4 bg-sage-50 rounded-lg">
                  <div className="text-2xl font-bold text-sage-600">
                    {documents.reduce((sum, doc) => sum + doc.vectors, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-sage-700">Total Vectors</div>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="space-y-6">
            <DocTable
              documents={documents}
              loading={isLoadingDocs}
              onRefresh={fetchDocuments}
            />

            {/* System Information */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">System Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">API Status</span>
                  <div className="flex items-center gap-2">
                    {getHealthStatusIcon()}
                    <span className={`text-sm font-medium ${getHealthStatusColor()}`}>
                      {healthStatus?.status === 'healthy' ? 'Online' : 
                       healthStatus?.status === 'unhealthy' ? 'Offline' : 'Checking...'}
                    </span>
                  </div>
                </div>
                
                {healthStatus?.timestamp && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600">Last Check</span>
                    <span className="text-sm text-neutral-800">
                      {new Date(healthStatus.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Environment</span>
                  <span className="text-sm text-neutral-800">
                    {process.env.NODE_ENV === 'production' ? 'Production' : 'Development'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white rounded-xl border border-neutral-200 p-6">
          <h3 className="text-lg font-semibold text-neutral-800 mb-4">Need Help?</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-neutral-50 rounded-lg">
              <h4 className="font-medium text-neutral-800 mb-2">Upload Guidelines</h4>
              <p className="text-sm text-neutral-600">
                Ensure documents are in PDF, DOC, DOCX, or TXT format. Maximum file size is 50MB.
              </p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg">
              <h4 className="font-medium text-neutral-800 mb-2">Domain Selection</h4>
              <p className="text-sm text-neutral-600">
                Choose the appropriate legal domain to help NyayAI provide more accurate responses.
              </p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg">
              <h4 className="font-medium text-neutral-800 mb-2">Document Processing</h4>
              <p className="text-sm text-neutral-600">
                Documents are automatically processed and indexed for optimal search performance.
              </p>
            </div>
          </div>
        </div>
        </div>
      </PageContainer>
    </div>
  );
}
