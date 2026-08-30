type TitleScreenProps = {
  canResume: boolean;
  recovering: boolean;
  recoveryError?: string;
  onNewGame: () => void;
  onResume: () => void;
};

export function TitleScreen({
  canResume,
  recovering,
  recoveryError,
  onNewGame,
  onResume,
}: TitleScreenProps) {
  return <main className="title-screen">
    <section className="title-panel">
      <p className="eyebrow">A gothic-fantasy role-playing game</p>
      <h1>The Bell Below</h1>
      <p className="title-premise">The buried Bell of Mercy has begun to toll beneath Grayhaven.</p>
      <div className="title-actions">
        {recovering && <button className="choose" disabled>Recovering your descent…</button>}
        {!recovering && canResume && <button className="choose" onClick={onResume}>Resume the descent</button>}
        <button className={canResume ? "secondary-action" : "choose"} disabled={recovering} onClick={onNewGame}>
          {canResume ? "Begin a new descent" : "Begin"}
        </button>
      </div>
      {recoveryError && <p className="run-error" role="alert">{recoveryError}</p>}
    </section>
  </main>;
}
