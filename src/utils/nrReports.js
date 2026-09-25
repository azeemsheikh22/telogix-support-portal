const dateFormatter = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Karachi" });
const timeFormatter = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true, timeZone: "Asia/Karachi" });
const pakistanOffsetMilliseconds = 5 * 60 * 60 * 1000;

function parseGpsTime(value) {
  if (!value) return null;

  // The NR API appends `Z`, but its date/time components are already PKT.
  // Convert that PKT wall-clock value to the correct instant before formatting.
  if (typeof value === "string" && /Z$/i.test(value.trim())) {
    const apiDate = new Date(value);
    if (!Number.isNaN(apiDate.getTime())) {
      return new Date(apiDate.getTime() - pakistanOffsetMilliseconds);
    }
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatGpsTime(value) {
  const date = parseGpsTime(value);
  if (!date || Number.isNaN(date.getTime())) return { date: "—", time: "—" };
  return { date: dateFormatter.format(date), time: timeFormatter.format(date) };
}

export function formatDuration(value, now = Date.now()) {
  const gpsTime = parseGpsTime(value)?.getTime() ?? NaN;
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

export function normalizeDataDelayReports(payload) {
  const rows = Array.isArray(payload) ? payload : payload?.data;
  if (!Array.isArray(rows)) throw new Error("Unexpected data delay response");
  return rows.filter((row) => row && typeof row === "object" && !Array.isArray(row));
}

export function normalizeIgnitionIssuesReports(payload) {
  const rows = Array.isArray(payload) ? payload : payload?.data;
  if (!Array.isArray(rows)) throw new Error("Unexpected ignition issues response");
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
      const gpsTime = parseGpsTime(row.gps_time)?.getTime() ?? NaN;
      return sort.startsWith("duration-") && Number.isFinite(gpsTime) ? Math.max(0, now - gpsTime) : gpsTime;
    };
    const first = getValue(a);
    const second = getValue(b);
    if (!Number.isFinite(first)) return Number.isFinite(second) ? 1 : 0;
    if (!Number.isFinite(second)) return -1;
    return (first - second) * (descending ? -1 : 1);
  });
}

export function filterAndSortDataDelayReports(rows, search, sort) {
  const query = search.trim().toLowerCase();
  const filtered = rows.filter((row) =>
    [row.car_name, row.devicename, row.movingStatus, row.terminal_key].some(
      (value) => String(value ?? "").toLowerCase().includes(query),
    ),
  );

  return filtered.sort((a, b) => {
    const field = {
      vehicle: "car_name",
      device: "devicename",
      status: "movingStatus",
      delay: "seconds",
      terminal: "terminal_key",
    }[sort.split("-")[0]];
    const descending = sort === "newest" || sort.endsWith("-desc");

    if (["car_name", "devicename", "movingStatus", "terminal_key"].includes(field)) {
      return String(a[field] ?? "").localeCompare(
        String(b[field] ?? ""),
        undefined,
        { numeric: true, sensitivity: "base" },
      ) * (descending ? -1 : 1);
    }

    const getValue = (row) => {
      if (field === "seconds") {
        return row.seconds == null || row.seconds === "" ? NaN : Number(row.seconds);
      }
      return parseGpsTime(row.gps_time)?.getTime() ?? NaN;
    };
    const first = getValue(a);
    const second = getValue(b);
    if (!Number.isFinite(first)) return Number.isFinite(second) ? 1 : 0;
    if (!Number.isFinite(second)) return -1;
    return (first - second) * (descending ? -1 : 1);
  });
}

export function filterAndSortIgnitionIssuesReports(rows, search, sort) {
  const query = search.trim().toLowerCase();
  const filtered = rows.filter((row) =>
    [row.carName, row.carId, row.distanceKm, row.offCount, row.onCount].some(
      (value) => String(value ?? "").toLowerCase().includes(query),
    ),
  );

  return filtered.sort((a, b) => {
    const field = {
      vehicle: "carName",
      off: "offCount",
      on: "onCount",
      first: "firstGpsTime",
      last: "lastGpsTime",
      distance: "distanceKm",
    }[sort.split("-")[0]];
    const descending = sort === "newest" || sort.endsWith("-desc");

    if (field === "carName") {
      return String(a.carName ?? "").localeCompare(
        String(b.carName ?? ""),
        undefined,
        { numeric: true, sensitivity: "base" },
      ) * (descending ? -1 : 1);
    }

    const getValue = (row) => {
      if (["offCount", "onCount", "distanceKm"].includes(field)) {
        return row[field] == null || row[field] === "" ? NaN : Number(row[field]);
      }
      return parseGpsTime(row[field])?.getTime() ?? NaN;
    };
    const first = getValue(a);
    const second = getValue(b);
    if (!Number.isFinite(first)) return Number.isFinite(second) ? 1 : 0;
    if (!Number.isFinite(second)) return -1;
    return (first - second) * (descending ? -1 : 1);
  });
}
