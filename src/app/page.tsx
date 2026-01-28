'use client';

import { useCallback } from 'react';
import { Eye, Edit } from 'lucide-react';
import { useTranslations } from '@/components/providers/LocaleProvider';
import { EditorLayout } from '@/components/templates/EditorLayout';
import { ExportButton, generateEmailHtml } from '@/features/export';
import { LocaleSwitcher } from '@/components/atoms/LocaleSwitcher';
import { UndoRedoButtons } from '@/components/molecules/UndoRedoButtons';
import { SaveLoadButtons } from '@/components/molecules/SaveLoadButtons';
import { useDocumentStore } from '@/stores/documentStore';
import { useHistoryStore } from '@/stores/historyStore';
import { useUIStore } from '@/stores/uiStore';

function EditorHeader() {
  const t = useTranslations('Header');
  const document = useDocumentStore((state) => state.document);
  const setDocument = useDocumentStore((state) => state.setDocument);
  const isDirty = useDocumentStore((state) => state.isDirty);

  // Preview mode state
  const isShowPreview = useUIStore((state) => state.isShowPreview);
  const toggleShowPreview = useUIStore((state) => state.toggleShowPreview);

  // Undo/Redo state
  const canUndo = useHistoryStore((state) => state.canUndo);
  const canRedo = useHistoryStore((state) => state.canRedo);
  const historyUndo = useHistoryStore((state) => state.undo);
  const historyRedo = useHistoryStore((state) => state.redo);

  const handleUndo = useCallback(() => {
    if (!document) return;
    const previousDocument = historyUndo(document);
    if (previousDocument) {
      setDocument(previousDocument);
    }
  }, [document, historyUndo, setDocument]);

  const handleRedo = useCallback(() => {
    if (!document) return;
    const nextDocument = historyRedo(document);
    if (nextDocument) {
      setDocument(nextDocument);
    }
  }, [document, historyRedo, setDocument]);

  // Load design handler
  const handleLoad = useCallback(
    (loadedDocument: typeof document) => {
      if (loadedDocument) {
        setDocument(loadedDocument);
      }
    },
    [setDocument]
  );

  const handleDownloadHtml = useCallback(() => {
    if (!document) return;

    const html = generateEmailHtml(document);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = globalThis.document.createElement('a');
    link.href = url;
    link.download = `${document.name || 'email-export'}.html`;
    globalThis.document.body.appendChild(link);
    link.click();
    globalThis.document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [document]);

  const isExportDisabled = !document || document.sections.length === 0;

  return (
    <div className="flex items-center justify-between h-full px-4">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-gray-800">{t('title')}</h1>
        <UndoRedoButtons
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={handleUndo}
          onRedo={handleRedo}
        />
      </div>
      <div className="flex items-center gap-3">
        <SaveLoadButtons
          document={document}
          onLoad={handleLoad}
        />
        <div className="w-px h-6 bg-gray-300" />
        {isDirty && (
          <span className="text-sm text-amber-600">Unsaved changes</span>
        )}
        <button
          type="button"
          onClick={toggleShowPreview}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isShowPreview
              ? 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
              : 'text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-gray-500'
          }`}
        >
          {isShowPreview ? (
            <>
              <Edit className="w-4 h-4" />
              {t('backToEdit')}
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              {t('showPreview')}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleDownloadHtml}
          disabled={isExportDisabled}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Download HTML
        </button>
        <ExportButton document={document} />
        <LocaleSwitcher />
      </div>
    </div>
  );
}

export default function Home() {
  return <EditorLayout header={<EditorHeader />} />;
}
