# ドラッグ&ドロップ挿入位置インジケーター

## Meta

- Created: 2026-03-09
- Updated: 2026-03-09
- Status: draft
- Related: ColumnsBlock, useDnd.ts, Canvas.tsx

## Overview

ブロックをドラッグ中に、挿入可能な位置に青い線を表示し、どこに追加されるか視覚的にわかりやすくする。

## 問題点

現在の実装では：
- サイドバーからドロップ → 常に最後のセクション/列の末尾に追加
- どこに追加されるか視覚的なフィードバックがない
- ブロックとブロックの間に挿入できない

## 要件

### 機能要件

1. **ブロック間ドロップゾーン**
   - 各ブロックの上下にドロップゾーンを追加
   - ドロップゾーンは通常時は非表示
   - ドラッグ中のみ有効化

2. **視覚的インジケーター**
   - ドロップ可能な位置に青い線（2px）を表示
   - `isOver`状態で表示

3. **挿入位置の正確な制御**
   - ドロップゾーンのIDに位置情報を含める
   - 例: `section-{sectionId}-before-{blockId}`
   - 例: `section-{sectionId}-after-{blockId}`
   - 例: `column-{columnsBlockId}-{columnIndex}-before-{blockId}`

### 対象エリア

1. **セクション内のブロック間**
2. **列内のブロック間**
3. **空のセクション/列** - 既存の動作を維持

## 実装計画

### Phase 1: ドロップゾーンコンポーネント作成

**新規ファイル:** `src/features/editor/components/DropIndicator.tsx`

```tsx
interface DropIndicatorProps {
  id: string;
  position: 'before' | 'after';
}

export function DropIndicator({ id, position }: DropIndicatorProps) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`h-1 transition-all ${
        isOver ? 'bg-blue-500' : 'bg-transparent'
      }`}
    />
  );
}
```

### Phase 2: Canvas.tsx でドロップゾーンを追加

**セクション内:**
```tsx
{section.children.map((child, index) => (
  <>
    {index === 0 && (
      <DropIndicator
        id={`section-${section.id}-before-${child.id}`}
        position="before"
      />
    )}
    <DraggableBlock {...child} />
    <DropIndicator
      id={`section-${section.id}-after-${child.id}`}
      position="after"
    />
  </>
))}
```

**列内:**
```tsx
{column.children.map((child, index) => (
  <>
    {index === 0 && (
      <DropIndicator
        id={`column-${columnsBlockId}-${columnIndex}-before-${child.id}`}
        position="before"
      />
    )}
    <DraggableBlock {...child} />
    <DropIndicator
      id={`column-${columnsBlockId}-${columnIndex}-after-${child.id}`}
      position="after"
    />
  </>
))}
```

### Phase 3: useDnd.ts でドロップ位置を処理

```tsx
// Parse drop zone ID
if (String(overId).includes('-before-') || String(overId).includes('-after-')) {
  const parts = String(overId).split('-');
  const position = parts.includes('before') ? 'before' : 'after';
  const targetBlockId = parts[parts.length - 1];

  // Insert block at specific position
  insertBlockAt(parentId, targetBlockId, position, newBlock);
}
```

### Phase 4: documentStore に挿入関数を追加

```tsx
insertBlockAt: (parentId: string, targetBlockId: string, position: 'before' | 'after', block: Block) => {
  // セクション内のブロックを検索し、指定位置に挿入
}
```

## 検証計画

- [ ] セクション内のブロック間にドロップできる
- [ ] 列内のブロック間にドロップできる
- [ ] ドラッグ中に青い線が表示される
- [ ] ドロップ位置が正確
- [ ] 既存の末尾追加も引き続き動作

## Change Log

| Date | Changes |
|------|---------|
| 2026-03-09 | 初版作成 |
