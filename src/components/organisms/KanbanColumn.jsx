import { motion } from "framer-motion";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import TypeBadge from "@/components/molecules/TypeBadge";

const IssueCard = ({ issue, onIssueClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: issue.Id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onIssueClick(issue)}
      className="bg-white rounded-lg border border-secondary-200 p-3 hover:shadow-md cursor-grab active:cursor-grabbing transition-all duration-200 group touch-none"
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
  );
};

const KanbanColumn = ({ id, title, issues, color, icon, onIssueClick }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  const issueIds = issues.map(issue => issue.Id);
return (
    <div className="flex flex-col min-w-[300px] h-full">
      <div className={`flex items-center gap-2 px-4 py-3 rounded-t-lg ${color} border-b border-secondary-200`}>
        <ApperIcon name={icon} size={18} className="text-secondary-700" />
        <h3 className="text-sm font-semibold text-secondary-900">{title}</h3>
        <span className="ml-auto text-sm font-medium text-secondary-600 bg-white px-2 py-0.5 rounded-full">
          {issues.length}
        </span>
      </div>
      
      <div 
        ref={setNodeRef}
        className={`flex-1 p-3 space-y-3 overflow-y-auto scrollbar-thin transition-colors duration-200 ${
          isOver ? 'bg-primary-100/50' : 'bg-secondary-50'
        }`}
      >
        <SortableContext items={issueIds} strategy={verticalListSortingStrategy}>
{issues.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-secondary-400">
              <ApperIcon name="Inbox" size={32} className="mb-2" />
              <p className="text-sm">No issues</p>
            </div>
          ) : (
            issues.map(issue => (
              <IssueCard
                key={issue.Id}
                issue={issue}
                onIssueClick={onIssueClick}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
};

export default KanbanColumn;