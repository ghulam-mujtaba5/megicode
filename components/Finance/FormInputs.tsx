/**
 * Advanced Form Input Components
 * Modern, reusable form controls with validation display
 */
'use client';

import { ValidationError } from '@/lib/finance/form-validation';
import s from '../styles.module.css';

interface FormFieldProps {
  name: string;
  label?: string;
  required?: boolean;
  error?: ValidationError;
  hint?: string;
  children: React.ReactNode;
}

export const FormField = ({ name, label, required, error, hint, children }: FormFieldProps) => (
  <div className={s.formGroup}>
    {label && (
      <label className={s.label}>
        {label}
        {required && <span className={s.formRequired}>*</span>}
      </label>
    )}
    {children}
    {error && (
      <p className={s.formError} style={{ color: 'var(--int-error)', fontSize: 'var(--int-text-xs)', marginTop: 'var(--int-space-1)' }}>
        {error.message}
      </p>
    )}
    {hint && !error && (
      <p className={s.formHint} style={{ fontSize: 'var(--int-text-xs)', color: 'var(--int-text-muted)', marginTop: 'var(--int-space-1)' }}>
        {hint}
      </p>
    )}
  </div>
);

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: ValidationError;
  hint?: string;
}

export const TextInput = ({ label, error, hint, ...props }: TextInputProps) => (
  <FormField name={props.name || ''} label={label} required={props.required} error={error} hint={hint}>
    <input className={s.input} {...props} />
  </FormField>
);

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: ValidationError;
  hint?: string;
  options?: { value: string | number; label: string }[];
}

export const SelectInput = ({ label, error, hint, options = [], children, ...props }: SelectInputProps) => (
  <FormField name={props.name || ''} label={label} required={props.required} error={error} hint={hint}>
    <select className={s.select} {...props}>
      <option value="">Select an option...</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
      {children}
    </select>
  </FormField>
);

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: ValidationError;
  hint?: string;
}

export const TextAreaInput = ({ label, error, hint, ...props }: TextAreaProps) => (
  <FormField name={props.name || ''} label={label} required={props.required} error={error} hint={hint}>
    <textarea className={s.textarea} {...props} />
  </FormField>
);

interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: ValidationError;
  hint?: string;
}

export const NumberInput = ({ label, error, hint, ...props }: NumberInputProps) => (
  <FormField name={props.name || ''} label={label} required={props.required} error={error} hint={hint}>
    <input type="number" className={s.input} {...props} />
  </FormField>
);

interface DateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: ValidationError;
  hint?: string;
}

export const DateInput = ({ label, error, hint, ...props }: DateInputProps) => (
  <FormField name={props.name || ''} label={label} required={props.required} error={error} hint={hint}>
    <input type="date" className={s.input} {...props} />
  </FormField>
);

interface CheckboxInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const CheckboxInput = ({ label, ...props }: CheckboxInputProps) => (
  <div className={s.formGroup} style={{ flexDirection: 'row', alignItems: 'center', gap: 'var(--int-space-2)' }}>
    <input type="checkbox" className={s.checkbox} {...props} />
    {label && <label style={{ cursor: 'pointer', margin: 0 }}>{label}</label>}
  </div>
);

interface RangeSliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  showValue?: boolean;
  suffix?: string;
  error?: ValidationError;
}

export const RangeSlider = ({ label, showValue = true, suffix = '', error, ...props }: RangeSliderProps) => (
  <FormField name={props.name || ''} label={label} required={props.required} error={error}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--int-space-4)' }}>
      <input type="range" className={s.sliderInput} style={{ flex: 1, accentColor: 'var(--int-primary)' }} {...props} />
      {showValue && (
        <span style={{ fontWeight: 600, minWidth: '60px', textAlign: 'right' }}>
          {props.value}{suffix}
        </span>
      )}
    </div>
  </FormField>
);
