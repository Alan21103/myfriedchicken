import { ReactNode } from "react";
import { OwnerSidebar } from "@/components/owner/OwnerSidebar";
import { OwnerHeader } from "@/components/owner/OwnerHeader";

interface OwnerLayoutProps {
  children: ReactNode;
  title: string;
}

export const OwnerLayout = ({ children, title }: OwnerLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <OwnerSidebar />
      <div className="flex-1 flex flex-col">
        <OwnerHeader title={title} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
