import { useState, useEffect, useMemo } from "react";
import issueService from "@/services/api/issueService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import KanbanColumn from "@/components/organisms/KanbanColumn";
import IssueDetailModal from "@/components/organisms/IssueDetailModal";
import IssueModal from "@/components/organisms/IssueModal";
import Button from "@/components/atoms/Button";
import { toast } from "react-toastify";

const BoardPage = ({ onCreateIssue }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [editingIssue, setEditingIssue] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const loadIssues = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await issueService.getAll();
      setIssues(data);
    } catch (err) {
      setError(err.message || "Failed to load issues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this issue?")) return;
    
    try {
      await issueService.delete(id);
      toast.success("Issue deleted successfully!");
      loadIssues();
    } catch (err) {
      toast.error("Failed to delete issue");
    }
  };

  const columns = useMemo(() => [
    {
      id: "open",
      title: "Open",
      color: "bg-blue-50",
      icon: "Circle",
      issues: issues.filter(i => i.status === "open")
    },
    {
      id: "in-progress",
      title: "In Progress",
      color: "bg-purple-50",
      icon: "RefreshCw",
      issues: issues.filter(i => i.status === "in-progress")
    },
    {
      id: "testing",
      title: "Testing",
      color: "bg-yellow-50",
      icon: "TestTube2",
      issues: issues.filter(i => i.status === "testing")
    },
    {
      id: "resolved",
      title: "Resolved",
      color: "bg-green-50",
      icon: "CheckCircle2",
      issues: issues.filter(i => i.status === "resolved")
    },
    {
      id: "closed",
      title: "Closed",
      color: "bg-secondary-50",
      icon: "XCircle",
      issues: issues.filter(i => i.status === "closed")
    }
  ], [issues]);

  if (loading) return <Loading rows={5} />;
  if (error) return <Error message={error} onRetry={loadIssues} />;

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden bg-secondary-50">
      <div className="h-full p-4 sm:p-6 lg:p-8">
        {issues.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <Empty
              title="No issues to display"
              description="Create your first issue to see it on the board"
              icon="Kanban"
              action={<Button onClick={onCreateIssue}>Create Issue</Button>}
            />
          </div>
        ) : (
          <div className="h-full flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
            {columns.map(column => (
              <KanbanColumn
                key={column.id}
                title={column.title}
                issues={column.issues}
                color={column.color}
                icon={column.icon}
                onIssueClick={(issue) => {
                  setSelectedIssue(issue);
                  setDetailModalOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <IssueDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        issue={selectedIssue}
        onEdit={(issue) => {
          setEditingIssue(issue);
          setDetailModalOpen(false);
        }}
        onDelete={handleDelete}
      />

      <IssueModal
        isOpen={editingIssue !== null}
        onClose={() => setEditingIssue(null)}
        issue={editingIssue}
        onSuccess={() => {
          loadIssues();
          setEditingIssue(null);
        }}
      />
    </div>
  );
};

export default BoardPage;