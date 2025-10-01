import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Empty = ({ 
  title = "No items found", 
  description = "Get started by creating your first item",
  action,
  icon = "Inbox",
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4", className)}>
      <div className="w-16 h-16 rounded-full bg-secondary-100 flex items-center justify-center mb-4">
        <ApperIcon name={icon} className="w-8 h-8 text-secondary-400" />
      </div>
      <h3 className="text-lg font-semibold text-secondary-900 mb-2">{title}</h3>
      <p className="text-secondary-600 text-center mb-6 max-w-md">{description}</p>
      {action && action}
    </div>
  );
};

export default Empty;