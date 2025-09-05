export function mapBinRecord(raw) {
  if (!raw || typeof raw !== "object") return null;

  const scheme = safeUpper(raw.scheme);
  const brand = raw.brand || "";
  const type = safeUpper(raw.type);
  const prepaid = boolToLabel(raw.prepaid);

  const bankName = raw.bank?.name || "-";
  const bankUrl = raw.bank?.url || "";

  const countryName = raw.country?.name || "-";
  const countryCode = (raw.country?.alpha2 || "").toUpperCase();

  return {
    scheme,
    brand,
    type,
    prepaid,
    bankName,
    bankUrl,
    countryName,
    countryCode,
  };
}

function safeUpper(s) {
  return typeof s === "string" ? s.toUpperCase() : "";
}

function boolToLabel(v) {
  return v === true ? "YES" : v === false ? "NO" : "UNKNOWN";
}
