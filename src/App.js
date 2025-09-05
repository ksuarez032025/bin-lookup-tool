import { useState } from "react";
import { lookupMock, lookupLive } from "./services/binService";
import { sanitizeBIN } from "./utils/validate";

export default function App() {
  const [bin, setBin] = useState("");
  const [source, setSource] = useState("mock");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      console.log("🚀 Submitting BIN:", bin, "Source:", source);
      const data =
        source === "live" ? await lookupLive(bin) : await lookupMock(bin);
      console.log("🎯 Final result:", data);
      setResult(data);
    } catch (err) {
      console.error("❌ Error caught:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

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
