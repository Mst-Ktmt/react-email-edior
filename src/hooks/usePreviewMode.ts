import { useUIStore, CANVAS_WIDTH } from '@/stores/uiStore';

export function usePreviewMode() {
  const previewMode = useUIStore((state) => state.previewMode);
  const setPreviewMode = useUIStore((state) => state.setPreviewMode);
  const togglePreviewMode = useUIStore((state) => state.togglePreviewMode);

  const canvasWidth = CANVAS_WIDTH[previewMode];
  const isDesktop = previewMode === 'desktop';
  const isMobile = previewMode === 'mobile';

  return {
    previewMode,
    setPreviewMode,
    togglePreviewMode,
    canvasWidth,
    isDesktop,
    isMobile,
  };
}
