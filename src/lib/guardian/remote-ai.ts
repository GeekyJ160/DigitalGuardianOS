import { xaiStatus } from "./ai";

let cached: boolean | null = null;

export async function remoteAiAvailable(): Promise<boolean> {
  if (cached !== null) return cached;
  try {
    const res = await xaiStatus();
    cached = Boolean(res.available);
  } catch {
    cached = false;
  }
  return cached;
}
