import { UserButton } from "@/features/auth/components/user-button";
import Image from "next/image";
import Link from "next/link";
import { PropsWithChildren } from "react";

interface StandaloneLayoutProps {
  children: React.ReactNode;
}


const StandaloneLayout = ({ children }: PropsWithChildren) => {
  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex items-center justify-between h-[73px]">
          <Link href="/">
            <Image src="/logo.svg" alt="Logo" width={152} height={56} />
          </Link>
          <UserButton/>
        </nav>
        <div className="flex flex-col items-center justify-center py-4">
          {children}
        </div>
      </div>
    </main>
  );
}

export default StandaloneLayout;