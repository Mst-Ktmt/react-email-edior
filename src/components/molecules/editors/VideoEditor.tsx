'use client';

import { useState } from 'react';
import type { VideoBlockProps } from '@/types';
import {
  PropertySection,
  SpacingEditor,
  AlignEditor,
  TextInput,
  NumberInput,
  ColorPicker,
  FileUploader,
  type UploadResult,
} from '../PropertyEditor';

export interface VideoEditorProps {
  props: VideoBlockProps;
  onChange: (props: Partial<VideoBlockProps>) => void;
}

export function VideoEditor({ props, onChange }: VideoEditorProps) {
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleVideoUpload = (result: UploadResult) => {
    onChange({ videoUrl: result.url });
    setUploadError(null);
  };

  const handleThumbnailUpload = (result: UploadResult) => {
    onChange({ thumbnailSrc: result.url });
    setUploadError(null);
  };

  const handleUploadError = (error: Error) => {
    setUploadError(error.message);
  };

  return (
    <>
      <PropertySection title="Video">
        <FileUploader
          label="Upload Video"
          accept="video/mp4,video/webm,video/quicktime"
          uploadEndpoint="/api/upload/video"
          onUpload={handleVideoUpload}
          onError={handleUploadError}
          maxSize={100 * 1024 * 1024}
        />
        <TextInput
          label="Video URL"
          value={props.videoUrl}
          onChange={(value) => onChange({ videoUrl: value })}
          placeholder="https://youtube.com/watch?v=..."
        />
        <FileUploader
          label="Upload Thumbnail"
          accept="image/jpeg,image/png,image/gif,image/webp"
          uploadEndpoint="/api/upload/image"
          onUpload={handleThumbnailUpload}
          onError={handleUploadError}
          maxSize={10 * 1024 * 1024}
        />
        <TextInput
          label="Thumbnail URL"
          value={props.thumbnailSrc}
          onChange={(value) => onChange({ thumbnailSrc: value })}
          placeholder="https://..."
        />
        {uploadError && (
          <p className="text-xs text-red-500">{uploadError}</p>
        )}
        <TextInput
          label="Alt Text"
          value={props.alt}
          onChange={(value) => onChange({ alt: value })}
          placeholder="Video description"
        />
      </PropertySection>
      <PropertySection title="Layout">
        <NumberInput
          label="Width"
          value={typeof props.width === 'number' ? props.width : 100}
          onChange={(value) => onChange({ width: value })}
          min={0}
          max={600}
          unit="px"
        />
        <AlignEditor
          label="Alignment"
          value={props.align}
          onChange={(value) => onChange({ align: value })}
        />
      </PropertySection>
      <PropertySection title="Style">
        <NumberInput
          label="Border Radius"
          value={props.borderRadius}
          onChange={(value) => onChange({ borderRadius: value })}
          min={0}
          max={100}
          unit="px"
        />
        <ColorPicker
          label="Play Button Color"
          value={props.playButtonColor}
          onChange={(value) => onChange({ playButtonColor: value })}
        />
      </PropertySection>
      <PropertySection title="General">
        <SpacingEditor
          label="Padding"
          value={props.padding}
          onChange={(value) => onChange({ padding: value })}
        />
      </PropertySection>
    </>
  );
}
