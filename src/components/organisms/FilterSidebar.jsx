import ApperIcon from "@/components/ApperIcon";
import FilterCheckbox from "@/components/molecules/FilterCheckbox";
import Button from "@/components/atoms/Button";

const FilterSidebar = ({ filters, onFilterChange, onClearFilters, issueCounts }) => {
  const statusOptions = [
    { value: "open", label: "Open" },
    { value: "in-progress", label: "In Progress" },
    { value: "testing", label: "Testing" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" }
  ];

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" }
  ];

  const typeOptions = [
    { value: "bug", label: "Bug" },
    { value: "feature", label: "Feature" },
    { value: "task", label: "Task" }
  ];

  const hasActiveFilters = 
    filters.status.length > 0 || 
    filters.priority.length > 0 || 
    filters.type.length > 0;

  return (
    <div className="w-full h-full bg-white border-r border-secondary-200 overflow-y-auto scrollbar-thin">
      <div className="p-4 border-b border-secondary-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-secondary-900 flex items-center gap-2">
            <ApperIcon name="Filter" size={16} />
            Filters
          </h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-xs"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Status Filter */}
        <div>
          <h4 className="text-xs font-semibold text-secondary-700 uppercase tracking-wider mb-3">
            Status
          </h4>
          <div className="space-y-1">
            {statusOptions.map((option) => (
              <FilterCheckbox
                key={option.value}
                label={option.label}
                checked={filters.status.includes(option.value)}
                onChange={(checked) => {
                  const newStatus = checked
                    ? [...filters.status, option.value]
                    : filters.status.filter(s => s !== option.value);
                  onFilterChange({ ...filters, status: newStatus });
                }}
                count={issueCounts?.status?.[option.value] || 0}
              />
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div>
          <h4 className="text-xs font-semibold text-secondary-700 uppercase tracking-wider mb-3">
            Priority
          </h4>
          <div className="space-y-1">
            {priorityOptions.map((option) => (
              <FilterCheckbox
                key={option.value}
                label={option.label}
                checked={filters.priority.includes(option.value)}
                onChange={(checked) => {
                  const newPriority = checked
                    ? [...filters.priority, option.value]
                    : filters.priority.filter(p => p !== option.value);
                  onFilterChange({ ...filters, priority: newPriority });
                }}
                count={issueCounts?.priority?.[option.value] || 0}
              />
            ))}
          </div>
        </div>

        {/* Type Filter */}
        <div>
          <h4 className="text-xs font-semibold text-secondary-700 uppercase tracking-wider mb-3">
            Type
          </h4>
          <div className="space-y-1">
            {typeOptions.map((option) => (
              <FilterCheckbox
                key={option.value}
                label={option.label}
                checked={filters.type.includes(option.value)}
                onChange={(checked) => {
                  const newType = checked
                    ? [...filters.type, option.value]
                    : filters.type.filter(t => t !== option.value);
                  onFilterChange({ ...filters, type: newType });
                }}
                count={issueCounts?.type?.[option.value] || 0}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;