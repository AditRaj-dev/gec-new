"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import type { PublicSubmissionInput } from "@/lib/content-types";

export type ToastType = "success" | "gold" | "info";
export type ToastItem = { id: string; title: string; message: string; type: ToastType };
export type ModalData = { type: "apply" | null; title?: string; targetProgram?: string };

type ModalContextType = {
  openApplyModal: (targetProgram?: string) => void;
  closeModal: () => void;
  showToast: (title: string, message: string, type?: ToastType) => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);
export function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within a ModalProvider");
  return context;
}

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalData, setModalData] = useState<ModalData>({ type: null });
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", details: "" });
  const [submitting, setSubmitting] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const showToast = useCallback((title: string, message: string, type: ToastType = "success") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((current) => [...current, { id, title, message, type }]);
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 4500);
  }, []);

  const openApplyModal = useCallback((targetProgram = "General GEC involvement") => {
    setForm({ name: "", email: "", phone: "", details: "" });
    setModalData({ type: "apply", title: "Get involved", targetProgram });
  }, []);
  const closeModal = useCallback(() => setModalData({ type: null }), []);

  useEffect(() => {
    if (!modalData.type) return;
    firstFieldRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") closeModal(); };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalData.type, closeModal]);

  async function handleApplySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const payload: PublicSubmissionInput = {
      submissionType: "contact",
      applicantName: form.name,
      applicantEmail: form.email,
      applicantPhone: form.phone || undefined,
      payload: { targetProgram: modalData.targetProgram, details: form.details },
    };
    try {
      const response = await fetch("/api/submissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) throw new Error(result?.error || "Submission failed");
      closeModal();
      showToast("Thanks for reaching out", "Your message has been sent to the GEC team.");
    } catch (error) {
      showToast("Could not send", error instanceof Error ? error.message : "Please try again shortly.", "gold");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ModalContext.Provider value={{ openApplyModal, closeModal, showToast }}>
      {children}
      {modalData.type ? (
        <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }}>
          <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
            <div className="dialog__header">
              <div><p className="eyebrow">Get involved</p><h2 id="dialog-title">{modalData.title}</h2></div>
              <button type="button" className="icon-button" onClick={closeModal} aria-label="Close dialog">×</button>
            </div>
            <div className="dialog__body">
              <form className="dialog-form" onSubmit={handleApplySubmit}>
                  <p>Tell us a little about yourself and what you would like to explore.</p>
                  <label>Name<input ref={firstFieldRef} required value={form.name} onChange={(event) => setForm((value) => ({ ...value, name: event.target.value }))} /></label>
                  <label>Email<input required type="email" value={form.email} onChange={(event) => setForm((value) => ({ ...value, email: event.target.value }))} /></label>
                  <label>Phone <span>(optional)</span><input value={form.phone} onChange={(event) => setForm((value) => ({ ...value, phone: event.target.value }))} /></label>
                  <label>What would you like to explore?<textarea required rows={4} value={form.details} onChange={(event) => setForm((value) => ({ ...value, details: event.target.value }))} /></label>
                  <p className="dialog-form__target">Selected path: {modalData.targetProgram}</p>
                  <button className="button button--crimson" type="submit" disabled={submitting}>{submitting ? "Sending…" : "Send message"}</button>
                </form>
            </div>
          </section>
        </div>
      ) : null}
      <div className="toast-stack" aria-live="polite">{toasts.map((toast) => <div key={toast.id} className={`toast toast--${toast.type}`}><strong>{toast.title}</strong><span>{toast.message}</span></div>)}</div>
    </ModalContext.Provider>
  );
}
