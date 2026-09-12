import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";

const ReportComingSoon = () => {
  const { pathname } = useLocation();
  const title = pathname.endsWith("ignition-disconnect") ? "Ignition Disconnect" : "Data Delay";

  return (
    <div className="space-y-5">
      <div><p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-400">Reports</p><h1 className="text-2xl font-bold text-slate-900">{title}</h1></div>
      <section className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
        <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><FontAwesomeIcon icon={faClock} className="h-7 w-7" /></span>
        <span className="mb-3 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">Coming soon</span>
        <h2 className="text-xl font-semibold text-slate-900">{title} Report</h2>
        <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">This report is not available yet. You can continue reviewing vehicle updates in the NR Report.</p>
        <Link to="/dashboard/nr-report" className="mt-6 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Go to NR Report</Link>
      </section>
    </div>
  );
};

export default ReportComingSoon;
