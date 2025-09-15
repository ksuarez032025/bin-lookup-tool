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

export function countryCodeToFlag(cc) {
  const code = (cc || "").toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return "";
  const OFFSET = 0x1f1e6 - "A".charCodeAt(0);
  return (
    String.fromCodePoint(code.charCodeAt(0) + OFFSET) +
    String.fromCodePoint(code.charCodeAt(1) + OFFSET)
  );
}
