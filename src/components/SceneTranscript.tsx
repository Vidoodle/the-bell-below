import { useEffect, useId, useRef } from "react";

export type TranscriptEntry = Readonly<{
  id: string;
  role: "player" | "game";
  speaker: string;
  text: string;
}>;

export type SceneTranscriptProps = {
  entries: readonly TranscriptEntry[];
  pending: boolean;
  heading: string;
  emptyMessage: string;
  pendingMessage: string;
};

export function SceneTranscript({
  entries,
  pending,
  heading,
  emptyMessage,
  pendingMessage,
}: SceneTranscriptProps) {
  const headingId = useId();
  const transcriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const transcript = transcriptRef.current;
    if (transcript) transcript.scrollTop = transcript.scrollHeight;
  }, [entries.length]);

  return <section className="scene-transcript" aria-labelledby={headingId}>
    <h2 id={headingId}>{heading}</h2>
    <div ref={transcriptRef} className="transcript-window" role="log" tabIndex={0}
      aria-busy={pending} aria-labelledby={headingId}>
      {entries.length === 0
        ? <p className="transcript-empty">{emptyMessage}</p>
        : <ol className="transcript-list">
          {entries.map((entry) => <li
            className={`transcript-entry transcript-entry-${entry.role}`}
            key={entry.id}
          >
            <p className="transcript-speaker">{entry.speaker}</p>
            <p className="transcript-copy">{entry.text}</p>
          </li>)}
        </ol>}
    </div>
    {pending && <p className="transcript-pending" role="status">{pendingMessage}</p>}
  </section>;
}
