import { statNames, type BaseStats, type Stat } from "../../shared/stats";

function StatIcon({ stat }: { stat: Stat }) {
  if (stat === "Grace") return <svg className="stat-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 4c-7-1-13 3-14 10l-2 6 6-2c7-1 11-7 10-14Z" />
    <path d="M4 20 15 9M9 15H5.5M12 12H8.5" />
  </svg>;

  if (stat === "Wits") return <svg className="stat-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
    <circle cx="12" cy="12" r="2.5" />
  </svg>;

  return <span aria-hidden="true">{stat === "Might" ? "⚔︎" : "♛"}</span>;
}

type CharacterStatsHudProps = {
  stats: BaseStats;
};

export function CharacterStatsHud({ stats }: CharacterStatsHudProps) {
  return <aside className="character-stats-hud" aria-label="Character stats">
    <dl>{statNames.map((stat) => <div className="character-stat" key={stat} tabIndex={0}>
      <dt>{stat}</dt>
      <dd><StatIcon stat={stat} /><strong>{stats[stat]}</strong></dd>
    </div>)}</dl>
  </aside>;
}
