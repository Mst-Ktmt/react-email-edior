'use client';

import { ReactNode, useEffect, useCallback } from 'react';
import { Sidebar } from '../organisms/Sidebar';
import { Canvas } from '../organisms/Canvas';
import { PropertyPanel } from '../organisms/PropertyPanel';
import { KeyboardShortcutsHelp } from '../molecules/KeyboardShortcutsHelp';
import { DndProvider } from '@/features/editor/components/DndProvider';
import { useDocumentStore } from '@/stores';
import { useHistory } from '@/hooks/useHistory';
import { useClipboard } from '@/hooks/useClipboard';
import { createEmptyDocument } from '@/types/document';
import { loadFromLocalStorage } from '@/utils/saveLoad';
import type { EmailDocument } from '@/types';

interface EditorLayoutProps {
  header?: ReactNode;
}

export function EditorLayout({ header }: EditorLayoutProps) {
  const document = useDocumentStore((state) => state.document);
  const setDocument = useDocumentStore((state) => state.setDocument);

  // ドキュメント変更コールバック（Undo/Redo用）
  const handleDocumentChange = useCallback(
    (doc: EmailDocument) => {
      setDocument(doc);
    },
    [setDocument]
  );

  // Undo/Redo キーボードショートカット有効化
  useHistory({
    document,
    onDocumentChange: handleDocumentChange,
    enableKeyboardShortcuts: true,
  });

  // Copy/Paste キーボードショートカット有効化
  useClipboard({
    enableKeyboardShortcuts: true,
  });

  // 初期ドキュメント設定（localStorageから復元 or 空ドキュメント作成）
  useEffect(() => {
    if (!document) {
      // localStorageから復元を試みる
      const result = loadFromLocalStorage();
      if (result.success && result.data) {
        setDocument(result.data);
      } else {
        // 復元失敗時は空のドキュメントを作成
        setDocument(createEmptyDocument('doc_1', 'Untitled Email'));
      }
    }
  }, [document, setDocument]);

  return (
    <DndProvider>
      <div className="flex flex-col h-screen">
        {/* Header Bar */}
        {header && (
          <header className="h-14 flex-shrink-0 border-b border-gray-200 bg-white">
            {header}
          </header>
        )}

        {/* 3-Column Layout */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <Canvas />
          <PropertyPanel />
        </div>

        {/* Keyboard Shortcuts Help (Press ? to open) */}
        <KeyboardShortcutsHelp />
      </div>
    </DndProvider>
  );
}
