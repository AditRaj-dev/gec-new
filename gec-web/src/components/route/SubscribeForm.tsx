'use client';

import { useState, type FormEvent } from 'react';
import { submitForm } from '@/lib/api';

/** Dispatch sign-up on /stories. Same endpoint and payload as the broadsheet's form. */
export function SubscribeForm() {
  const [state, setState] = useState<{ busy: boolean; done: boolean; msg: string }>({ busy: false, done: false, msg: '' });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get('email') as string;
    setState({ busy: true, done: false, msg: '' });
    const res = await submitForm({ formType: 'newsletter', fullName: '', email, metadata: { source: 'stories-dispatch' } });
    setState({ busy: false, done: res.success, msg: res.success ? 'You’re on the list ✓' : res.message });
  }

  if (state.done) return <p className="rt-subscribe__msg body-editorial" role="status">{state.msg}</p>;
  return (
    <form className="rt-subscribe" onSubmit={onSubmit}>
      <input name="email" type="email" required placeholder="you@galgotias.edu" aria-label="Email" />
      <button className="gec-btn btn-outline-ink" type="submit" disabled={state.busy}>
        {state.busy ? 'Sending…' : 'Subscribe'}
      </button>
      {state.msg && <p className="rt-subscribe__msg rt-accent" role="alert">{state.msg}</p>}
    </form>
  );
}
