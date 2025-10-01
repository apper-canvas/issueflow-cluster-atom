import React, { useEffect, useMemo, useState } from "react";
import { DndContext, DragOverlay, KeyboardSensor, PointerSensor, closestCorners, useSensor, useSensors } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import IssueDetailModal from "@/components/organisms/IssueDetailModal";
import IssueModal from "@/components/organisms/IssueModal";
import KanbanColumn from "@/components/organisms/KanbanColumn";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import issueService from "@/services/api/issueService";

const BoardPage = ({ onCreateIssue }) => {
const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [editingIssue, setEditingIssue] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );
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

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeIssueId = parseInt(active.id);
    const newStatus = over.id;

    const activeIssue = issues.find(i => i.Id === activeIssueId);
    
    if (!activeIssue || activeIssue.status === newStatus) return;

    try {
      await issueService.update(activeIssueId, { status: newStatus });
      
      setIssues(prevIssues =>
        prevIssues.map(issue =>
          issue.Id === activeIssueId
            ? { ...issue, status: newStatus }
            : issue
        )
      );
      
      toast.success(`Issue moved to ${newStatus.replace('-', ' ')}`);
    } catch (err) {
      toast.error("Failed to update issue status");
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };
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

  const activeIssue = activeId ? issues.find(i => i.Id === parseInt(activeId)) : null;

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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
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
                  id={column.id}
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
      </div>

      <DragOverlay>
        {activeIssue ? (
          <div className="bg-white rounded-lg border-2 border-primary shadow-2xl p-3 w-[300px] opacity-90">
            <div className="flex items-start gap-2 mb-2">
              <div 
                className={`w-1 h-full rounded-full flex-shrink-0 ${
                  activeIssue.priority === "critical" ? "bg-red-500" :
                  activeIssue.priority === "high" ? "bg-orange-500" :
                  activeIssue.priority === "medium" ? "bg-yellow-500" :
                  "bg-gray-400"
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-secondary-500">#{activeIssue.Id}</span>
                </div>
                <h4 className="text-sm font-medium text-secondary-900 line-clamp-2">
                  {activeIssue.title}
                </h4>
              </div>
            </div>
          </div>
) : null}
      </DragOverlay>

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
    </DndContext>
  );
};

export default BoardPage;