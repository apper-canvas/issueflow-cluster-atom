import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import ReactApexChart from "react-apexcharts";
import issueService from "@/services/api/issueService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";

const DashboardPage = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadIssues = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await issueService.getAll();
      setIssues(data);
    } catch (err) {
      setError(err.message || "Failed to load issues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, []);

const statusData = useMemo(() => {
    const counts = {
      open: issues.filter(i => i.status === "open").length,
      "in-progress": issues.filter(i => i.status === "in-progress").length,
      testing: issues.filter(i => i.status === "testing").length,
      resolved: issues.filter(i => i.status === "resolved").length,
      closed: issues.filter(i => i.status === "closed").length
    };
    return {
      series: Object.values(counts),
      labels: ["Open", "In Progress", "Testing", "Resolved", "Closed"]
    };
  }, [issues]);

  const priorityData = useMemo(() => {
    const counts = {
      critical: issues.filter(i => i.priority === "critical").length,
      high: issues.filter(i => i.priority === "high").length,
      medium: issues.filter(i => i.priority === "medium").length,
      low: issues.filter(i => i.priority === "low").length
    };
    return {
      series: Object.values(counts),
      labels: ["Critical", "High", "Medium", "Low"]
    };
  }, [issues]);

  const typeData = useMemo(() => {
    const counts = {
      bug: issues.filter(i => i.type === "bug").length,
      feature: issues.filter(i => i.type === "feature").length,
      task: issues.filter(i => i.type === "task").length
    };
    return {
      series: Object.values(counts),
      labels: ["Bug", "Feature", "Task"]
    };
  }, [issues]);

  const chartOptions = {
    chart: {
      type: "donut",
      fontFamily: "Inter, sans-serif"
    },
    labels: [],
    colors: ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#6b7280"],
    legend: {
      position: "bottom",
      fontSize: "14px"
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(0)}%`
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%"
        }
      }
    }
  };

  if (loading) return <Loading rows={4} />;
  if (error) return <Error message={error} onRetry={loadIssues} />;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-secondary-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">Dashboard</h1>
          <p className="text-secondary-600">Overview of all issues and their status</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
{[
            { label: "Total Issues", value: issues.length, icon: "Inbox", color: "primary" },
            { label: "Open", value: issues.filter(i => i.status === "open").length, icon: "Circle", color: "blue" },
            { label: "In Progress", value: issues.filter(i => i.status === "in-progress").length, icon: "RefreshCw", color: "purple" },
            { label: "Resolved", value: issues.filter(i => i.status === "resolved").length, icon: "CheckCircle2", color: "green" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-lg border border-secondary-200 p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`bg-${stat.color}-50 p-3 rounded-lg`}>
                  <ApperIcon name={stat.icon} size={24} className={`text-${stat.color}-600`} />
                </div>
              </div>
              <p className="text-sm font-medium text-secondary-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-secondary-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white rounded-lg border border-secondary-200 p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Status Distribution</h3>
            <ReactApexChart
              options={{ ...chartOptions, labels: statusData.labels }}
              series={statusData.series}
              type="donut"
              height={300}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white rounded-lg border border-secondary-200 p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Priority Breakdown</h3>
            <ReactApexChart
              options={{
                ...chartOptions,
                labels: priorityData.labels,
                colors: ["#ef4444", "#f59e0b", "#eab308", "#94a3b8"]
              }}
              series={priorityData.series}
              type="donut"
              height={300}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-white rounded-lg border border-secondary-200 p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Issue Types</h3>
            <ReactApexChart
              options={{
                ...chartOptions,
                labels: typeData.labels,
                colors: ["#ef4444", "#3b82f6", "#10b981"]
              }}
              series={typeData.series}
              type="donut"
              height={300}
            />
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="bg-white rounded-lg border border-secondary-200 p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Recent Issues</h3>
          <div className="space-y-3">
{issues.slice(0, 5).map((issue) => (
              <div key={issue.Id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary-50 transition-colors duration-150">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  issue.priority === "critical" ? "bg-red-500" :
                  issue.priority === "high" ? "bg-orange-500" :
                  issue.priority === "medium" ? "bg-yellow-500" :
                  "bg-gray-400"
                }`} />
                <span className="text-sm font-mono text-secondary-500">#{issue.Id}</span>
                <span className="flex-1 text-sm text-secondary-900 truncate">{issue.title}</span>
                <span className="text-xs text-secondary-600 flex-shrink-0">{issue.status}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;