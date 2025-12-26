import { CartItem, OrderType } from "@/types/pos";
import { Minus, Plus, Trash2, ShoppingBag, UtensilsCrossed, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TAX_RATE, SERVICE_FEE_RATE } from "@/data/menuData";

interface CartSidebarProps {
  items: CartItem[];
  orderType: OrderType;
  onOrderTypeChange: (type: OrderType) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export const CartSidebar = ({
  items,
  orderType,
  onOrderTypeChange,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartSidebarProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const serviceFee = subtotal * SERVICE_FEE_RATE;
  const total = subtotal + tax + serviceFee;

  return (
    <div className="h-full flex flex-col bg-pos-sidebar border-l border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingBag className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-lg text-foreground">Pesanan</h2>
          {items.length > 0 && (
            <span className="ml-auto bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
              {items.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </div>

        {/* Order Type Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => onOrderTypeChange("dine-in")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg",
              "text-sm font-medium transition-all duration-200",
              orderType === "dine-in"
                ? "bg-pos-badge-dine text-success-foreground shadow-pos-sm"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            <UtensilsCrossed className="w-4 h-4" />
            Dine In
          </button>
          <button
            onClick={() => onOrderTypeChange("take-away")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg",
              "text-sm font-medium transition-all duration-200",
              orderType === "take-away"
                ? "bg-pos-badge-takeaway text-primary-foreground shadow-pos-sm"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            <Package className="w-4 h-4" />
            Take Away
          </button>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Belum ada pesanan</p>
            <p className="text-xs mt-1">Pilih menu untuk memulai</p>
          </div>
        ) : (
          items.map((item, index) => (
            <div
              key={item.id}
              className="bg-pos-cart-bg rounded-lg p-3 animate-slide-in-right"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-md object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-foreground line-clamp-1">
                    {item.name}
                  </h4>
                  <p className="text-pos-price font-semibold text-sm mt-1">
                    {formatPrice(item.price)}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-medium text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-md bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="w-7 h-7 rounded-md bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive/20 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-border/50">
                <span className="text-xs text-muted-foreground">Subtotal</span>
                <span className="font-semibold text-sm text-foreground">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      {items.length > 0 && (
        <div className="border-t border-border p-4 bg-card">
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Pajak (10%)</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Service Fee (5%)</span>
              <span>{formatPrice(serviceFee)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-foreground pt-2 border-t border-border">
              <span>Total</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>
          </div>
          <Button
            onClick={onCheckout}
            className="w-full gradient-primary text-primary-foreground font-semibold py-6 text-base hover:opacity-90 transition-opacity"
          >
            Bayar Sekarang
          </Button>
        </div>
      )}
    </div>
  );
};
