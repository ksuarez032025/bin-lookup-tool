export default function Result({ data }) {
  if (!data) return null;

  const typeClass = badgeForType(data.type);
  const prepaidClass = badgeForPrepaid(data.prepaid);

  return (
    <div className="card shadow-sm result-card">
      <div className="card-body">
        {/* Title Row*/}
        <h5 className="card-title mb-2">
          {data.scheme || "-"}
          {data.brand ? (
            <small className="text-muted ms-2 fst-italic">({data.brand})</small>
          ) : null}
        </h5>

        {/* Badges */}
        <div className="mb-3 d-flex flex-wrap badge-row">
          <span className={`badge ${typeClass}`}>
            Type: {data.type || "UNKNOWN"}
          </span>
          <span className={`badge ${prepaidClass}`}>
            Prepaid: {data.prepaid || "UNKNOWN"}
          </span>
        </div>

        {/* Issuer */}
        <p className="mb-2 text-break">
          <strong>Issuer:</strong> {data.bankName}
          {data.bankUrl ? (
            <>
              {" - "}
              <a
                href={normalizeUrl(data.bankUrl)}
                target="_blank"
                rel="noreferrer"
              >
                {data.bankUrl}
              </a>
            </>
          ) : null}
        </p>

        {/* Country */}
        <p className="mb-0">
          <strong>Country:</strong> {data.countryName}
          {data.countryCode ? ` (${data.countryCode})` : ""}
        </p>
      </div>
    </div>
  );
}

function normalizeUrl(url) {
  if (!url) return "";
  return url.startsWith("http") ? url : `https://${url}`;
}

function badgeForType(type) {
  const t = (type || "").toUpperCase();
  if (t === "DEBIT") return "text-bg-success";
  if (t === "CREDIT") return "text-bg-primary";
  return "text-bg-secondary";
}

function badgeForPrepaid(prepaid) {
  const p = (prepaid || "").toUpperCase();
  if (p === "YES") return "text-bg-warning";
  if (p === "NO") return "text-bg-secondary";
  return "text-bg-secondary";
}
