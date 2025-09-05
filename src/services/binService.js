import bins from "../data/bins.json";
import { sanitizeBIN, isValidBIN } from "../utils/validate";

/**
 * Mock lookup against local JSON.
 * Prefers 8-digit match when available, otherwise falls back to 6-digit.
 */

export async function lookupMock(rawInput) {
  const bin = sanitizeBIN(rawInput);
  if (!isValidBIN(bin)) {
    throw new Error("Enter 6-8 digits.");
  }

  const key8 = bin.length >= 8 ? bin.slice(0, 8) : null;
  const key6 = bin.slice(0, 6);

  const record = (key8 && bins[key8]) || bins[key6] || null;

  // mimic async (so UI code matches later API usage)

  await new Promise((r) => setTimeout(r, 50));
  return record; // can be null if not found
}

// Live Binlist Lookup

export async function lookupLive(rawInput) {
  const bin = sanitizeBIN(rawInput);
  console.log("📥 Raw input:", rawInput, "→ Sanitized:", bin);

  if (!isValidBIN(bin)) throw new Error("Enter 6-8 digits.");

  const url = `/api/bin/${bin}`;
  console.log("🌐 Fetching URL:", url);

  const res = await fetch(url);

  console.log("📡 Response status:", res.status);

  if (res.status === 404) return null; // BIN not found
  if (res.status === 429)
    throw new Error("Rate Limited. Try Mock mode or wait 1 hour.");

  if (!res.ok) {
    // read error body (from function) to show more context
    let detail = "";
    try {
      const body = await res.json();
      if (body?.error)
        detail = `: ${body.error}${body.detail ? " — " + body.detail : ""}`;
    } catch {}
    throw new Error(`Lookup failed (${res.status})${detail}`);
  }

  const data = await res.json();
  console.log("✅ Data received:", data);
  return data;
}
