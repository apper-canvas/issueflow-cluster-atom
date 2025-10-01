import { motion, AnimatePresence } from "framer-motion";
import { format, isPast } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import TypeBadge from "@/components/molecules/TypeBadge";

const IssueDetailModal = ({ isOpen, onClose, issue, onEdit, onDelete }) => {
  if (!isOpen || !issue) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-secondary-200 bg-gradient-to-r from-primary-50 to-accent-50">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-mono text-secondary-500">#{issue.Id}</span>
                  <TypeBadge type={issue.type} />
                </div>
                <h2 className="text-2xl font-bold text-secondary-900 mb-3">
                  {issue.title}
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={issue.status} />
                  <PriorityBadge priority={issue.priority} />
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-secondary-600 hover:bg-white/50 transition-colors duration-200"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)] scrollbar-thin">
            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold text-secondary-700 mb-2">Description</h3>
              <p className="text-secondary-900 leading-relaxed whitespace-pre-wrap">
                {issue.description}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-secondary-700 mb-2">Assignee</h3>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" size={16} className="text-primary-600" />
                  </div>
                  <span className="text-secondary-900">
                    {issue.assignee || "Unassigned"}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-secondary-700 mb-2">Reporter</h3>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center">
                    <ApperIcon name="UserCircle" size={16} className="text-accent-600" />
                  </div>
                  <span className="text-secondary-900">{issue.reporter}</span>
                </div>
              </div>

              <div>
<h3 className="text-sm font-semibold text-secondary-700 mb-2">Created</h3>
                <div className="flex items-center gap-2 text-secondary-900">
                  <ApperIcon name="Calendar" size={16} className="text-secondary-500" />
                  {format(new Date(issue.createdAt), "MMM d, yyyy 'at' h:mm a")}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-secondary-700 mb-2">Last Updated</h3>
                <div className="flex items-center gap-2 text-secondary-900">
                  <ApperIcon name="Clock" size={16} className="text-secondary-500" />
                  {format(new Date(issue.updatedAt), "MMM d, yyyy 'at' h:mm a")}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-secondary-700 mb-2">Due Date</h3>
                {issue.dueDate ? (
                  <div>
                    <div className="flex items-center gap-2 text-secondary-900">
                      <ApperIcon name="CalendarClock" size={16} className="text-secondary-500" />
                      {format(new Date(issue.dueDate), "MMM d, yyyy 'at' h:mm a")}
                    </div>
                    {isPast(new Date(issue.dueDate)) && issue.status !== "resolved" && issue.status !== "closed" && (
                      <div className="flex items-center gap-1.5 mt-2 text-red-600">
                        <ApperIcon name="AlertCircle" size={14} />
                        <span className="text-xs font-semibold uppercase">Overdue</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-secondary-400">
                    <ApperIcon name="CalendarClock" size={16} />
                    <span className="text-sm">No due date set</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-secondary-200 bg-secondary-50">
            <Button variant="danger" size="md" onClick={() => { onDelete(issue.Id); onClose(); }}>
              <ApperIcon name="Trash2" size={16} />
              <span className="ml-2">Delete</span>
            </Button>
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
              <Button onClick={() => { onEdit(issue); onClose(); }}>
                <ApperIcon name="Edit" size={16} />
                <span className="ml-2">Edit Issue</span>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default IssueDetailModal;