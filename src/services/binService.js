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
