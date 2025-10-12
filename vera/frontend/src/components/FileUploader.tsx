'use client';

import React, { useState, useRef } from 'react';
import { FaUpload, FaFile, FaTimes } from 'react-icons/fa';
import DomainSelector from './DomainSelector';

interface FileUploaderProps {
  onUpload: (file: File, domain: string) => void;
  disabled?: boolean;
  acceptedTypes?: string;
  maxSize?: number; // in MB
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onUpload,
  disabled = false,
  acceptedTypes = '.pdf,.doc,.docx,.txt',
  maxSize = 10,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDomain, setSelectedDomain] = useState('general');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile, selectedDomain);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Domain Selector */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Legal Domain
        </label>
        <DomainSelector
          selectedDomain={selectedDomain}
          onDomainChange={setSelectedDomain}
          disabled={disabled}
        />
      </div>

      {/* File Upload Area */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Upload Legal Document
        </label>
        
        <div
          className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
            isDragOver
              ? 'border-primary-500 bg-primary-50'
              : 'border-neutral-300 hover:border-neutral-400'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes}
            onChange={handleFileInputChange}
            disabled={disabled}
            className="hidden"
          />
          
          {selectedFile ? (
            <div className="flex items-center justify-center gap-3">
              <FaFile className="w-8 h-8 text-primary-500" />
              <div className="text-left">
                <p className="text-sm font-medium text-neutral-800">{selectedFile.name}</p>
                <p className="text-xs text-neutral-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
                className="p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <FaTimes size={14} />
              </button>
            </div>
          ) : (
            <div>
              <FaUpload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
              <p className="text-sm text-neutral-600 mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-neutral-500">
                PDF, DOC, DOCX, TXT (max {maxSize}MB)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Button */}
      {selectedFile && (
        <button
          onClick={handleUpload}
          disabled={disabled}
          className="w-full bg-primary-500 text-white py-3 px-4 rounded-xl hover:bg-primary-600 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-all duration-200 btn-hover"
        >
          Upload Document
        </button>
      )}
    </div>
  );
};

export default FileUploader;
