import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(({ 
  className,
  label,
  error,
  options = [],
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-secondary-700 mb-1.5">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={cn(
          "w-full px-3 py-2 bg-white border rounded-md text-secondary-900",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
          "transition-all duration-200",
          error && "border-red-500 focus:ring-red-500",
          !error && "border-secondary-300",
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;