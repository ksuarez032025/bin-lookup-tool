export function sanitizeBIN(input) {
  return (input || "").replace(/\D/g, "").slice(0, 8);
}

export function isValidBIN(digits) {
  return /^\d{6,8}$/.test(digits);
}
