'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { DayPicker, DateRange } from 'react-day-picker';
import { Popover } from '@/components/Popover';
import styles from './DatePicker.module.css';
import 'react-day-picker/dist/style.css';

interface DateRangePickerProps {
  date?: DateRange;
  onSelect?: (date: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function DateRangePicker({ date, onSelect, placeholder = "Pick a date range", className }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      trigger={
        <button
          type="button"
          className={`${styles.trigger} ${!date?.from ? styles.placeholder : ''} ${className || ''}`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginRight: '8px' }}
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
              </>
            ) : (
              format(date.from, 'LLL dd, y')
            )
          ) : (
            placeholder
          )}
        </button>
      }
      contentClassName={styles.content}
    >
      <DayPicker
        mode="range"
        selected={date}
        onSelect={onSelect}
        showOutsideDays
        className={styles.calendar}
        numberOfMonths={2}
      />
    </Popover>
  );
}
