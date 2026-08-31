import type { CharacterProfile } from "../content/characters";

type CharacterSelectionScreenProps = {
  character: CharacterProfile;
  index: number;
  total: number;
  onBack: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSelect: () => void;
};

export function CharacterSelectionScreen({
  character,
  index,
  total,
  onBack,
  onNext,
  onPrevious,
  onSelect,
}: CharacterSelectionScreenProps) {
  return <main className="select">
    <button className="back select-back" onClick={onBack}>← The Bell Below</button>
    <header><p className="eyebrow">The Bell Below</p><h1>Who answers the final toll?</h1></header>
    <section className="carousel" aria-label="Choose a protagonist">
      <div className="portrait" role="img" aria-label={`${character.name} portrait placeholder`}>
        Portrait forthcoming
      </div>
      <article className="profile">
        <p className="eyebrow">{character.title}</p><h2>{character.name}</h2>
        <h3>Background</h3><p>{character.background}</p>
        <h3>Motivation</h3><p>{character.motivation}</p>
        <nav className="controls" aria-label="Browse protagonists">
          <button onClick={onPrevious} aria-label="Previous protagonist">←</button>
          <span>{index + 1} / {total}</span>
          <button onClick={onNext} aria-label="Next protagonist">→</button>
        </nav>
        <button className="choose" onClick={onSelect}>Choose {character.shortName}</button>
      </article>
    </section>
  </main>;
}
