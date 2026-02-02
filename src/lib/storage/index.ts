/**
 * Storage Provider Factory
 *
 * 環境変数 STORAGE_PROVIDER でプロバイダーを切り替え可能。
 * デフォルトは cloudflare。
 */

import type { StorageProvider, StorageProviderType, StorageConfig } from './types';
import { DEFAULT_STORAGE_CONFIG } from './types';
import { createCloudflareProvider } from './providers';

export type { StorageProvider, StorageProviderType, StorageConfig, UploadResult } from './types';
export { DEFAULT_STORAGE_CONFIG } from './types';

let cachedProvider: StorageProvider | null = null;

function getProviderType(): StorageProviderType {
  const provider = process.env.STORAGE_PROVIDER as StorageProviderType | undefined;
  return provider ?? 'cloudflare';
}

export function getStorageProvider(): StorageProvider {
  if (cachedProvider) {
    return cachedProvider;
  }

  const providerType = getProviderType();

  switch (providerType) {
    case 'cloudflare':
      cachedProvider = createCloudflareProvider();
      break;
    case 's3':
      throw new Error('S3 provider is not implemented yet');
    case 'vercel-blob':
      throw new Error('Vercel Blob provider is not implemented yet');
    default:
      throw new Error(`Unknown storage provider: ${providerType}`);
  }

  return cachedProvider;
}

export function getStorageConfig(): StorageConfig {
  return {
    ...DEFAULT_STORAGE_CONFIG,
    provider: getProviderType(),
  };
}

export function validateFile(
  file: File,
  type: 'video' | 'image',
  config: StorageConfig = DEFAULT_STORAGE_CONFIG
): { valid: boolean; error?: string } {
  const maxSize = type === 'video' ? config.maxVideoSize : config.maxImageSize;
  const allowedTypes = type === 'video' ? config.allowedVideoTypes : config.allowedImageTypes;

  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return { valid: false, error: `File size exceeds ${maxSizeMB}MB limit` };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `File type ${file.type} is not allowed` };
  }

  return { valid: true };
}
