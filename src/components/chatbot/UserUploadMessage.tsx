import { FileText } from "lucide-react";
import { UserMessage } from "./UserMessage";

interface UserUploadMessageProps {
  fileName: string;
  fileType: string;
}

export const UserUploadMessage = ({ fileName, fileType }: UserUploadMessageProps) => {
  return (
    <UserMessage>
      <div className="flex items-center gap-3">
        <div className="bg-white/20 rounded-md p-2">
          <FileText className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="font-medium">{fileName}</p>
          <p className="text-sm text-white/80">{fileType}</p>
        </div>
      </div>
    </UserMessage>
  );
};