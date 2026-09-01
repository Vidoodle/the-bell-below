import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";

type SubmitResult = boolean | void;

export type RoleplayComposerProps = {
  pending: boolean;
  error?: string;
  label: string;
  placeholder: string;
  submitLabel: string;
  keyboardHint: string;
  onSubmit: (message: string) => SubmitResult | Promise<SubmitResult>;
};

export function RoleplayComposer({
  pending,
  error,
  label,
  placeholder,
  submitLabel,
  keyboardHint,
  onSubmit,
}: RoleplayComposerProps) {
  const [draft, setDraft] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const submissionInFlight = useRef(false);
  const wasPending = useRef(pending);
  const inputId = useId();
  const hintId = useId();
  const errorId = useId();
  const canSubmit = !pending && Boolean(draft.trim());

  useEffect(() => {
    if (wasPending.current && !pending) textareaRef.current?.focus();
    wasPending.current = pending;
  }, [pending]);

  const submit = async () => {
    if (!canSubmit || submissionInFlight.current) return;
    submissionInFlight.current = true;
    const submittedDraft = draft;

    try {
      const accepted = await onSubmit(submittedDraft);
      if (accepted !== false) {
        setDraft((currentDraft) => currentDraft === submittedDraft ? "" : currentDraft);
      }
    } catch {
      // The supplied error prop presents submission failures while the draft stays intact.
    } finally {
      submissionInFlight.current = false;
      textareaRef.current?.focus();
    }
  };

  const handleSubmit = (event: FormEvent) => { event.preventDefault(); void submit(); };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return;
    event.preventDefault();
    void submit();
  };

  return <form className="roleplay-composer" onSubmit={handleSubmit}>
    <label className="roleplay-question" htmlFor={inputId}>{label}</label>
    <textarea
      ref={textareaRef}
      id={inputId}
      value={draft}
      rows={4}
      placeholder={placeholder}
      disabled={pending}
      aria-describedby={`${hintId}${error ? ` ${errorId}` : ""}`}
      aria-invalid={Boolean(error)}
      onChange={(event) => setDraft(event.target.value)}
      onKeyDown={handleKeyDown}
    />
    <div className="composer-footer">
      <p className="roleplay-hint" id={hintId}>{keyboardHint}</p>
      <button className="choose roleplay-submit" type="submit" disabled={!canSubmit}>
        {pending ? "Continuing…" : submitLabel}
      </button>
    </div>
    {error && <p className="roleplay-error" id={errorId} role="alert">{error}</p>}
  </form>;
}
