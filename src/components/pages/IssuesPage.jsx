import { useState, useEffect, useMemo } from "react";
import issueService from "@/services/api/issueService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import IssueTable from "@/components/organisms/IssueTable";
import FilterSidebar from "@/components/organisms/FilterSidebar";
import IssueDetailModal from "@/components/organisms/IssueDetailModal";
import IssueModal from "@/components/organisms/IssueModal";
import StatsCards from "@/components/organisms/StatsCards";
import Button from "@/components/atoms/Button";
import { toast } from "react-toastify";

const IssuesPage = ({ searchQuery, onCreateIssue, createModalOpen, onCreateModalClose }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [editingIssue, setEditingIssue] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "Id", direction: "desc" });
  const [filters, setFilters] = useState({
    status: [],
    priority: [],
    type: []
  });

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

  const filteredAndSortedIssues = useMemo(() => {
    let filtered = [...issues];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(issue =>
        issue.title.toLowerCase().includes(query) ||
        issue.description.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.status.length > 0) {
      filtered = filtered.filter(issue => filters.status.includes(issue.status));
    }
    if (filters.priority.length > 0) {
      filtered = filtered.filter(issue => filters.priority.includes(issue.priority));
    }
    if (filters.type.length > 0) {
      filtered = filtered.filter(issue => filters.type.includes(issue.type));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === "updatedAt" || sortConfig.key === "createdAt") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [issues, searchQuery, filters, sortConfig]);

  const stats = useMemo(() => ({
    total: issues.length,
    open: issues.filter(i => i.status === "open").length,
    inProgress: issues.filter(i => i.status === "in-progress").length,
    critical: issues.filter(i => i.priority === "critical").length
  }), [issues]);

  const issueCounts = useMemo(() => ({
    status: {
      open: issues.filter(i => i.status === "open").length,
      "in-progress": issues.filter(i => i.status === "in-progress").length,
      testing: issues.filter(i => i.status === "testing").length,
      resolved: issues.filter(i => i.status === "resolved").length,
      closed: issues.filter(i => i.status === "closed").length
    },
    priority: {
      low: issues.filter(i => i.priority === "low").length,
      medium: issues.filter(i => i.priority === "medium").length,
      high: issues.filter(i => i.priority === "high").length,
      critical: issues.filter(i => i.priority === "critical").length
    },
    type: {
      bug: issues.filter(i => i.type === "bug").length,
      feature: issues.filter(i => i.type === "feature").length,
      task: issues.filter(i => i.type === "task").length
    }
  }), [issues]);

  if (loading) return <Loading rows={8} />;
  if (error) return <Error message={error} onRetry={loadIssues} />;

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <FilterSidebar
          filters={filters}
          onFilterChange={setFilters}
          onClearFilters={() => setFilters({ status: [], priority: [], type: [] })}
          issueCounts={issueCounts}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-secondary-50">
        <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          <StatsCards stats={stats} />

          <div className="bg-white rounded-lg border border-secondary-200 shadow-sm overflow-hidden">
            {filteredAndSortedIssues.length === 0 ? (
              <Empty
                title="No issues found"
                description={searchQuery ? "Try adjusting your search or filters" : "Create your first issue to get started"}
                icon="Inbox"
                action={
                  !searchQuery && (
                    <Button onClick={onCreateIssue}>
                      Create Issue
                    </Button>
                  )
                }
              />
            ) : (
              <IssueTable
                issues={filteredAndSortedIssues}
                onIssueClick={(issue) => {
                  setSelectedIssue(issue);
                  setDetailModalOpen(true);
                }}
                sortConfig={sortConfig}
                onSort={setSortConfig}
              />
            )}
          </div>
        </div>
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
        isOpen={createModalOpen || editingIssue !== null}
        onClose={() => {
          onCreateModalClose();
          setEditingIssue(null);
        }}
        issue={editingIssue}
        onSuccess={() => {
          loadIssues();
          setEditingIssue(null);
        }}
      />
    </div>
  );
};

export default IssuesPage;