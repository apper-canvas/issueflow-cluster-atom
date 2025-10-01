import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Textarea = forwardRef(({ 
  className,
  error,
  label,
  rows = 4,
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-secondary-700 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          "w-full px-3 py-2 bg-white border rounded-md text-secondary-900",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
          "placeholder:text-secondary-400 transition-all duration-200 resize-none",
          error && "border-red-500 focus:ring-red-500",
          !error && "border-secondary-300",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Textarea.displayName = "Textarea";

export default Textarea;