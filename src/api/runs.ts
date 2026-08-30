import { runPath, runsPath } from "../../shared/api";
import type { RunSnapshot } from "../../shared/run";
import type { CreateRunRequest } from "../../shared/run-schema";

async function readRun(response: Response): Promise<RunSnapshot> {
  const body = await response.json() as RunSnapshot & { error?: string };
  if (!response.ok) throw new Error(body.error ?? `Request failed with status ${response.status}.`);
  return body;
}

export async function createRun(request: CreateRunRequest): Promise<RunSnapshot> {
  const response = await fetch(runsPath, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  return readRun(response);
}

export async function getRun(id: string): Promise<RunSnapshot> {
  return readRun(await fetch(runPath(id)));
}
