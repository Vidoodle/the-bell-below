import { runPath, runProloguePath, runsPath } from "../../shared/api";
import type { CreateRunRequest, RunSnapshot } from "../../shared/run";
import { readResponse } from "./response";

export async function createRun(request: CreateRunRequest): Promise<RunSnapshot> {
  const response = await fetch(runsPath, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  return readResponse<RunSnapshot>(response);
}

export async function getRun(id: string): Promise<RunSnapshot> {
  return readResponse<RunSnapshot>(await fetch(runPath(id)));
}

export async function completePrologue(id: string): Promise<RunSnapshot> {
  return readResponse<RunSnapshot>(await fetch(runProloguePath(id), { method: "POST" }));
}
