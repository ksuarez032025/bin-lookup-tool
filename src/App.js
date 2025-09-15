import { useState } from "react";
import { lookupMock, lookupLive } from "./services/binService";
import { sanitizeBIN } from "./utils/validate";
import { mapBinRecord } from "./utils/mapBin";
import Result from "./components/Result";
import Footer from "./components/Footer";

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
    <div className="container py-4">
      <div className="row">
        <div className="col-12 col-lg-8 mx-auto">
          <h1 className="h3 mb-3">BIN / IIN Lookup</h1>

          {/*Source Toggle */}
          <div className="col-12 col-sm-auto mb-2">
            <span className="form-label d-block">Source</span>

            <div className="btn-group" role="group" aria-label="Source">
              <input
                type="radio"
                className="btn-check"
                name="source"
                id="src-mock"
                value="mock"
                checked={source === "mock"}
                onChange={(e) => setSource(e.target.value)}
              />
              <label className="btn btn-outline-secondary" htmlFor="src-mock">
                Mock
              </label>

              <input
                type="radio"
                className="btn-check"
                name="source"
                id="src-live"
                value="live"
                checked={source === "live"}
                onChange={(e) => setSource(e.target.value)}
              />
              <label className="btn btn-outline-primary" htmlFor="src-live">
                Live
              </label>
            </div>
          </div>

          <p className="text-muted mb-4">
            Enter the first <strong>6–8</strong> digits of a card to find the
            issuer, type, and region.
          </p>

          <form onSubmit={handleSubmit} className="row gy-3">
            <div className="col-12 col-md-8">
              <label htmlFor="bin" className="form-label">
                BIN/IIN (6–8 digits)
              </label>

              <div className="input-group input-group-sm">
                <input
                  id="bin"
                  value={bin}
                  onChange={(e) => setBin(sanitizeBIN(e.target.value))}
                  inputMode="numeric"
                  placeholder="e.g. 457173 or 45717360"
                  maxLength={8}
                  className="form-control"
                />
                <button
                  type="submit"
                  disabled={loading || bin.length < 6}
                  className="btn btn-primary"
                >
                  {loading ? "Looking..." : "Lookup"}
                </button>
              </div>

              <div className="form-text">Digits only. We never store PANs.</div>
            </div>
          </form>

          {error && (
            <div className="alert alert-danger mt-3" role="alert">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Results */}
          {!loading && !error && rawResult === null && (
            <div className="mt-3 text-muted">No match.</div>
          )}

          <div aria-live="polite">
            {!loading && !error && mapped && (
              <div className="mt-3">
                <Result data={mapped} />
              </div>
            )}
          </div>

          {/* Keep raw JSON available for quick dev comparison */}
          {!loading && !error && rawResult && (
            <details className="mt-3">
              <summary>Raw JSON (dev aid)</summary>
              <pre
                className="mt-2 p-3 rounded"
                style={{
                  background: "#111",
                  color: "#e7e7e7",
                  overflowX: "auto",
                }}
              >
                {JSON.stringify(rawResult, null, 2)}
              </pre>
            </details>
          )}
          <Footer />
        </div>
      </div>
    </div>
  );
}
