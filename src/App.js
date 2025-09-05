import { useState } from "react";
import { lookupMock, lookupLive } from "./services/binService";
import { sanitizeBIN } from "./utils/validate";
import { mapBinRecord } from "./utils/mapBin";
import Result from "./components/Result";

export default function App() {
  const isProd = process.env.NODE_ENV === "production";
  const [bin, setBin] = useState("");
  const [source, setSource] = useState(isProd ? "live" : "mock");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rawResult, setRawResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setRawResult(null);
    setLoading(true);

    try {
      const data =
        source === "live" ? await lookupLive(bin) : await lookupMock(bin);
      setRawResult(data); // may be null
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const mapped = mapBinRecord(rawResult);

  return (
    <div style={{ padding: 16, fontFamily: "system-ui, sans-serif" }}>
      <h1>BIN / IIN Lookup</h1>

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
          />
          <button type="submit" disabled={loading}>
            {loading ? "Looking..." : "Lookup"}
          </button>
        </div>

        {/*Source Toggle */}
        <div style={{ marginTop: 8 }}>
          <label>
            <input
              type="radio"
              value="mock"
              checked={source === "mock"}
              onChange={(e) => setSource(e.target.value)}
            />
            Mock (local JSON)
          </label>
          <label style={{ marginLeft: 12 }}>
            <input
              type="radio"
              value="live"
              checked={source === "live"}
              onChange={(e) => setSource(e.target.value)}
            />
            Live (Binlist API)
          </label>
        </div>
        <small id="help">Digits only. We never store PANs.</small>
      </form>

      {error && (
        <div style={{ marginTop: 12, color: "crimson" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Results */}
      {!loading && !error && rawResult === null && (
        <div style={{ marginTop: 12 }}>No Match.</div>
      )}

      {!loading && !error && mapped && <Result data={mapped} />}

      {/* Keep raw JSON available for quick dev comparison */}
      {!loading && !error && rawResult && (
        <details style={{ marginTop: 12 }}>
          <summary>Raw JSON (dev aid)</summary>
          <pre
            style={{
              background: "#111",
              color: "#e7e7e7",
              padding: 12,
              borderRadius: 8,
              overflowX: "auto",
            }}
          >
            {JSON.stringify(rawResult, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
