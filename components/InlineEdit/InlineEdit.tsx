'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './InlineEdit.module.css';

interface InlineEditProps {
  value: string;
  onSave: (newValue: string) => Promise<void>;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
}

export function InlineEdit({ value, onSave, className, style, placeholder }: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (currentValue.trim() === value) {
      setIsEditing(false);
      return;
    }

    if (!currentValue.trim()) {
      // Don't save empty values, revert
      setCurrentValue(value);
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(currentValue);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save:', error);
      // Optionally show error toast here
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setCurrentValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        disabled={isSaving}
        className={`${styles.input} ${className || ''}`}
        style={style}
        placeholder={placeholder}
        onClick={(e) => e.stopPropagation()} // Prevent navigation if inside a link
      />
    );
  }

  return (
    <span
      onClick={(e) => {
        e.preventDefault(); // Prevent navigation if inside a link
        e.stopPropagation();
        setIsEditing(true);
      }}
      className={`${styles.display} ${className || ''}`}
      style={style}
      title="Click to edit"
    >
      {value}
    </span>
  );
}
