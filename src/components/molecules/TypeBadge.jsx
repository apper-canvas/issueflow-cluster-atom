import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const TypeBadge = ({ type, showLabel = true }) => {
  const typeConfig = {
    bug: { 
      icon: "Bug", 
      color: "text-red-600",
      label: "Bug"
    },
    feature: { 
      icon: "Star", 
      color: "text-blue-600",
      label: "Feature"
    },
    task: { 
      icon: "CheckSquare", 
      color: "text-green-600",
      label: "Task"
    }
  };

  const config = typeConfig[type] || typeConfig.task;

  return (
    <div className="inline-flex items-center gap-1.5">
      <ApperIcon name={config.icon} size={16} className={config.color} />
      {showLabel && (
        <span className={cn("text-sm font-medium", config.color)}>
          {config.label}
        </span>
      )}
    </div>
  );
};

export default TypeBadge;