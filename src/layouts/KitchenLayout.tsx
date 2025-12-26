import { ReactNode } from "react";
import { KitchenSidebar } from "@/components/kitchen/KitchenSidebar";
import { KitchenHeader } from "@/components/kitchen/KitchenHeader";

interface KitchenLayoutProps {
  children: ReactNode;
  title: string;
}

export const KitchenLayout = ({ children, title }: KitchenLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <KitchenSidebar />
      <div className="flex-1 flex flex-col">
        <KitchenHeader title={title} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
