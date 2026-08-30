export const apiPrefix = "/api";
export const runsPath = `${apiPrefix}/runs`;

export const runPath = (id: string) => `${runsPath}/${encodeURIComponent(id)}`;
export const runProloguePath = (id: string) => `${runPath(id)}/prologue`;
