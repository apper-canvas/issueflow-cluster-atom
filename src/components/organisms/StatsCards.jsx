import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const StatsCards = ({ stats }) => {
  const cards = [
    {
      label: "Total Issues",
      value: stats.total,
      icon: "Inbox",
      color: "text-primary-600",
      bg: "bg-primary-50",
      trend: null
    },
    {
      label: "Open",
      value: stats.open,
      icon: "Circle",
      color: "text-blue-600",
      bg: "bg-blue-50",
      trend: null
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      icon: "RefreshCw",
      color: "text-purple-600",
      bg: "bg-purple-50",
      trend: null
    },
    {
      label: "Critical",
      value: stats.critical,
      icon: "AlertTriangle",
      color: "text-red-600",
      bg: "bg-red-50",
      trend: stats.critical > 0 ? "up" : null
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white rounded-lg border border-secondary-200 p-4 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600 mb-1">{card.label}</p>
              <p className="text-3xl font-bold text-secondary-900">{card.value}</p>
            </div>
            <div className={`${card.bg} p-3 rounded-lg`}>
              <ApperIcon name={card.icon} size={24} className={card.color} />
            </div>
          </div>
          {card.trend === "up" && (
            <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
              <ApperIcon name="TrendingUp" size={14} />
              <span>Requires attention</span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;