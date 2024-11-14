import { AlertTriangleIcon } from "lucide-react";

interface PageErrorProps {
  message: string;
}

export const PageError = ({ message = "Some went wrong" }: PageErrorProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <AlertTriangleIcon className="size-10 text-rose-800 mb-2" />
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
    </div>
  );
};