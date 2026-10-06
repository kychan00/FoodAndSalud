import type { InputHTMLAttributes } from "react";

import "./InputField.css";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

export function InputField({ id, label, error, ...props }: InputFieldProps) {
  return (
    <div className="ui-field">
      <label htmlFor={id}>{label}</label>

      <input
        id={id}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />

      {error ? (
        <span id={`${id}-error`} className="ui-field__error" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}
