export default function Result({ data }) {
  if (!data) return null;

  return (
    <div style={{ marginTop: 12, lineHeight: 1.6 }}>
      <div>
        <strong>Network:</strong> {data.scheme || "-"}
        {data.brand ? (
          <span>
            {" "}
            &nbsp;(<em>{data.brand}</em>)
          </span>
        ) : null}
      </div>

      <div style={{ marginTop: 4 }}>
        <strong>Type:</strong> <Badge text={data.type || "UNKNOWN"} />
        <span style={{ marginLeft: 12 }}>
          <strong>Prepaid:</strong> <Badge text={data.prepaid} />
        </span>
      </div>

      <div style={{ marginTop: 4 }}>
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
      </div>

      <div style={{ marginTop: 4 }}>
        <strong>Country:</strong> {data.countryName}
        {data.countryCode ? ` (${data.countryCode})` : ""}
      </div>
    </div>
  );
}

function Badge({ text }) {
  const style = {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 12,
    border: "1px solid #999",
    fontSize: 12,
  };

  return <span style={style}>{text}</span>;
}

function normalizeUrl(url) {
  if (!url) return "";
  return url.startsWith("http") ? url : `https://${url}`;
}
