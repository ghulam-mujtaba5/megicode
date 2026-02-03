/**
 * Undo/Redo System & Command Palette
 * Advanced interaction patterns
 */
'use client';

import { useState, useCallback, useRef } from 'react';

// Undo/Redo history management
interface HistoryEntry<T> {
  state: T;
  timestamp: number;
  description: string;
}

interface UndoRedoState<T> {
  history: HistoryEntry<T>[];
  currentIndex: number;
}

export function useUndoRedo<T>(initialState: T, maxHistory = 50) {
  const [state, setState] = useState<UndoRedoState<T>>({
    history: [{ state: initialState, timestamp: Date.now(), description: 'Initial state' }],
    currentIndex: 0,
  });

  const updateState = useCallback(
    (newState: T, description = 'Update') => {
      setState((prev) => {
        const newHistory = prev.history.slice(0, prev.currentIndex + 1);
        const entry: HistoryEntry<T> = {
          state: newState,
          timestamp: Date.now(),
          description,
        };

        newHistory.push(entry);

        if (newHistory.length > maxHistory) {
          newHistory.shift();
        }

        return {
          history: newHistory,
          currentIndex: newHistory.length - 1,
        };
      });
    },
    [maxHistory]
  );

  const undo = useCallback(() => {
    setState((prev) => {
      if (prev.currentIndex > 0) {
        return { ...prev, currentIndex: prev.currentIndex - 1 };
      }
      return prev;
    });
  }, []);

  const redo = useCallback(() => {
    setState((prev) => {
      if (prev.currentIndex < prev.history.length - 1) {
        return { ...prev, currentIndex: prev.currentIndex + 1 };
      }
      return prev;
    });
  }, []);

  const clear = useCallback(() => {
    setState({ history: [{ state: initialState, timestamp: Date.now(), description: 'Cleared' }], currentIndex: 0 });
  }, [initialState]);

  const currentState = state.history[state.currentIndex]?.state;
  const canUndo = state.currentIndex > 0;
  const canRedo = state.currentIndex < state.history.length - 1;

  return {
    state: currentState,
    updateState,
    undo,
    redo,
    clear,
    canUndo,
    canRedo,
    history: state.history,
    currentIndex: state.currentIndex,
  };
}

// Command Palette (Cmd+K / Ctrl+K)
interface Command {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  category?: string;
  action: () => void;
  shortcut?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: Command[];
}

export function CommandPalette({ isOpen, onClose, commands }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fuzzy filter
  const filteredCommands = search
    ? commands.filter((cmd) => {
        const searchLower = search.toLowerCase();
        return (
          cmd.label.toLowerCase().includes(searchLower) ||
          cmd.description?.toLowerCase().includes(searchLower) ||
          cmd.category?.toLowerCase().includes(searchLower)
        );
      })
    : commands;

  const groupedCommands = filteredCommands.reduce(
    (acc, cmd) => {
      const category = cmd.category || 'General';
      if (!acc[category]) acc[category] = [];
      acc[category].push(cmd);
      return acc;
    },
    {} as Record<string, Command[]>
  );

  const handleExecute = (cmd: Command) => {
    cmd.action();
    onClose();
    setSearch('');
  };

  if (!isOpen) return null;

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999 }} />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '600px',
          background: 'var(--int-bg)',
          borderRadius: 'var(--int-radius)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          zIndex: 1000,
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeInScale 200ms ease-out',
        }}
      >
        {/* Search Input */}
        <div style={{ padding: 'var(--int-space-4)', borderBottom: '1px solid var(--int-border)' }}>
          <input
            ref={inputRef}
            autoFocus
            type="text"
            placeholder="Search commands..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose();
              if (e.key === 'Enter') {
                const cmd =
                  filteredCommands[selectedIndex] ||
                  Object.values(groupedCommands)
                    .flat()
                    .find((_, i) => i === selectedIndex);
                if (cmd) handleExecute(cmd);
              }
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
              }
              if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
              }
            }}
            style={{
              width: '100%',
              padding: 'var(--int-space-2) var(--int-space-3)',
              border: '1px solid var(--int-border)',
              borderRadius: 'var(--int-radius-sm)',
              fontSize: 'var(--int-text-base)',
              background: 'var(--int-bg-secondary)',
            }}
          />
        </div>

        {/* Commands List */}
        <div style={{ overflow: 'auto', maxHeight: 'calc(80vh - 100px)' }}>
          {Object.entries(groupedCommands).map(([category, cmds]) => (
            <div key={category}>
              <div
                style={{
                  padding: 'var(--int-space-3) var(--int-space-4)',
                  fontSize: 'var(--int-text-xs)',
                  fontWeight: 600,
                  color: 'var(--int-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  background: 'var(--int-bg-secondary)',
                }}
              >
                {category}
              </div>
              {cmds.map((cmd, idx) => (
                <button
                  key={cmd.id}
                  onClick={() => handleExecute(cmd)}
                  style={{
                    width: '100%',
                    padding: 'var(--int-space-3) var(--int-space-4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--int-space-3)',
                    background:
                      selectedIndex === idx || selectedIndex === filteredCommands.indexOf(cmd)
                        ? 'var(--int-primary)'
                        : 'transparent',
                    color: selectedIndex === idx ? 'white' : 'inherit',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: 'var(--int-text-sm)',
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  {cmd.icon && <span>{cmd.icon}</span>}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{cmd.label}</div>
                    {cmd.description && (
                      <div style={{ fontSize: 'var(--int-text-xs)', opacity: 0.7 }}>{cmd.description}</div>
                    )}
                  </div>
                  {cmd.shortcut && (
                    <kbd
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: 'rgba(0,0,0,0.2)',
                        fontSize: 'var(--int-text-xs)',
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      {cmd.shortcut}
                    </kbd>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: 'var(--int-space-2) var(--int-space-4)',
            borderTop: '1px solid var(--int-border)',
            fontSize: 'var(--int-text-xs)',
            color: 'var(--int-text-muted)',
          }}
        >
          Use ↑↓ to navigate, ↵ to select, ESC to close
        </div>
      </div>
    </>
  );
}

// Hook for command palette
export function useCommandPalette(commands: Command[]) {
  const [isOpen, setIsOpen] = useState(false);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    CommandPalette: <CommandPalette isOpen={isOpen} onClose={() => setIsOpen(false)} commands={commands} />,
  };
}
