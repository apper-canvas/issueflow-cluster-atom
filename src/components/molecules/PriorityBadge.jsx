import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const PriorityBadge = ({ priority }) => {
  const priorityConfig = {
    low: { 
      variant: "default", 
      icon: "ArrowDown",
      label: "Low"
    },
    medium: { 
      variant: "warning", 
      icon: "Minus",
      label: "Medium"
    },
    high: { 
      variant: "danger", 
      icon: "ArrowUp",
      label: "High"
    },
    critical: { 
      variant: "danger", 
      icon: "AlertTriangle",
      label: "Critical",
      className: "animate-pulse"
    }
  };

  const config = priorityConfig[priority] || priorityConfig.low;

  return (
    <Badge variant={config.variant} className={config.className}>
      <ApperIcon name={config.icon} size={12} />
      {config.label}
    </Badge>
  );
};

export default PriorityBadge;