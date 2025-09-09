import { BotMessage } from "./BotMessage";
import { Button } from "@/components/ui/button";
import { ReactNode, useState } from "react";

type ButtonVariant = "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";

interface Cta {
  label: ReactNode;
  onClick: () => void;
  variant?: ButtonVariant;
}

interface ActionableMessageProps {
  children: ReactNode;
  ctas: Cta[];
}

export const ActionableMessage = ({ children, ctas }: ActionableMessageProps) => {
  const [actionsTaken, setActionsTaken] = useState(false);

  const handleClick = (onClick: () => void) => {
    if (actionsTaken) return;
    setActionsTaken(true);
    onClick();
  };

  return (
    <BotMessage>
      {children}
      <div className="flex flex-wrap gap-2 mt-3">
        {ctas.map((cta, index) => (
          <Button
            key={index}
            onClick={() => handleClick(cta.onClick)}
            variant={cta.variant || "default"}
            disabled={actionsTaken}
          >
            {cta.label}
          </Button>
        ))}
      </div>
    </BotMessage>
  );
};