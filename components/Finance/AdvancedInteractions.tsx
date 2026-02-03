/**
 * Advanced Interactive Components
 * Context menus, popovers, drag-drop, gestures
 */
'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';

// Context Menu (right-click menu)
interface ContextMenuItem {
  label: string;
  icon?: string;
  onClick: () => void;
  divider?: boolean;
  disabled?: boolean;
  variant?: 'default' | 'danger' | 'warning';
}

interface ContextMenuProps {
  isOpen: boolean;
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

export function ContextMenu({ isOpen, x, y, items, onClose }: ContextMenuProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999,
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: y,
          left: x,
          background: 'var(--int-bg)',
          borderRadius: 'var(--int-radius)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          minWidth: '200px',
          zIndex: 1000,
          overflow: 'hidden',
          animation: 'fadeInScale 150ms ease-out',
        }}
      >
        {items.map((item, idx) => {
          if (item.divider) {
            return (
              <div
                key={idx}
                style={{
                  height: '1px',
                  background: 'var(--int-border)',
                  margin: 'var(--int-space-1) 0',
                }}
              />
            );
          }

          const colors = {
            default: { bg: 'transparent', text: 'inherit', hoverBg: 'var(--int-bg-secondary)' },
            danger: { bg: 'transparent', text: 'var(--int-error)', hoverBg: 'var(--int-error-light)' },
            warning: { bg: 'transparent', text: 'var(--int-warning)', hoverBg: 'var(--int-warning-light)' },
          };

          const color = colors[item.variant || 'default'];

          return (
            <button
              key={idx}
              onClick={() => {
                item.onClick();
                onClose();
              }}
              disabled={item.disabled}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--int-space-2)',
                padding: 'var(--int-space-2) var(--int-space-3)',
                background: color.bg,
                color: color.text,
                border: 'none',
                fontSize: 'var(--int-text-sm)',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
                opacity: item.disabled ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.background = color.hoverBg;
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.background = color.bg;
              }}
            >
              {item.icon && <span>{item.icon}</span>}
              {item.label}
            </button>
          );
        })}
      </div>
    </>
  );
}

// Hook for context menu
export function useContextMenu() {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  return {
    contextMenu,
    handleContextMenu,
    closeContextMenu: () => setContextMenu(null),
  };
}

// Popover component
interface PopoverProps {
  isOpen: boolean;
  trigger: ReactNode;
  content: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  onClose: () => void;
}

export function Popover({ isOpen, trigger, content, position = 'bottom', onClose }: PopoverProps) {
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (triggerRef.current) {
      setTriggerRect(triggerRef.current.getBoundingClientRect());
    }
  }, [isOpen]);

  const getPosition = () => {
    if (!triggerRect) return { top: 0, left: 0 };

    const spacing = 8;

    switch (position) {
      case 'top':
        return { top: triggerRect.top - spacing, left: triggerRect.left + triggerRect.width / 2 };
      case 'bottom':
        return { top: triggerRect.bottom + spacing, left: triggerRect.left + triggerRect.width / 2 };
      case 'left':
        return { top: triggerRect.top + triggerRect.height / 2, left: triggerRect.left - spacing };
      case 'right':
        return { top: triggerRect.top + triggerRect.height / 2, left: triggerRect.right + spacing };
    }
  };

  return (
    <>
      <div ref={triggerRef}>{trigger}</div>
      {isOpen && (
        <>
          <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 99 }} />
          <div
            style={{
              position: 'fixed',
              ...getPosition(),
              background: 'var(--int-bg)',
              borderRadius: 'var(--int-radius)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
              padding: 'var(--int-space-4)',
              zIndex: 100,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {content}
          </div>
        </>
      )}
    </>
  );
}

// Draggable list item
interface DragItem {
  id: string;
  data: any;
}

interface DraggableListProps {
  items: DragItem[];
  onReorder: (items: DragItem[]) => void;
  renderItem: (item: DragItem, index: number, isDragging: boolean) => ReactNode;
}

export function DraggableList({ items, onReorder, renderItem }: DraggableListProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [reorderedItems, setReorderedItems] = useState(items);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;

    const newItems = [...reorderedItems];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setReorderedItems(newItems);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null) {
      onReorder(reorderedItems);
    }
    setDraggedIndex(null);
  };

  return (
    <div>
      {reorderedItems.map((item, idx) => (
        <div
          key={item.id}
          draggable
          onDragStart={() => handleDragStart(idx)}
          onDragOver={(e) => {
            e.preventDefault();
            handleDragOver(idx);
          }}
          onDragEnd={handleDragEnd}
          style={{
            opacity: draggedIndex === idx ? 0.5 : 1,
            transition: 'all 200ms ease-out',
            cursor: 'grab',
          }}
        >
          {renderItem(item, idx, draggedIndex === idx)}
        </div>
      ))}
    </div>
  );
}

// Swipe gesture detection
interface UseSwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
}

export function useSwipe({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
}: UseSwipeOptions) {
  const startX = useRef(0);
  const startY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;

    const deltaX = endX - startX.current;
    const deltaY = endY - startY.current;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) onSwipeRight?.();
        else onSwipeLeft?.();
      }
    } else {
      if (Math.abs(deltaY) > threshold) {
        if (deltaY > 0) onSwipeDown?.();
        else onSwipeUp?.();
      }
    }
  };

  return { handleTouchStart, handleTouchEnd };
}

// Gesture detector wrapper
interface GestureDetectorProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export function GestureDetector({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
}: GestureDetectorProps) {
  const { handleTouchStart, handleTouchEnd } = useSwipe({
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
  });

  return (
    <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {children}
    </div>
  );
}
