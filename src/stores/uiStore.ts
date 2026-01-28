import { create } from 'zustand';

type PreviewMode = 'desktop' | 'mobile';

interface UIState {
  previewMode: PreviewMode;
  sidebarCollapsed: boolean;
  propertyPanelCollapsed: boolean;
  isShowPreview: boolean;
}

interface UIActions {
  setPreviewMode: (mode: PreviewMode) => void;
  togglePreviewMode: () => void;
  toggleSidebar: () => void;
  togglePropertyPanel: () => void;
  toggleShowPreview: () => void;
  setShowPreview: (show: boolean) => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>((set) => ({
  // State
  previewMode: 'desktop',
  sidebarCollapsed: false,
  propertyPanelCollapsed: false,
  isShowPreview: false,

  // Actions
  setPreviewMode: (mode) => set({ previewMode: mode }),
  togglePreviewMode: () =>
    set((state) => ({
      previewMode: state.previewMode === 'desktop' ? 'mobile' : 'desktop',
    })),
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  togglePropertyPanel: () =>
    set((state) => ({ propertyPanelCollapsed: !state.propertyPanelCollapsed })),
  toggleShowPreview: () =>
    set((state) => ({ isShowPreview: !state.isShowPreview })),
  setShowPreview: (show) => set({ isShowPreview: show }),
}));

// Canvas width constants
export const CANVAS_WIDTH = {
  desktop: 600,
  mobile: 375,
} as const;
