import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import StatusBadge from "@/components/molecules/StatusBadge";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import TypeBadge from "@/components/molecules/TypeBadge";

const IssueTable = ({ issues, onIssueClick, sortConfig, onSort }) => {
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return "ChevronsUpDown";
    return sortConfig.direction === "asc" ? "ChevronUp" : "ChevronDown";
  };

  const handleSort = (key) => {
    const direction = 
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    onSort({ key, direction });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-secondary-50 border-y border-secondary-200">
          <tr>
            <th className="px-4 py-3 text-left">
              <button
                onClick={() => handleSort("Id")}
                className="flex items-center gap-1 text-xs font-semibold text-secondary-700 uppercase tracking-wider hover:text-secondary-900 transition-colors duration-150"
              >
                ID
                <ApperIcon name={getSortIcon("Id")} size={14} />
              </button>
            </th>
            <th className="px-4 py-3 text-left">
              <button
                onClick={() => handleSort("title")}
                className="flex items-center gap-1 text-xs font-semibold text-secondary-700 uppercase tracking-wider hover:text-secondary-900 transition-colors duration-150"
              >
                Title
                <ApperIcon name={getSortIcon("title")} size={14} />
              </button>
            </th>
            <th className="px-4 py-3 text-left">
              <span className="text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                Type
              </span>
            </th>
            <th className="px-4 py-3 text-left">
              <button
                onClick={() => handleSort("priority")}
                className="flex items-center gap-1 text-xs font-semibold text-secondary-700 uppercase tracking-wider hover:text-secondary-900 transition-colors duration-150"
              >
                Priority
                <ApperIcon name={getSortIcon("priority")} size={14} />
              </button>
            </th>
            <th className="px-4 py-3 text-left">
              <button
                onClick={() => handleSort("status")}
                className="flex items-center gap-1 text-xs font-semibold text-secondary-700 uppercase tracking-wider hover:text-secondary-900 transition-colors duration-150"
              >
                Status
                <ApperIcon name={getSortIcon("status")} size={14} />
              </button>
            </th>
            <th className="px-4 py-3 text-left">
              <span className="text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                Assignee
              </span>
            </th>
            <th className="px-4 py-3 text-left">
              <button
                onClick={() => handleSort("updatedAt")}
                className="flex items-center gap-1 text-xs font-semibold text-secondary-700 uppercase tracking-wider hover:text-secondary-900 transition-colors duration-150"
              >
                Updated
                <ApperIcon name={getSortIcon("updatedAt")} size={14} />
              </button>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-secondary-200">
          {issues.map((issue) => (
            <tr
              key={issue.Id}
              onClick={() => onIssueClick(issue)}
              className="bg-white hover:bg-secondary-50 cursor-pointer transition-colors duration-150 group"
            >
              <td className="px-4 py-3">
                <span className="text-sm font-mono text-secondary-500 group-hover:text-primary transition-colors duration-150">
                  #{issue.Id}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-start gap-2 min-w-[300px]">
                  <div 
                    className={`w-1 h-full rounded-full ${
                      issue.priority === "critical" ? "bg-red-500" :
                      issue.priority === "high" ? "bg-orange-500" :
                      issue.priority === "medium" ? "bg-yellow-500" :
                      "bg-gray-400"
                    }`}
                  />
                  <span className="text-sm font-medium text-secondary-900 group-hover:text-primary transition-colors duration-150">
                    {issue.title}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3">
                <TypeBadge type={issue.type} showLabel={false} />
              </td>
              <td className="px-4 py-3">
                <PriorityBadge priority={issue.priority} />
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={issue.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <ApperIcon name="User" size={12} className="text-primary-600" />
                  </div>
                  <span className="text-sm text-secondary-700 truncate max-w-[150px]">
                    {issue.assignee || "Unassigned"}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-secondary-600">
                  {formatDistanceToNow(new Date(issue.updatedAt), { addSuffix: true })}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IssueTable;