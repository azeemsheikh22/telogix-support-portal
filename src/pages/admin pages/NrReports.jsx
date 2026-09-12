import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileLines,
  faArrowsRotate,
  faMagnifyingGlass,
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import { nrreport } from "../../features/reportsSlice";
import {
  filterAndSortReports,
  formatDuration,
  formatGpsTime,
} from "../../utils/nrReports";

const clients = [{ value: 7079, label: "Daewoo" }];
const hourOptions = [1, 6, 12, 24, 48, 72].map((hours) => ({
  value: hours,
  label: `Last ${hours} ${hours === 1 ? "hour" : "hours"}`,
}));
const columns = [
  { label: "Vehicle", ascending: "vehicle-asc", descending: "vehicle-desc" },
  { label: "Device Name", ascending: "device-asc", descending: "device-desc" },
  { label: "GPS time (PKT)", ascending: "oldest", descending: "newest" },
  { label: "Duration", ascending: "duration-asc", descending: "duration-desc" },
  { label: "Status", ascending: "status-asc", descending: "status-desc" },
  { label: "Coordinates" },
];
const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: 32,
    height: 32,
    borderRadius: 6,
    fontSize: 12,
    borderColor: state.isFocused ? "#2563eb" : "#e2e8f0",
    boxShadow: state.isFocused ? "0 0 0 3px #dbeafe" : "none",
    "&:hover": { borderColor: "#94a3b8" },
  }),
  valueContainer: (base) => ({ ...base, padding: "0 8px" }),
  indicatorsContainer: (base) => ({ ...base, height: 30 }),
  menuPortal: (base) => ({ ...base, zIndex: 100 }),
  menu: (base) => ({ ...base, borderRadius: 10, overflow: "hidden" }),
  option: (base, state) => ({
    ...base,
    fontSize: 13,
    backgroundColor: state.isSelected
      ? "#2563eb"
      : state.isFocused
        ? "#eff6ff"
        : "white",
    color: state.isSelected ? "white" : "#334155",
  }),
};
const dropdownProps = {
  styles: selectStyles,
  menuPosition: "fixed",
  menuPlacement: "auto",
  menuPortalTarget: typeof document !== "undefined" ? document.body : undefined,
};

