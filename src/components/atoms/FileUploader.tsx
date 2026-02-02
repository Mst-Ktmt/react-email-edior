'use client';

import { useRef, useState, useId, type ChangeEvent, type DragEvent } from 'react';

export interface UploadResult {
  url: string;
  id: string;
  thumbnailUrl?: string;
}

export interface FileUploaderProps {
  label: string;
  accept: string;
  onUpload: (result: UploadResult) => void;
  onError: (error: Error) => void;
  uploadEndpoint: string;
  maxSize?: number;
  disabled?: boolean;
  className?: string;
}

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export function FileUploader({
  label,
  accept,
  onUpload,
  onError,
  uploadEndpoint,
  maxSize,
  disabled = false,
  className = '',
}: FileUploaderProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleUpload = async (file: File) => {
    if (maxSize && file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      onError(new Error(`File size exceeds ${maxSizeMB}MB limit`));
      return;
    }

    setStatus('uploading');
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      const result: UploadResult = await response.json();
      setStatus('success');
      setProgress(100);
      onUpload(result);

      setTimeout(() => {
        setStatus('idle');
        setProgress(0);
      }, 2000);
    } catch (error) {
      setStatus('error');
      onError(error instanceof Error ? error : new Error('Upload failed'));

      setTimeout(() => {
        setStatus('idle');
        setProgress(0);
      }, 3000);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleClick = () => {
    if (!disabled && status === 'idle') {
      inputRef.current?.click();
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'uploading':
        return 'Uploading...';
      case 'success':
        return 'Uploaded!';
      case 'error':
        return 'Failed';
      default:
        return 'Click or drag file here';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'uploading':
        return 'border-blue-400 bg-blue-50';
      case 'success':
        return 'border-green-400 bg-green-50';
      case 'error':
        return 'border-red-400 bg-red-50';
      default:
        return isDragOver
          ? 'border-blue-400 bg-blue-50'
          : 'border-gray-300 bg-white hover:border-gray-400';
    }
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={id} className="text-xs font-medium text-gray-600">
        {label}
      </label>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        onChange={handleChange}
        disabled={disabled || status === 'uploading'}
        className="hidden"
      />
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative flex flex-col items-center justify-center
          px-4 py-3 rounded-md border-2 border-dashed
          cursor-pointer transition-colors
          ${getStatusColor()}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {status === 'uploading' && (
          <div
            className="absolute bottom-0 left-0 h-1 bg-blue-500 rounded-b transition-all"
            style={{ width: `${progress}%` }}
          />
        )}
        <svg
          className={`w-6 h-6 mb-1 ${
            status === 'success'
              ? 'text-green-500'
              : status === 'error'
                ? 'text-red-500'
                : 'text-gray-400'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {status === 'success' ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          ) : status === 'error' ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          )}
        </svg>
        <span className="text-xs text-gray-600">{getStatusText()}</span>
      </div>
    </div>
  );
}
