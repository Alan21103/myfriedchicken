import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MenuItem } from "@/types/pos";
import { Plus, Minus, Clock, Zap, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface MenuDetailModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: MenuItem, quantity: number) => void;
}

export const MenuDetailModal = ({ item, isOpen, onClose, onAdd }: MenuDetailModalProps) => {
  const [quantity, setQuantity] = useState(1);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAdd = () => {
    if (item) {
      onAdd(item, quantity);
      setQuantity(1);
      onClose();
    }
  };

  const handleClose = () => {
    setQuantity(1);
    onClose();
  };

  if (!item) return null;

  const isLowStock = item.stock !== -1 && item.lowStockThreshold && item.stock <= item.lowStockThreshold;
  const isOutOfStock = item.stock !== -1 && item.stock <= 0;
  const maxQuantity = item.stock === -1 ? 99 : item.stock;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">Detail Menu</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image */}
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            {/* Status Badge */}
            <div className={cn(
              "absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1",
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

            {/* Low Stock Warning */}
            {isLowStock && !isOutOfStock && (
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium bg-orange-500/90 text-white flex items-center gap-1 animate-pulse-soft">
                <AlertTriangle className="w-3 h-3" />
                Stok Menipis ({item.stock})
              </div>
            )}

            {/* Out of Stock */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
                <span className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-semibold">
                  Stok Habis
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-card-foreground">{item.name}</h3>
            <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            <p className="text-2xl font-bold text-pos-price">{formatPrice(item.price)}</p>
            
            {item.stock !== -1 && (
              <p className={cn(
                "text-sm",
                isLowStock ? "text-orange-500" : "text-muted-foreground"
              )}>
                Stok tersedia: {item.stock}
              </p>
            )}
          </div>

          {/* Quantity Selector */}
          {!isOutOfStock && (
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-xl font-semibold w-8 text-center text-card-foreground">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                  disabled={quantity >= maxQuantity}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <Button
                onClick={handleAdd}
                className="gradient-primary text-primary-foreground px-6"
              >
                Tambah {formatPrice(item.price * quantity)}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
