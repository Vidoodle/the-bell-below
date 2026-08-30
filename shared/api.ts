export const apiPrefix = "/api";
export const runsPath = `${apiPrefix}/runs`;

export const runPath = (id: string) => `${runsPath}/${encodeURIComponent(id)}`;
export const runCharacterPath = (id: string) => `${runPath(id)}/character`;
export const runProloguePath = (id: string) => `${runPath(id)}/prologue`;
