import { User } from "lucide-react";
import { ReactNode } from "react";

interface UserMessageProps {
  children: ReactNode;
  className?: string;
}

export const UserMessage = ({ children, className }: UserMessageProps) => {
  return (
    <div className={`flex items-start gap-3 justify-end ${className}`}>
      <div className="bg-blue-600 text-primary-foreground rounded-lg p-4 max-w-lg shadow-sm">
        {children}
      </div>
      <div className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full">
        <User size={20} />
      </div>
    </div>
  );
};