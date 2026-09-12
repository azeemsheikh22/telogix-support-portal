const dateFormatter = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Karachi" });
const timeFormatter = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true, timeZone: "Asia/Karachi" });

export function formatGpsTime(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return { date: "—", time: "—" };
  return { date: dateFormatter.format(date), time: timeFormatter.format(date) };
}

export function formatDuration(value, now = Date.now()) {
  const gpsTime = value ? new Date(value).getTime() : NaN;
  if (!Number.isFinite(gpsTime)) return "—";

  const totalMinutes = Math.floor(Math.max(0, now - gpsTime) / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return "< 1m";
}

export function normalizeNrReports(payload) {
  const rows = Array.isArray(payload) ? payload : payload?.data;
  if (!Array.isArray(rows)) throw new Error("Unexpected NR report response");
  return rows.filter((row) => row && typeof row === "object" && !Array.isArray(row));
}

export function filterAndSortReports(rows, search, sort, now = Date.now()) {
  const query = search.trim().toLowerCase();
  const filtered = rows.filter((row) => [row.car_name, row.device_name, row.movingStatus].some((value) => String(value ?? "").toLowerCase().includes(query)));
  return filtered.sort((a, b) => {
    const field = { vehicle: "car_name", device: "device_name", status: "movingStatus" }[sort.split("-")[0]];
    const descending = sort === "newest" || sort.endsWith("-desc");
    if (["car_name", "device_name", "movingStatus"].includes(field)) return String(a[field] ?? "").localeCompare(String(b[field] ?? ""), undefined, { numeric: true, sensitivity: "base" }) * (descending ? -1 : 1);
    const getValue = (row) => {
      const gpsTime = row.gps_time ? new Date(row.gps_time).getTime() : NaN;
      return sort.startsWith("duration-") && Number.isFinite(gpsTime) ? Math.max(0, now - gpsTime) : gpsTime;
    };
    const first = getValue(a);
    const second = getValue(b);
    if (!Number.isFinite(first)) return Number.isFinite(second) ? 1 : 0;
    if (!Number.isFinite(second)) return -1;
    return (first - second) * (descending ? -1 : 1);
  });
}
