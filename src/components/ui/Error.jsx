import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Error = ({ message = "Something went wrong", onRetry, className }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4", className)}>
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-secondary-900 mb-2">Error Loading Data</h3>
      <p className="text-secondary-600 text-center mb-6 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center gap-2"
        >
          <ApperIcon name="RefreshCw" size={16} />
          Try Again
        </button>
      )}
    </div>
  );
};

export default Error;