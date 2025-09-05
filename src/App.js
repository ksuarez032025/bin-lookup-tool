import { useState } from "react";
import { lookupMock } from "./services/binService";
import { sanitizeBIN } from "./utils/validate";

export default function App() {
  const [bin, setBin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const data = await lookupMock(bin);
      setResult(data); // may be null
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 16, fontFamily: "system-ui, sans-serif" }}>
      <h1>BIN / IIN Lookup (Mock)</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="bin">BIN/IIN (6-8 digits)</label>
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          <input
            id="bin"
            value={bin}
            onChange={(e) => setBin(sanitizeBIN(e.target.value))}
            inputMode="numeric"
            placeholder="e.g. 457173 or 45717360"
            maxLength={8}
            aria-describedby="help"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Looking..." : "Lookup"}
          </button>
        </div>
        <small id="help">Digits only. We never store PANs.</small>
      </form>

      {error && (
        <div style={{ marginTop: 12, color: "crimson" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        {result === null && !loading && !error && (
          <div>No match (try 457173, 45717360, 520082, or 601100).</div>
        )}
        {result && (
          <pre
            style={{
              background: "#111",
              color: "#e7e7e7",
              padding: 12,
              borderRadius: 8,
              overflowX: "auto",
            }}
          >
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
