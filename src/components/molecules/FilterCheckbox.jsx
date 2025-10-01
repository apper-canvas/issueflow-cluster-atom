import { cn } from "@/utils/cn";

const FilterCheckbox = ({ label, checked, onChange, count }) => {
  return (
    <label className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-secondary-50 cursor-pointer transition-colors duration-150 group">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-secondary-300 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 cursor-pointer transition-all duration-150"
      />
      <span className="flex-1 text-sm text-secondary-700 group-hover:text-secondary-900 transition-colors duration-150">
        {label}
      </span>
      {count !== undefined && (
        <span className="text-xs text-secondary-500 font-medium">{count}</span>
      )}
    </label>
  );
};

export default FilterCheckbox;