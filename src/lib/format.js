export function formatINR(value, opts) {
  const decimals = opts?.decimals ?? 0;
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  return `${sign}\u20B9${abs.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}`;
}

/** Indian short form: 1,20,000 -> ₹1.2L, 25000000 -> ₹2.5Cr */
export function formatINRShort(value) {
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  if (abs >= 1_00_00_000) return `${sign}\u20B9${trim(abs / 1_00_00_000)}Cr`;
  if (abs >= 1_00_000) return `${sign}\u20B9${trim(abs / 1_00_000)}L`;
  if (abs >= 1_000) return `${sign}\u20B9${trim(abs / 1_000)}K`;
  return `${sign}\u20B9${Math.round(abs)}`;
}

function trim(n) {
  return n.toFixed(n >= 100 ? 0 : n >= 10 ? 1 : 2).replace(/\.0+$/, "");
}

export function formatPct(value, decimals = 1) {
  return `${value > 0 ? "+" : ""}${value.toFixed(decimals)}%`;
}

export function formatPlainPct(value, decimals = 0) {
  return `${value.toFixed(decimals)}%`;
}

export function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}