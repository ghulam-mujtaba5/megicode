'use client';

import { useState } from 'react';
import { DatePicker } from './DatePicker';

interface FormDatePickerProps {
  name: string;
  defaultValue?: Date | null;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function FormDatePicker({ name, defaultValue, placeholder, className, style }: FormDatePickerProps) {
  const [date, setDate] = useState<Date | undefined>(defaultValue || undefined);

  return (
    <>
      <input type="hidden" name={name} value={date ? date.toISOString() : ''} />
      <DatePicker 
        date={date} 
        onSelect={setDate} 
        placeholder={placeholder}
        className={className}
        style={style}
      />
    </>
  );
}
