import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsRotate,
  faBolt,
  faMagnifyingGlass,
  faSort,
  faSortDown,
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";
import { ignitionIssuesReport as fetchIgnitionIssuesReport } from "../../features/reportsSlice";
import {
  filterAndSortIgnitionIssuesReports,
  formatGpsTime,
} from "../../utils/nrReports";

const clients = [
  { value: 7079, label: "Daewoo" },
  { value: 5227, label: "Total Parco" },
];
const defaultDistanceKm = 10;
const columns = [
  { label: "Vehicle", ascending: "vehicle-asc", descending: "vehicle-desc" },
  { label: "Off Count", ascending: "off-asc", descending: "off-desc" },
  { label: "On Count", ascending: "on-asc", descending: "on-desc" },
  {
    label: "First GPS (PKT)",
    ascending: "first-asc",
    descending: "first-desc",
  },
  { label: "Last GPS (PKT)", ascending: "last-asc", descending: "last-desc" },
  { label: "Distance", ascending: "distance-asc", descending: "distance-desc" },
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

export default function IgnitionDisconnectReport() {
  const dispatch = useDispatch();
  const requestRef = useRef(null);
  const [selectedClient, setSelectedClient] = useState(clients[0]);
  const [distanceKm, setDistanceKm] = useState(defaultDistanceKm);
  const [distanceInput, setDistanceInput] = useState(String(defaultDistanceKm));
  const [inputError, setInputError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("distance-desc");
  const {
    ignitionIssuesReport,
    ignitionIssuesReportLoading,
    ignitionIssuesReportError,
  } = useSelector((state) => state.reports);

  const reportRows = useMemo(
    () => (Array.isArray(ignitionIssuesReport) ? ignitionIssuesReport : []),
    [ignitionIssuesReport],
  );
  const visibleRows = useMemo(
    () => filterAndSortIgnitionIssuesReports(reportRows, search, sort),
    [reportRows, search, sort],
  );

  const loadReport = useCallback(async () => {
    if (requestRef.current || !selectedClient?.value) return;
    const request = dispatch(
      fetchIgnitionIssuesReport({
        groupId: selectedClient.value,
        distanceKm,
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
  }, [dispatch, selectedClient?.value, distanceKm]);

  useEffect(() => {
    loadReport();
    return () => {
      requestRef.current?.abort();
      requestRef.current = null;
    };
  }, [loadReport]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextDistanceKm = Number(distanceInput);

    if (!Number.isFinite(nextDistanceKm) || nextDistanceKm < 0) {
      setInputError("Distance must be zero or a positive number.");
      return;
    }

    setInputError("");
    if (nextDistanceKm === distanceKm) {
      loadReport();
      return;
    }
    setDistanceKm(nextDistanceKm);
  };

  return (
    <div className="space-y-3 text-xs text-slate-700">
      <header className="flex flex-wrap items-end justify-between gap-3 py-1">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-400">
            Reports
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Ignition Disconnect Report
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
          <label
            htmlFor="ignition-client"
            className="mb-1 block font-medium text-slate-500"
          >
            Client
          </label>
          <Select
            inputId="ignition-client"
            options={clients}
            value={selectedClient}
            onChange={(option) => option && setSelectedClient(option)}
            isSearchable={false}
            styles={selectStyles}
            menuPosition="fixed"
            menuPortalTarget={
              typeof document !== "undefined" ? document.body : undefined
            }
          />
        </div>
        <label className="block w-36 shrink-0 font-medium text-slate-500">
          Distance km
          <input
            type="number"
            min="0"
            step="0.01"
            required
            value={distanceInput}
            onChange={(event) => setDistanceInput(event.target.value)}
            className="mt-1 h-8 w-full rounded-md border border-slate-200 px-2 font-normal tabular-nums text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </label>
        <div className="relative min-w-[190px] flex-1">
          <label
            htmlFor="ignition-search"
            className="mb-1 block font-medium text-slate-500"
          >
            Search
          </label>
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="pointer-events-none absolute bottom-2.5 left-2.5 text-slate-400"
          />
          <input
            id="ignition-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Vehicle, car ID, count or distance..."
            className="h-8 w-full rounded-md border border-slate-200 pl-8 pr-2 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <button
          type="submit"
          disabled={ignitionIssuesReportLoading}
          className="inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-blue-600 px-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FontAwesomeIcon
            icon={faArrowsRotate}
            className={ignitionIssuesReportLoading ? "animate-spin" : ""}
          />
          {ignitionIssuesReportLoading ? "Loading..." : "Run Report"}
        </button>
        {inputError && (
          <p role="alert" className="w-full text-red-600">
            {inputError}
          </p>
        )}
      </form>

      {ignitionIssuesReportError && (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-red-700"
        >
          Unable to load the ignition disconnect report. Please check the values
          and try again.
        </div>
      )}

      <section
        aria-label="Ignition disconnect vehicle records"
        aria-busy={ignitionIssuesReportLoading}
        className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
      >
        {ignitionIssuesReportLoading && reportRows.length === 0 ? (
          <div className="flex items-center justify-center gap-2 px-4 py-10 text-slate-500">
            <FontAwesomeIcon
              icon={faArrowsRotate}
              className="animate-spin text-blue-600"
            />
            Loading ignition disconnect report...
          </div>
        ) : visibleRows.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <FontAwesomeIcon
              icon={faBolt}
              className="mb-2 h-6 w-6 text-slate-300"
            />
            <h2 className="text-sm font-semibold text-slate-700">
              {search.trim()
                ? "No matching vehicles"
                : "No ignition issues found"}
            </h2>
            <p className="mt-1 text-slate-500">
              {search.trim()
                ? "Try a different vehicle, car ID, count or distance."
                : "Change the distance threshold and run the report again."}
            </p>
          </div>
        ) : (
          <div className="relative isolate max-h-[calc(100dvh-230px)] overflow-auto">
            <table className="w-full min-w-[1050px] text-left text-xs leading-4">
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
                  const firstGps = formatGpsTime(row.firstGpsTime);
                  const lastGps = formatGpsTime(row.lastGpsTime);
                  return (
                    <tr
                      key={`${row.carId ?? row.carName ?? index}-${row.lastGpsTime ?? index}`}
                      className="hover:bg-blue-50/40"
                    >
                      <td className="px-3 py-2 font-semibold whitespace-nowrap text-slate-900">
                        {row.carName || "-"}
                        <span className="ml-2 font-mono text-[11px] font-normal text-slate-400">
                          {row.carId || ""}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap tabular-nums">
                        {Number(row.offCount ?? 0).toLocaleString()}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap tabular-nums">
                        {Number(row.onCount ?? 0).toLocaleString()}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap tabular-nums">
                        {firstGps.date}
                        <span className="ml-2 text-slate-500">
                          {firstGps.time}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap tabular-nums">
                        {lastGps.date}
                        <span className="ml-2 text-slate-500">
                          {lastGps.time}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap tabular-nums font-semibold text-slate-800">
                        {Number.isFinite(Number(row.distanceKm))
                          ? `${Number(row.distanceKm).toFixed(2)} km`
                          : "-"}
                      </td>
                      <td className="px-3 py-2 text-[11px] whitespace-nowrap tabular-nums text-slate-500">
                        {row.firstLat ?? "-"}, {row.firstLng ?? "-"}
                        <span className="mx-1 text-slate-300">to</span>
                        {row.lastLat ?? "-"}, {row.lastLng ?? "-"}
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
