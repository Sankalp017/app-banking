import { Bot, Pencil } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface BotMessageProps {
  children: ReactNode;
  className?: string;
  onEdit?: () => void;
  onContinueEdit?: () => void;
}

export const BotMessage = ({ children, className, onEdit, onContinueEdit }: BotMessageProps) => {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="bg-primary text-primary-foreground flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full">
        <Bot size={20} />
      </div>
      <div className="flex-1 group">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 max-w-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div>{children}</div>
          {onContinueEdit && (
            <div className="mt-4">
              <Button onClick={onContinueEdit} size="sm">
                Continue Edit
              </Button>
            </div>
          )}
        </div>
        {onEdit && (
          <div className="pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <Pencil className="h-3 w-3 mr-2" />
              Edit
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};