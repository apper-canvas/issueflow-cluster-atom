import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import TypeBadge from "@/components/molecules/TypeBadge";

const KanbanColumn = ({ title, issues, color, icon, onIssueClick }) => {
  return (
    <div className="flex flex-col min-w-[300px] h-full">
      <div className={`flex items-center gap-2 px-4 py-3 rounded-t-lg ${color} border-b border-secondary-200`}>
        <ApperIcon name={icon} size={18} className="text-secondary-700" />
        <h3 className="text-sm font-semibold text-secondary-900">{title}</h3>
        <span className="ml-auto text-sm font-medium text-secondary-600 bg-white px-2 py-0.5 rounded-full">
          {issues.length}
        </span>
      </div>
      
      <div className="flex-1 p-3 space-y-3 overflow-y-auto scrollbar-thin bg-secondary-50">
        {issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-secondary-400">
            <ApperIcon name="Inbox" size={32} className="mb-2" />
            <p className="text-sm">No issues</p>
          </div>
        ) : (
          issues.map((issue, index) => (
            <motion.div
              key={issue.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              onClick={() => onIssueClick(issue)}
              className="bg-white rounded-lg border border-secondary-200 p-3 hover:shadow-md cursor-pointer transition-all duration-200 group"
            >
              <div className="flex items-start gap-2 mb-2">
                <div 
                  className={`w-1 h-full rounded-full flex-shrink-0 ${
                    issue.priority === "critical" ? "bg-red-500" :
                    issue.priority === "high" ? "bg-orange-500" :
                    issue.priority === "medium" ? "bg-yellow-500" :
                    "bg-gray-400"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-secondary-500">#{issue.Id}</span>
                    <TypeBadge type={issue.type} showLabel={false} />
                  </div>
                  <h4 className="text-sm font-medium text-secondary-900 group-hover:text-primary transition-colors duration-200 line-clamp-2">
                    {issue.title}
                  </h4>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-secondary-100">
                <PriorityBadge priority={issue.priority} />
                <div className="flex items-center gap-1.5 text-xs text-secondary-500">
                  <ApperIcon name="Clock" size={12} />
                  {formatDistanceToNow(new Date(issue.updatedAt), { addSuffix: true })}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;