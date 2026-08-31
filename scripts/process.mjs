import { spawn } from "node:child_process";

function commandError(command) {
  return new Error(`Could not run '${command}'. Check that it is installed and available on PATH.`);
}

export function runCommand(command, args, { environment = process.env } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { env: environment, stdio: "inherit" });
    child.on("error", () => reject(commandError(command)));
    child.on("exit", (code) => (
      code === 0 ? resolve() : reject(new Error(`${command} exited with code ${code}.`))
    ));
  });
}

export function captureCommand(command, args, { environment = process.env } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { env: environment, stdio: ["ignore", "pipe", "inherit"] });
    let output = "";
    child.stdout.setEncoding("utf8");
    child.stdout.on("data", (chunk) => { output += chunk; });
    child.on("error", () => reject(commandError(command)));
    child.on("exit", (code) => (
      code === 0 ? resolve(output.trim()) : reject(new Error(`${command} exited with code ${code}.`))
    ));
  });
}

export function runPnpm(args, environment) {
  const pnpmExecutable = process.env.npm_execpath;
  if (!pnpmExecutable) {
    throw new Error("Run this command through pnpm so the repository can locate its pnpm executable.");
  }
  return runCommand(process.execPath, [pnpmExecutable, ...args], { environment });
}
