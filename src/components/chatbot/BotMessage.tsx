import { Bot } from "lucide-react";
import { ReactNode } from "react";

interface BotMessageProps {
  children: ReactNode;
  className?: string;
}

export const BotMessage = ({ children, className }: BotMessageProps) => {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="bg-primary text-primary-foreground flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full">
        <Bot size={20} />
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 max-w-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {children}
      </div>
    </div>
  );
};