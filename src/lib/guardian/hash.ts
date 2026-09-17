function fnv1a(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic 64-char hex fingerprint for evidence rows. Not a substitute for SHA-256 at rest. */
export function fingerprint(input: string): string {
  let acc = input;
  const parts: string[] = [];
  for (let i = 0; i < 8; i++) {
    const h = fnv1a(`${acc}|${i}|guardian-capsule`);
    parts.push(h.toString(16).padStart(8, "0"));
    acc = parts[i] + acc;
  }
  return parts.join("");
}

export function eventCanonical(event: {
  id: string;
  at: number;
  kind: string;
  label: string;
  detail?: string;
}): string {
  return [
    event.id,
    event.at.toString(10),
    event.kind,
    event.label,
    event.detail ?? "",
  ].join("|");
}

export async function sha256Hex(input: string): Promise<string> {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const data = new TextEncoder().encode(input);
    const buf = await crypto.subtle.digest("SHA-256", data);
    return [...new Uint8Array(buf)]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  return fingerprint(input);
}
