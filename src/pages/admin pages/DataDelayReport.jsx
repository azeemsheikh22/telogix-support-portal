import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsRotate,
  faClock,
  faMagnifyingGlass,
  faSort,
  faSortDown,
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";
import { dataDelayReport as fetchDataDelayReport } from "../../features/reportsSlice";
import {
  filterAndSortDataDelayReports,
  formatGpsTime,
} from "../../utils/nrReports";

const clients = [{ value: 7079, label: "Daewoo" }];
const defaultThresholds = { movingSeconds: 60, stopSeconds: 1860 };
const columns = [
  { label: "Vehicle", ascending: "vehicle-asc", descending: "vehicle-desc" },
  { label: "Device Name", ascending: "device-asc", descending: "device-desc" },
  { label: "GPS time (PKT)", ascending: "oldest", descending: "newest" },
  { label: "Status", ascending: "status-asc", descending: "status-desc" },
  { label: "Data Delay", ascending: "delay-asc", descending: "delay-desc" },
  { label: "Terminal Key", ascending: "terminal-asc", descending: "terminal-desc" },
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

function getStatusClass(status) {
  const normalizedStatus = status.toLowerCase();
  if (normalizedStatus === "moving") return "bg-emerald-50 text-emerald-700";
  if (normalizedStatus === "stop") return "bg-amber-50 text-amber-700";
  if (normalizedStatus === "idle") return "bg-blue-50 text-blue-700";
  return "bg-slate-100 text-slate-600";
}

export default function DataDelayReport() {
  const dispatch = useDispatch();
  const requestRef = useRef(null);
  const [selectedClient, setSelectedClient] = useState(clients[0]);
  const [thresholds, setThresholds] = useState(defaultThresholds);
  const [inputs, setInputs] = useState({
    movingSeconds: String(defaultThresholds.movingSeconds),
    stopSeconds: String(defaultThresholds.stopSeconds),
  });
  const [inputError, setInputError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("delay-desc");
  const {
    dataDelayReport,
    dataDelayReportLoading,
    dataDelayReportError,
  } = useSelector((state) => state.reports);

  const reportRows = useMemo(
    () => (Array.isArray(dataDelayReport) ? dataDelayReport : []),
    [dataDelayReport],
  );
  const visibleRows = useMemo(
    () => filterAndSortDataDelayReports(reportRows, search, sort),
    [reportRows, search, sort],
  );

  const loadReport = useCallback(async () => {
    if (requestRef.current || !selectedClient?.value) return;
    const request = dispatch(
      fetchDataDelayReport({
        groupId: selectedClient.value,
        movingSeconds: thresholds.movingSeconds,
        stopSeconds: thresholds.stopSeconds,
      }),
    );
    requestRef.current = request;

    try {
      await request.unwrap();
    } catch {
      // Redux state supplies the report error shown below.
    } finally {
      if (requestRef.current === request) requestRef.current = null;
    }
  }, [dispatch, selectedClient?.value, thresholds]);

  useEffect(() => {
    loadReport();
    return () => {
      requestRef.current?.abort();
      requestRef.current = null;
    };
  }, [loadReport]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const movingSeconds = Number(inputs.movingSeconds);
    const stopSeconds = Number(inputs.stopSeconds);

    if (
      !Number.isInteger(movingSeconds) ||
      movingSeconds < 1 ||
      !Number.isInteger(stopSeconds) ||
      stopSeconds < 1
    ) {
      setInputError("Moving and stop seconds must be positive whole numbers.");
      return;
    }

    setInputError("");
    if (
      movingSeconds === thresholds.movingSeconds &&
      stopSeconds === thresholds.stopSeconds
    ) {
      loadReport();
      return;
    }
    setThresholds({ movingSeconds, stopSeconds });
  };

  return (
    <div className="space-y-3 text-xs text-slate-700">
      <header className="flex flex-wrap items-end justify-between gap-3 py-1">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-400">
            Reports
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Data Delay Report
          </h1>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-slate-500">
          <span className="font-semibold tabular-nums text-blue-700">
            {visibleRows.length}
          </span>
          <span>/</span>
          <span className="tabular-nums">{reportRows.length} records</span>
        </span>
      </header>

      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap items-end gap-2.5 rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm"
      >
        <div className="w-36 shrink-0">
          <label htmlFor="delay-client" className="mb-1 block font-medium text-slate-500">
            Client
          </label>
          <Select
            inputId="delay-client"
            options={clients}
            value={selectedClient}
            onChange={(option) => option && setSelectedClient(option)}
            isSearchable={false}
            styles={selectStyles}
            menuPosition="fixed"
            menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
          />
        </div>
        <label className="block w-36 shrink-0 font-medium text-slate-500">
          Moving seconds
          <input
            type="number"
            min="1"
            step="1"
            required
            value={inputs.movingSeconds}
            onChange={(event) =>
              setInputs((previous) => ({
                ...previous,
                movingSeconds: event.target.value,
              }))
            }
            className="mt-1 h-8 w-full rounded-md border border-slate-200 px-2 font-normal tabular-nums text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </label>
        <label className="block w-36 shrink-0 font-medium text-slate-500">
          Stop seconds
          <input
            type="number"
            min="1"
            step="1"
            required
            value={inputs.stopSeconds}
            onChange={(event) =>
              setInputs((previous) => ({
                ...previous,
                stopSeconds: event.target.value,
              }))
            }
            className="mt-1 h-8 w-full rounded-md border border-slate-200 px-2 font-normal tabular-nums text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </label>
        <div className="relative min-w-[190px] flex-1">
          <label htmlFor="delay-search" className="mb-1 block font-medium text-slate-500">
            Search
          </label>
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="pointer-events-none absolute bottom-2.5 left-2.5 text-slate-400"
          />
          <input
            id="delay-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Vehicle, device, terminal or status…"
            className="h-8 w-full rounded-md border border-slate-200 pl-8 pr-2 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <button
          type="submit"
          disabled={dataDelayReportLoading}
          className="inline-flex cursor-pointer h-8 items-center justify-center gap-1.5 rounded-md bg-blue-600 px-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FontAwesomeIcon
            icon={faArrowsRotate}
            className={dataDelayReportLoading ? "animate-spin" : ""}
          />
          {dataDelayReportLoading ? "Loading…" : "Run Report"}
        </button>
        {inputError && (
          <p role="alert" className="w-full text-red-600">
            {inputError}
          </p>
        )}
      </form>

      {dataDelayReportError && (
        <div role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-red-700">
          Unable to load the data delay report. Please check the values and try again.
        </div>
      )}

      <section
        aria-label="Data delay vehicle records"
        aria-busy={dataDelayReportLoading}
        className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
      >
        {dataDelayReportLoading && reportRows.length === 0 ? (
          <div className="flex items-center justify-center gap-2 px-4 py-10 text-slate-500">
            <FontAwesomeIcon icon={faArrowsRotate} className="animate-spin text-blue-600" />
            Loading data delay report…
          </div>
        ) : visibleRows.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <FontAwesomeIcon icon={faClock} className="mb-2 h-6 w-6 text-slate-300" />
            <h2 className="text-sm font-semibold text-slate-700">
              {search.trim() ? "No matching vehicles" : "No delayed vehicles found"}
            </h2>
            <p className="mt-1 text-slate-500">
              {search.trim()
                ? "Try a different vehicle, device, terminal or status."
                : "Change the delay thresholds and run the report again."}
            </p>
          </div>
        ) : (
          <div className="relative isolate max-h-[calc(100dvh-230px)] overflow-auto">
            <table className="w-full min-w-[900px] text-left text-xs leading-4">
              <thead className="sticky top-0 z-10 bg-slate-100 text-slate-600">
                <tr>
                  {columns.map((column) => {
                    const direction =
                      sort === column.ascending
                        ? "ascending"
                        : sort === column.descending
                          ? "descending"
                          : "none";
                    return (
                      <th key={column.label} scope="col" aria-sort={direction} className="border-b border-slate-200 px-3 py-2 font-semibold whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() =>
                            setSort(
                              direction === "ascending"
                                ? column.descending
                                : column.ascending,
                            )
                          }
                          className="inline-flex cursor-pointer items-center gap-2 hover:text-blue-600"
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
                            className={direction === "none" ? "text-slate-400" : "text-blue-600"}
                          />
                        </button>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleRows.map((row, index) => {
                  const gps = formatGpsTime(row.gps_time);
                  const status = String(row.movingStatus || "Unknown");
                  return (
                    <tr key={`${row.carid ?? row.car_name ?? index}-${row.gps_time ?? index}`} className="hover:bg-blue-50/40">
                      <td className="px-3 py-2 font-semibold whitespace-nowrap text-slate-900">
                        {row.car_name || "—"}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-slate-600">
                        {row.devicename || "—"}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap tabular-nums">
                        {gps.date}<span className="ml-2 text-slate-500">{gps.time}</span>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`inline-flex items-center gap-1 rounded px-1.5 text-[11px] font-medium ${getStatusClass(status)}`}>
                          <span className="h-1 w-1 rounded-full bg-current" />
                          {status}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap tabular-nums">
                        <span className="font-semibold text-slate-800">{row.delayedTime || "—"}</span>
                        {Number.isFinite(Number(row.seconds)) && (
                          <span className="ml-2 text-[10px] text-slate-400">
                            ({Number(row.seconds).toLocaleString()} sec)
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap font-mono text-[11px] text-slate-500">
                        {row.terminal_key || "—"}
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
