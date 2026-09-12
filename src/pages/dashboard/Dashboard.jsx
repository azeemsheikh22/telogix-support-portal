import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCar,
  faWifi,
  faSignal,
  faUsers,
  faArrowUp,
  faArrowDown,
  faRoute,
  faFileAlt,
  faUserCheck,
  faUpload,
  faServer,
  faClock,
  faBuilding,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  // Dashboard Statistics
  const stats = [
    {
      title: "Total Vehicles",
      value: "1,245",
      change: "+8%",
      changeValue: "92",
      icon: faCar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: "up",
    },
    {
      title: "Online Vehicles",
      value: "982",
      change: "+12%",
      changeValue: "106",
      icon: faWifi,
      color: "text-green-600",
      bgColor: "bg-green-50",
      trend: "up",
    },
    {
      title: "Offline Vehicles",
      value: "263",
      change: "-6%",
      changeValue: "17",
      icon: faSignal,
      color: "text-red-600",
      bgColor: "bg-red-50",
      trend: "down",
    },
    {
      title: "Office Users",
      value: "48",
      change: "+5%",
      changeValue: "3",
      icon: faUsers,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      trend: "up",
    },
  ];

  // Quick Reports
  const quickReports = [
    {
      icon: faClock,
      title: "Data Delay Report",
      description: "Check delayed vehicle data",
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      icon: faRoute,
      title: "Distance Report",
      description: "View vehicle distance",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: faFileAlt,
      title: "Client Fleet",
      description: "Manage client fleet",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      icon: faUserCheck,
      title: "Vehicle Verification",
      description: "Verify vehicle details",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  // Management Modules
  const managementModules = [
    {
      icon: faClock,
      title: "Data Delay",
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      icon: faRoute,
      title: "Distance Report",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: faFileAlt,
      title: "Client Fleet",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      icon: faUserCheck,
      title: "Vehicle Verification",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      icon: faUpload,
      title: "Bulk Upload",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      icon: faServer,
      title: "Device Status",
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Telogix Management System
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Monitor vehicles, devices, reports and daily operations.
          </p>
        </div>

        {/* Current Status */}
        <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>

          <span className="text-xs font-medium text-gray-600">
            System Online
          </span>
        </div>
      </div>

      {/* =====================================================
          STAT CARDS
      ====================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              {/* Icon */}
              <div
                className={`w-11 h-11 rounded-lg ${stat.bgColor} flex items-center justify-center`}
              >
                <FontAwesomeIcon
                  icon={stat.icon}
                  className={`text-lg ${stat.color}`}
                />
              </div>

              {/* Percentage */}
              <div
                className={`flex items-center gap-1 text-xs font-medium ${
                  stat.trend === "up"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                <FontAwesomeIcon
                  icon={
                    stat.trend === "up"
                      ? faArrowUp
                      : faArrowDown
                  }
                />

                {stat.change}
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {stat.value}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                {stat.title}
              </p>

              <p className="text-xs text-gray-400 mt-2">
                {stat.changeValue} from last month
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* =====================================================
            VEHICLE & DEVICE STATUS
        ====================================================== */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Vehicle & Device Status
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Current fleet connectivity
              </p>
            </div>

            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <FontAwesomeIcon
                icon={faServer}
                className="text-blue-600"
              />
            </div>
          </div>

          {/* Status Items */}
          <div className="space-y-3">

            {/* Online */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faWifi}
                    className="text-green-600 text-sm"
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Online
                  </p>

                  <p className="text-xs text-gray-500">
                    Devices responding
                  </p>
                </div>
              </div>

              <span className="text-sm font-bold text-green-600">
                982
              </span>
            </div>

            {/* Offline */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faSignal}
                    className="text-red-600 text-sm"
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Offline
                  </p>

                  <p className="text-xs text-gray-500">
                    Devices not responding
                  </p>
                </div>
              </div>

              <span className="text-sm font-bold text-red-600">
                263
              </span>
            </div>

            {/* Data Delay */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faClock}
                    className="text-orange-600 text-sm"
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Data Delay
                  </p>

                  <p className="text-xs text-gray-500">
                    Vehicles with delayed data
                  </p>
                </div>
              </div>

              <span className="text-sm font-bold text-orange-600">
                24
              </span>
            </div>

            {/* Active Devices */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faServer}
                    className="text-blue-600 text-sm"
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Active Devices
                  </p>

                  <p className="text-xs text-gray-500">
                    Connected tracking devices
                  </p>
                </div>
              </div>

              <span className="text-sm font-bold text-blue-600">
                1,018
              </span>
            </div>
          </div>
        </div>

        {/* =====================================================
            QUICK REPORTS
        ====================================================== */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Quick Reports
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Frequently used reports
              </p>
            </div>

            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <FontAwesomeIcon
                icon={faChartLine}
                className="text-blue-600"
              />
            </div>
          </div>

          {/* Reports */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickReports.map((report, index) => (
              <button
                key={index}
                type="button"
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-gray-50 transition-colors duration-200 cursor-pointer text-left"
              >
                <div
                  className={`w-10 h-10 rounded-lg ${report.bg} flex items-center justify-center flex-shrink-0`}
                >
                  <FontAwesomeIcon
                    icon={report.icon}
                    className={report.color}
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-800">
                    {report.title}
                  </p>

                  <p className="text-[11px] text-gray-500 mt-1">
                    {report.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* =====================================================
          MANAGEMENT MODULES
      ====================================================== */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <FontAwesomeIcon
                icon={faBuilding}
                className="text-blue-600"
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Management Modules
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                System operations and management
              </p>
            </div>
          </div>
        </div>

        {/* Modules */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {managementModules.map((module, index) => (
            <button
              key={index}
              type="button"
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
            >
              <div
                className={`w-11 h-11 rounded-lg ${module.bg} flex items-center justify-center mb-3`}
              >
                <FontAwesomeIcon
                  icon={module.icon}
                  className={module.color}
                />
              </div>

              <span className="text-xs font-semibold text-gray-700 text-center">
                {module.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;