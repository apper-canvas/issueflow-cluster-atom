import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const SearchBar = ({ value, onChange, placeholder = "Search...", className }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={cn("relative", className)}>
      <ApperIcon 
        name="Search" 
        size={18} 
        className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200",
          isFocused ? "text-primary" : "text-secondary-400"
        )}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 bg-white border border-secondary-300 rounded-lg text-sm text-secondary-900 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
      />
    </div>
  );
};

export default SearchBar;