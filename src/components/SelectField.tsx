import React from 'react';
import { ChevronDownIcon } from 'lucide-react';

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  options: string[];
  placeholder?: string;
  hint?: string;
  onChange: (value: string) => void;
}

export function SelectField({
  id,
  label,
  value,
  options,
  placeholder = 'Select one',
  hint,
  onChange
}: SelectFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold text-ink">
        {label}
      </label>
      <div className="relative mt-2">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none rounded-xl border border-lilacDeep bg-white px-4 py-3 pr-10 text-sm font-medium text-ink transition-colors hover:border-hotpink/60 focus:border-hotpink focus:outline-none focus:ring-2 focus:ring-pinkfill">

          <option value="">{placeholder}</option>
          {options.map((option) =>
            <option key={option} value={option}>
              {option}
            </option>
          )}
        </select>
        <ChevronDownIcon
          className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-hotpink"
          aria-hidden="true" />
      </div>
      {hint && <p className="mt-1.5 text-xs text-ink/60">{hint}</p>}
    </div>);
}
