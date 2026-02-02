/**
 * Storage Provider Interface
 *
 * Strategy Pattern を採用し、Cloudflare R2/S3/Vercel Blob 等のプロバイダーを
 * 切り替え可能にする。
 */

export interface UploadResult {
  url: string;
  id: string;
  thumbnailUrl?: string;
}

export interface StorageProvider {
  readonly name: string;
  uploadVideo(file: File): Promise<UploadResult>;
  uploadImage(file: File): Promise<UploadResult>;
  deleteFile(id: string): Promise<void>;
}

export type StorageProviderType = 'cloudflare' | 's3' | 'vercel-blob';

export interface StorageConfig {
  provider: StorageProviderType;
  maxVideoSize: number; // bytes
  maxImageSize: number; // bytes
  allowedVideoTypes: string[];
  allowedImageTypes: string[];
}

export const DEFAULT_STORAGE_CONFIG: StorageConfig = {
  provider: 'cloudflare',
  maxVideoSize: 100 * 1024 * 1024, // 100MB
  maxImageSize: 10 * 1024 * 1024, // 10MB
  allowedVideoTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
};
