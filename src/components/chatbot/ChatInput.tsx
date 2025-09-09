import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Send } from "lucide-react";

export const ChatInput = () => {
  return (
    <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm">
      <div className="p-4">
        <div className="relative max-w-3xl mx-auto">
          <Input
            placeholder="Account maintenance is handled through the prompts above."
            className="pr-24 h-12 rounded-full"
            disabled
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <Button size="icon" variant="ghost" disabled>
              <Mic className="h-5 w-5" />
            </Button>
            <Button size="icon" className="rounded-full" disabled>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};