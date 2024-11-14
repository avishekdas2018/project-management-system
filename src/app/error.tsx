"use client"
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

const ErrorPage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-y-4">
      <AlertTriangle className="size-10 text-red-500" />
      <p className="text-sm">Something went worng</p>
      <Button variant={"secondary"} size={"sm"}>
        <Link href={"/"}>
        Back to Home
        </Link>
      </Button>
    </div>
  );
}

export default ErrorPage;