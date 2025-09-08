export default function Result({ data }) {
  if (!data) return null;

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        {/* Title Row*/}
        <h5 className="card-title mb-2">
          {data.scheme || "-"}
          {data.brand ? (
            <small className="text-muted ms-2 fst-italic">({data.brand})</small>
          ) : null}
        </h5>

        {/* Badges */}
        <div className="mb-3">
          <span className="badge text-bg-secondary me-2">
            Type: {data.type || "UNKNOWN"}
          </span>
          <span className="badge text-bg-secondary">
            Prepaid: {data.prepaid || "UNKNOWN"}
          </span>
        </div>

        {/* Issuer */}
        <p className="mb-2">
          <strong>Issuer:</strong> {data.bankName}
          {data.bankUrl ? (
            <>
              {" "}
              -{" "}
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
