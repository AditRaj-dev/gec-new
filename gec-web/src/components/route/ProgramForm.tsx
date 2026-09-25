'use client';

import { useId, useState, type FormEvent } from 'react';
import { submitForm } from '@/lib/api';

export type ProgramField = {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  placeholder?: string;
  options?: readonly string[];
  required?: boolean;
  /** Spans both columns on wide screens. */
  wide?: boolean;
};

/**
 * Application form for /initiatives programmes. `fullName`, `email`, `phone` map onto
 * SubmissionData; every other field rides along in `metadata`. Success is only shown
 * when the submission service says so — no optimistic "received" screen.
 */
export function ProgramForm({
  formType,
  fields,
  submitLabel,
  source,
}: {
  formType: string;
  fields: readonly ProgramField[];
  submitLabel: string;
  source: string;
}) {
  const uid = useId();
  const [state, setState] = useState<{ busy: boolean; done: string; err: string }>({ busy: false, done: '', err: '' });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const { fullName = '', email = '', phone, ...rest } = data;
    setState({ busy: true, done: '', err: '' });
    const res = await submitForm({ formType, fullName, email, phone, metadata: { ...rest, source } });
    setState({
      busy: false,
      done: res.success ? `Received${res.submissionId ? ` · Ref ${res.submissionId}` : ''}. We’ll email you within 3 working days.` : '',
      err: res.success ? '' : res.message,
    });
  }

  if (state.done) return <p className="rt-form__done" role="status">{state.done}</p>;

  return (
    <form className="rt-form" onSubmit={onSubmit}>
      {fields.map((f) => {
        const id = `${uid}-${f.name}`;
        const common = { id, name: f.name, required: f.required ?? true, placeholder: f.placeholder };
        return (
          <label key={f.name} htmlFor={id} className={f.wide ? 'rt-form__field rt-form__field--wide' : 'rt-form__field'}>
            <span>{f.label}</span>
            {f.type === 'textarea' ? (
              <textarea rows={3} {...common} />
            ) : f.type === 'select' ? (
              <select {...common} defaultValue="">
                <option value="" disabled>{f.placeholder ?? 'Choose one'}</option>
                {f.options?.map((o) => <option key={o}>{o}</option>)}
              </select>
            ) : (
              <input type={f.type ?? 'text'} {...common} />
            )}
          </label>
        );
      })}
      <div className="rt-form__actions">
        {state.err && <p className="rt-form__err" role="alert">{state.err}</p>}
        <button className="gec-btn btn-crimson" type="submit" disabled={state.busy}>
          {state.busy ? 'Sending…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