export default function NrReports() {
  const dispatch = useDispatch();
  const [selectedClient, setSelectedClient] = useState(clients[0]);
  const [selectedHours, setSelectedHours] = useState(
    hourOptions.find((option) => option.value === 24),
  );
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("oldest");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const requestRef = useRef(null);
  const { nrReport, nrReportLoading, nrReportError } = useSelector(
    (state) => state.reports,
  );
  const reportRows = useMemo(
    () => (Array.isArray(nrReport) ? nrReport : []),
    [nrReport],
  );
  const visibleRows = useMemo(
    () => filterAndSortReports(reportRows, search, sort, currentTime),
    [reportRows, search, sort, currentTime],
  );

  const fetchReport = useCallback(async () => {
    if (requestRef.current || !selectedClient?.value) return;
    const request = dispatch(
      nrreport({ param1: selectedClient.value, param2: selectedHours.value }),
    );
    requestRef.current = request;
    try {
      await request.unwrap();
    } catch {
      // The report slice exposes request errors in the page's error banner.
    } finally {
      if (requestRef.current === request) requestRef.current = null;
    }
  }, [dispatch, selectedClient?.value, selectedHours.value]);

  useEffect(() => {
    fetchReport();
    return () => {
      requestRef.current?.abort();
      requestRef.current = null;
    };
  }, [fetchReport]);

  useEffect(() => {
    if (!autoRefresh) return;
    const timer = window.setInterval(fetchReport, 120000);
    return () => window.clearInterval(timer);
  }, [autoRefresh, fetchReport]);

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(Date.now()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="space-y-3 text-xs text-slate-700">
      <header className="flex flex-wrap items-end justify-between gap-3 py-1">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-400">
            Reports
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">NR Report</h1>
        </div>
        <span
          role="status"
          className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs text-slate-500"
        >
          <span className="font-semibold tabular-nums text-blue-700">{visibleRows.length}</span>
          <span>/</span>
          <span className="tabular-nums">{reportRows.length} records</span>
        </span>
      </header>
      <section
        aria-label="Report filters"
        className="flex flex-wrap items-center gap-2.5 rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm"
      >
        <div className="w-36 shrink-0">
          <label htmlFor="nr-client" className="sr-only">
            Client
          </label>
          <Select
            {...dropdownProps}
            inputId="nr-client"
            options={clients}
            value={selectedClient}
            onChange={(option) => {
              if (option) setSelectedClient(option);
            }}
            isSearchable={false}
          />
        </div>
        <div className="w-40 shrink-0">
          <label htmlFor="nr-hours" className="sr-only">
            Report duration
          </label>
          <Select
            {...dropdownProps}
            inputId="nr-hours"
            options={hourOptions}
            value={selectedHours}
            onChange={(option) => {
              if (option) setSelectedHours(option);
            }}
            isSearchable={false}
          />
        </div>
        <div className="relative min-w-[180px] flex-1">
          <label htmlFor="nr-search" className="sr-only">
            Search vehicles
          </label>
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="pointer-events-none absolute left-2.5 top-2.5 text-slate-400"
          />
          <input
            id="nr-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Vehicle, device or status…"
            className="h-8 w-full rounded-md border border-slate-200 bg-white pl-8 pr-2 text-xs outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <label className="flex h-8 cursor-pointer items-center gap-1.5 whitespace-nowrap text-xs text-slate-600">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(event) => setAutoRefresh(event.target.checked)}
            className="h-3.5 w-3.5 rounded border-slate-300 accent-blue-600"
          />
          Auto-refresh (2 min)
        </label>
        <button
          type="button"
          onClick={fetchReport}
          disabled={nrReportLoading}
          className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-md bg-blue-600 px-3 text-xs font-medium text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FontAwesomeIcon
            icon={faArrowsRotate}
            className={nrReportLoading ? "animate-spin" : ""}
          />
          {nrReportLoading ? "Refreshing…" : "Refresh"}
        </button>
      </section>

      {nrReportError && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
        >
          <span>
            Unable to refresh the NR report.
            {reportRows.length > 0
              ? " Showing the last successfully loaded data."
              : " Please try again."}
          </span>
          <button
            type="button"
            disabled={nrReportLoading}
            onClick={fetchReport}
            className="font-semibold underline disabled:opacity-50"
          >
            Try again
          </button>
        </div>
      )}

      <section
        aria-label="NR vehicle records"
        aria-busy={nrReportLoading}
        className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
      >
        {nrReportLoading && reportRows.length === 0 ? (
          <div
            role="status"
            className="flex items-center justify-center gap-2 px-4 py-10 text-xs text-slate-500"
          >
            <FontAwesomeIcon
              icon={faArrowsRotate}
              className="animate-spin text-blue-600"
            />
            Loading NR report…
          </div>
        ) : visibleRows.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <FontAwesomeIcon
              icon={faFileLines}
              className="mb-2 h-6 w-6 text-slate-300"
            />
            <h2 className="text-sm font-semibold text-slate-700">
              {nrReportError
                ? "Report unavailable"
                : search.trim()
                  ? "No matching vehicles"
                  : "No NR records found"}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {search.trim()
                ? "Try a different vehicle, device or status."
                : "Refresh the report to check for updated vehicle data."}
            </p>
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-2 text-xs font-semibold text-blue-600 hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="relative isolate max-h-[calc(100dvh-220px)] overflow-auto sm:max-h-[calc(100dvh-160px)]">
            <table className="w-full min-w-[820px] text-left text-xs leading-4">
              <thead className="sticky top-0 z-10 bg-slate-100 text-slate-600">
                <tr>
                  {columns.map((column) => {
                    const direction =
                      column.ascending && sort === column.ascending
                        ? "ascending"
                        : column.descending && sort === column.descending
                          ? "descending"
                          : "none";
                    return (
                      <th
                        key={column.label}
                        scope="col"
                        aria-sort={column.ascending ? direction : undefined}
                        className="border-b border-slate-200 px-3 py-2 font-semibold whitespace-nowrap"
                      >
                        {column.ascending ? (
                          <button
                            type="button"
                            onClick={() =>
                              setSort(
                                direction === "ascending"
                                  ? column.descending
                                  : column.ascending,
                              )
                            }
                            aria-label={`Sort ${column.label} ${direction === "ascending" ? "descending" : "ascending"}`}
                            className="inline-flex items-center gap-2 rounded-sm hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-blue-600"
                          >
                            {column.label}
                            <FontAwesomeIcon
                              icon={
                                direction === "ascending"
                                  ? faSortUp
                                  : direction === "descending"
                                    ? faSortDown
                                    : faSort
                              }
                              className={
                                direction === "none"
                                  ? "text-slate-400"
                                  : "text-blue-600"
                              }
                            />
                          </button>
                        ) : (
                          column.label
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleRows.map((row, index) => {
                  const key = `${row.car_id ?? row.car_name ?? index}-${row.gps_time ?? ""}`;
                  const gps = formatGpsTime(row.gps_time);
                  const status = String(row.movingStatus || "Unknown");
                  const statusClass =
                    status.toLowerCase() === "moving"
                      ? "bg-emerald-50 text-emerald-700"
                      : status.toLowerCase() === "stop"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-slate-100 text-slate-600";
                  return (
                    <tr
                      key={`${key}-${index}`}
                      className="align-top hover:bg-blue-50/40"
                    >
                      <td className="px-3 py-2 font-semibold whitespace-nowrap text-slate-900">
                        {row.car_name || "—"}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-slate-600">
                        {row.device_name || "—"}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap tabular-nums">
                        {gps.date}
                        <span className="ml-2 text-slate-500">{gps.time}</span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap tabular-nums text-slate-600">
                        {formatDuration(row.gps_time, currentTime)}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded px-1.5 text-[11px] font-medium whitespace-nowrap ${statusClass}`}
                        >
                          <span className="h-1 w-1 rounded-full bg-current" />
                          {status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-[11px] whitespace-nowrap tabular-nums text-slate-500">
                        {row.latitude ?? "—"}, {row.longitude ?? "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
