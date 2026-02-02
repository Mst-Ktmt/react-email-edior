import { NextRequest, NextResponse } from 'next/server';
import { getStorageProvider, getStorageConfig, validateFile } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const config = getStorageConfig();
    const validation = validateFile(file, 'image', config);

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const provider = getStorageProvider();
    const result = await provider.uploadImage(file);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Image upload error:', error);
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

