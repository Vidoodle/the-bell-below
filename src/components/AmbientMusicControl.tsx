import { useEffect, useRef, useState } from "react";
import { startAmbientScore, type AmbientScore } from "../audio/ambient-score";

export function AmbientMusicControl() {
  const score = useRef<AmbientScore | undefined>(undefined);
  const [playing, setPlaying] = useState(false);
  const [starting, setStarting] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => () => score.current?.stop(), []);

  const toggle = async () => {
    if (score.current) {
      score.current.stop();
      score.current = undefined;
      setPlaying(false);
      return;
    }

    setStarting(true);
    try {
      score.current = await startAmbientScore();
      setPlaying(true);
    } catch {
      setUnavailable(true);
    } finally {
      setStarting(false);
    }
  };

  return <button
    aria-pressed={playing}
    className="music-control"
    disabled={starting || unavailable}
    onClick={toggle}
    type="button"
  >
    <span aria-hidden="true">{playing ? "◉" : "○"}</span>
    <span className="music-control-label">
      {unavailable ? "Audio unavailable" : starting ? "Starting…" : playing ? "Ambience on" : "Play ambience"}
    </span>
  </button>;
}
