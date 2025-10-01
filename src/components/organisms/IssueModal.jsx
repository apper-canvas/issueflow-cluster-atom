import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import issueService from "@/services/api/issueService";
import { toast } from "react-toastify";

const IssueModal = ({ isOpen, onClose, issue = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "bug",
    priority: "medium",
    status: "open",
    assignee: "",
    reporter: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (issue) {
      setFormData({
        title: issue.title || "",
        description: issue.description || "",
        type: issue.type || "bug",
        priority: issue.priority || "medium",
        status: issue.status || "open",
        assignee: issue.assignee || "",
        reporter: issue.reporter || ""
      });
    } else {
      setFormData({
        title: "",
        description: "",
        type: "bug",
        priority: "medium",
        status: "open",
        assignee: "",
        reporter: ""
      });
    }
    setErrors({});
  }, [issue, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.reporter.trim()) newErrors.reporter = "Reporter is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (issue) {
        await issueService.update(issue.Id, formData);
        toast.success("Issue updated successfully!");
      } else {
        await issueService.create(formData);
        toast.success("Issue created successfully!");
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error("Failed to save issue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

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
          className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200 bg-gradient-to-r from-primary-50 to-accent-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <ApperIcon name={issue ? "Edit" : "Plus"} size={20} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-secondary-900">
                {issue ? "Edit Issue" : "Create New Issue"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-secondary-600 hover:bg-white/50 transition-colors duration-200"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)] scrollbar-thin">
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              error={errors.title}
              placeholder="Brief description of the issue"
            />

            <Textarea
              label="Description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              error={errors.description}
              placeholder="Detailed description of the issue"
              rows={5}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Type"
                value={formData.type}
                onChange={(e) => handleChange("type", e.target.value)}
                options={[
                  { value: "bug", label: "Bug" },
                  { value: "feature", label: "Feature" },
                  { value: "task", label: "Task" }
                ]}
              />

              <Select
                label="Priority"
                value={formData.priority}
                onChange={(e) => handleChange("priority", e.target.value)}
                options={[
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" },
                  { value: "critical", label: "Critical" }
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Status"
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                options={[
                  { value: "open", label: "Open" },
                  { value: "in-progress", label: "In Progress" },
                  { value: "testing", label: "Testing" },
                  { value: "resolved", label: "Resolved" },
                  { value: "closed", label: "Closed" }
                ]}
              />

              <Input
                label="Assignee"
                value={formData.assignee}
                onChange={(e) => handleChange("assignee", e.target.value)}
                placeholder="Person assigned to this issue"
              />
            </div>

            <Input
              label="Reporter"
              value={formData.reporter}
              onChange={(e) => handleChange("reporter", e.target.value)}
              error={errors.reporter}
              placeholder="Person reporting this issue"
            />
          </form>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-secondary-200 bg-secondary-50">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="animate-spin" />
                  <span className="ml-2">Saving...</span>
                </>
              ) : (
                <>
                  <ApperIcon name={issue ? "Save" : "Plus"} size={16} />
                  <span className="ml-2">{issue ? "Update Issue" : "Create Issue"}</span>
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default IssueModal;