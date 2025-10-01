import { cn } from "@/utils/cn";

const Loading = ({ className, rows = 5 }) => {
  return (
    <div className={cn("space-y-3 animate-pulse", className)}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg border border-secondary-200 p-4">
          <div className="flex items-center gap-4">
            <div className="h-4 w-16 bg-secondary-200 rounded"></div>
            <div className="h-4 flex-1 bg-secondary-200 rounded"></div>
            <div className="h-6 w-20 bg-secondary-200 rounded-full"></div>
            <div className="h-6 w-24 bg-secondary-200 rounded-full"></div>
            <div className="h-4 w-32 bg-secondary-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loading;