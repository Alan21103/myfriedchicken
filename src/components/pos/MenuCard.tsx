import { MenuItem } from "@/types/pos";
import { Plus, Clock, Zap, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuCardProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
  onViewDetail: (item: MenuItem) => void;
}

export const MenuCard = ({ item, onAdd, onViewDetail }: MenuCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const isLowStock = item.stock !== -1 && item.lowStockThreshold && item.stock <= item.lowStockThreshold;
  const isOutOfStock = item.stock !== -1 && item.stock <= 0;

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent triggering when clicking the add button
    if ((e.target as HTMLElement).closest('button')) return;
    onViewDetail(item);
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOutOfStock) {
      onAdd(item);
    }
  };

  return (
    <div
      className={cn(
        "group relative bg-card rounded-lg overflow-hidden shadow-pos-sm",
        "hover:shadow-pos-lg transition-all duration-300 cursor-pointer",
        "border border-border/50 hover:border-primary/30",
        "animate-fade-in",
        isOutOfStock && "opacity-60"
      )}
      onClick={handleCardClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Status Badge - Top Left */}
        <div className={cn(
          "absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1",
          item.needsWaitingTime 
            ? "bg-amber-500/90 text-white" 
            : "bg-emerald-500/90 text-white"
        )}>
          {item.needsWaitingTime ? (
            <>
              <Clock className="w-3 h-3" />
              Butuh Waktu
            </>
          ) : (
            <>
              <Zap className="w-3 h-3" />
              Cepat
            </>
          )}
        </div>

        {/* Low Stock Warning - Top Right */}
        {isLowStock && !isOutOfStock && (
          <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium bg-orange-500/90 text-white flex items-center gap-1 animate-pulse-soft">
            <AlertTriangle className="w-3 h-3" />
            Stok: {item.stock}
          </div>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
            <span className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-semibold text-sm">
              Stok Habis
            </span>
          </div>
        )}

        {/* Add Button */}
        {!isOutOfStock && (
          <button
            onClick={handleAddClick}
            className={cn(
              "absolute bottom-3 right-3 w-10 h-10 rounded-full",
              "gradient-primary shadow-pos-md",
              "flex items-center justify-center",
              "transform translate-y-4 opacity-0",
              "group-hover:translate-y-0 group-hover:opacity-100",
              "transition-all duration-300 hover:scale-110",
              "text-primary-foreground"
            )}
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-card-foreground line-clamp-1 mb-1">
          {item.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 min-h-[40px]">
          {item.description}
        </p>
        <p className="font-bold text-pos-price text-lg">
          {formatPrice(item.price)}
        </p>
      </div>
    </div>
  );
};
