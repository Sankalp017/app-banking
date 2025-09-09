import { Button } from "@/components/ui/button";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="flex justify-center mb-6">
          <div className="bg-primary text-primary-foreground p-4 rounded-full">
            <MessageSquare size={48} />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-white">
          Welcome to your AI Assistant
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Let's get started with your account maintenance. It's fast, secure, and easy.
        </p>
        <Button asChild size="lg" className="text-lg px-8 py-6">
          <Link to="/chatbot">Start Maintenance Process ➜</Link>
        </Button>
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          Have your ID document and latest utility bill ready for verification.
        </p>
      </div>
      <div className="absolute bottom-4">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;