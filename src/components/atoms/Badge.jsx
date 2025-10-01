import { cn } from "@/utils/cn";

const Badge = ({ 
  children, 
  variant = "default",
  className 
}) => {
  const variants = {
    default: "bg-secondary-100 text-secondary-700",
    primary: "bg-primary-100 text-primary-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700"
  };
  
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-150",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};

export default Badge;