import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    open: { 
      variant: "info", 
      icon: "Circle",
      label: "Open"
    },
    "in-progress": { 
      variant: "purple", 
      icon: "RefreshCw",
      label: "In Progress"
    },
    testing: { 
      variant: "warning", 
      icon: "TestTube2",
      label: "Testing"
    },
    resolved: { 
      variant: "success", 
      icon: "CheckCircle2",
      label: "Resolved"
    },
    closed: { 
      variant: "default", 
      icon: "XCircle",
      label: "Closed"
    }
  };

  const config = statusConfig[status] || statusConfig.open;

  return (
    <Badge variant={config.variant} className="gap-1">
      <ApperIcon name={config.icon} size={12} />
      {config.label}
    </Badge>
  );
};

export default StatusBadge;