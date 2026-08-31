import { publicLore } from "../content/prologue";

type SettingIntroductionScreenProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function SettingIntroductionScreen({
  onBack,
  onContinue,
}: SettingIntroductionScreenProps) {
  return <main className="game prologue">
    <section className="scene prologue-sheet">
      <button className="back" onClick={onBack}>← Title</button>
      <p className="eyebrow">Before the final toll</p>
      <h1>The Bell Below</h1>
      <div className="setting-art" role="img" aria-label="Setting artwork placeholder">
        <span>Setting artwork forthcoming</span>
      </div>
      <div className="lore-copy">
        {publicLore.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
      <button className="choose" onClick={onContinue}>Choose a protagonist</button>
    </section>
  </main>;
}
