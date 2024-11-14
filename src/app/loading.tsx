"use client"

import { Loader } from "lucide-react";

const Loading = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <Loader className="size-10 animate-spin text-muted-foreground"  />
    </div>
  );
}

export default Loading;