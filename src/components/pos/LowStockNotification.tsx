import { MenuItem } from "@/types/pos";
import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface LowStockNotificationProps {
  items: MenuItem[];
  onDismiss: (itemId: string) => void;
}

export const LowStockNotification = ({ items, onDismiss }: LowStockNotificationProps) => {
  if (items.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {items.map((item) => (
        <div
          key={item.id}
          className={cn(
            "bg-orange-500 text-white p-4 rounded-lg shadow-pos-lg",
            "flex items-start gap-3 animate-slide-in-right"
          )}
        >
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-sm">Notifikasi dari Dapur</p>
            <p className="text-sm opacity-90">
              Stok <span className="font-bold">{item.name}</span> menipis! 
              Tersisa {item.stock} porsi.
            </p>
          </div>
          <button
            onClick={() => onDismiss(item.id)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
