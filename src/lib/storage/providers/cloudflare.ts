/**
 * Cloudflare R2 Storage Provider
 *
 * Cloudflare R2 は S3 互換 API を提供する。
 * 無料枠: 10GB ストレージ、Class A 100万回/月、Class B 1000万回/月
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import type { StorageProvider, UploadResult } from '../types';

interface CloudflareConfig {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicUrl: string;
}

function getConfig(): CloudflareConfig {
  const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;
  const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName || !publicUrl) {
    throw new Error(
      'Cloudflare R2 configuration is incomplete. Required env vars: ' +
        'CLOUDFLARE_R2_ACCOUNT_ID, CLOUDFLARE_R2_ACCESS_KEY_ID, ' +
        'CLOUDFLARE_R2_SECRET_ACCESS_KEY, CLOUDFLARE_R2_BUCKET_NAME, CLOUDFLARE_R2_PUBLIC_URL'
    );
  }

  return { accountId, accessKeyId, secretAccessKey, bucketName, publicUrl };
}

function createClient(config: CloudflareConfig): S3Client {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
}

function generateFileId(prefix: string, originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  const ext = originalName.split('.').pop() ?? '';
  return `${prefix}/${timestamp}-${random}.${ext}`;
}

async function uploadFile(
  client: S3Client,
  config: CloudflareConfig,
  file: File,
  prefix: string
): Promise<UploadResult> {
  const fileId = generateFileId(prefix, file.name);
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const command = new PutObjectCommand({
    Bucket: config.bucketName,
    Key: fileId,
    Body: buffer,
    ContentType: file.type,
    ContentLength: file.size,
  });

  await client.send(command);

  const url = `${config.publicUrl.replace(/\/$/, '')}/${fileId}`;

  return {
    url,
    id: fileId,
  };
}

export function createCloudflareProvider(): StorageProvider {
  const config = getConfig();
  const client = createClient(config);

  return {
    name: 'cloudflare',

    async uploadVideo(file: File): Promise<UploadResult> {
      return uploadFile(client, config, file, 'videos');
    },

    async uploadImage(file: File): Promise<UploadResult> {
      return uploadFile(client, config, file, 'images');
    },

    async deleteFile(id: string): Promise<void> {
      const command = new DeleteObjectCommand({
        Bucket: config.bucketName,
        Key: id,
      });
      await client.send(command);
    },
  };
}
