import { Order } from "@/types/pos";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Printer, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReceiptModalProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
}

export const ReceiptModal = ({ open, onClose, order }: ReceiptModalProps) => {
  if (!order) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card p-0 overflow-hidden">
        {/* Success Header */}
        <div className="gradient-success text-success-foreground p-6 text-center">
          <div className="w-16 h-16 bg-background/20 rounded-full flex items-center justify-center mx-auto mb-3 animate-scale-in">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold">Pembayaran Berhasil!</h2>
          <p className="text-sm opacity-90 mt-1">Transaksi telah selesai</p>
        </div>

        {/* Receipt Content */}
        <div className="p-6">
          {/* Order Info */}
          <div className="text-center pb-4 border-b border-dashed border-border">
            <p className="text-2xl font-bold text-foreground">{order.orderCode}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {formatDate(order.createdAt)}
            </p>
            <span
              className={cn(
                "inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold",
                order.orderType === "dine-in"
                  ? "bg-pos-badge-dine text-success-foreground"
                  : "bg-pos-badge-takeaway text-primary-foreground"
              )}
            >
              {order.orderType === "dine-in"
                ? order.tableNumber
                  ? `Dine In - Meja ${order.tableNumber}`
                  : "Dine In - Ambil Langsung"
                : order.customerName
                  ? `Take Away - ${order.customerName}`
                  : "Take Away"}
            </span>
          </div>

          {/* Items */}
          <div className="py-4 border-b border-dashed border-border space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-foreground">
                  {item.name} x{item.quantity}
                </span>
                <span className="text-muted-foreground">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="py-4 space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Pajak (10%)</span>
              <span>{formatPrice(order.tax)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Service Fee (5%)</span>
              <span>{formatPrice(order.serviceFee)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-foreground pt-2 border-t border-border">
              <span>Total</span>
              <span className="text-primary">{formatPrice(order.total)}</span>
            </div>
            {order.paymentMethod === "cash" && (
              <>
                <div className="flex justify-between text-muted-foreground">
                  <span>Bayar</span>
                  <span>{formatPrice(order.amountPaid)}</span>
                </div>
                <div className="flex justify-between font-semibold text-success">
                  <span>Kembalian</span>
                  <span>{formatPrice(order.change)}</span>
                </div>
              </>
            )}
            <div className="flex justify-between text-muted-foreground pt-2">
              <span>Metode</span>
              <span className="capitalize">
                {order.paymentMethod === "cash"
                  ? "Tunai"
                  : order.paymentMethod === "qr"
                  ? "QRIS"
                  : "Kartu"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              <X className="w-4 h-4 mr-2" />
              Tutup
            </Button>
            <Button className="flex-1 gradient-primary text-primary-foreground">
              <Printer className="w-4 h-4 mr-2" />
              Cetak Struk
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
