import { useState } from "react";
import { CartItem, PaymentMethod, OrderType } from "@/types/pos";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Banknote, CreditCard, QrCode, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { TAX_RATE, SERVICE_FEE_RATE } from "@/data/menuData";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  orderType: OrderType;
  onConfirmPayment: (paymentMethod: PaymentMethod, amountPaid: number) => void;
}

export const PaymentModal = ({
  open,
  onClose,
  items,
  orderType,
  onConfirmPayment,
}: PaymentModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [amountPaid, setAmountPaid] = useState("");

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
  const change = Number(amountPaid) - total;

  const quickAmounts = [50000, 100000, 150000, 200000];

  const handleConfirm = () => {
    const paid = paymentMethod === "cash" ? Number(amountPaid) : total;
    onConfirmPayment(paymentMethod, paid);
    setAmountPaid("");
    setPaymentMethod("cash");
  };

  const isValidPayment =
    paymentMethod !== "cash" || (paymentMethod === "cash" && Number(amountPaid) >= total);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            Pembayaran
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-pos-cart-bg rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Tipe Pesanan</span>
              <span
                className={cn(
                  "text-xs font-semibold px-2 py-1 rounded-full",
                  orderType === "dine-in"
                    ? "bg-pos-badge-dine text-success-foreground"
                    : "bg-pos-badge-takeaway text-primary-foreground"
                )}
              >
                {orderType === "dine-in" ? "Dine In" : "Take Away"}
              </span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} item)</span>
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
            </div>
            <div className="flex justify-between font-bold text-xl text-foreground mt-3 pt-3 border-t border-border">
              <span>Total</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Metode Pembayaran
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "cash", label: "Tunai", icon: Banknote },
                { id: "qr", label: "QRIS", icon: QrCode },
                { id: "card", label: "Kartu", icon: CreditCard },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-200",
                    paymentMethod === method.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <method.icon
                    className={cn(
                      "w-6 h-6",
                      paymentMethod === method.id ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm font-medium",
                      paymentMethod === method.id ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {method.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Cash Amount Input */}
          {paymentMethod === "cash" && (
            <div className="space-y-3 animate-fade-in">
              <label className="text-sm font-medium text-foreground">
                Jumlah Uang Diterima
              </label>
              <Input
                type="number"
                placeholder="Masukkan jumlah uang"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                className="text-lg font-semibold h-12"
              />
              <div className="flex gap-2 flex-wrap">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setAmountPaid(amount.toString())}
                    className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
                  >
                    {formatPrice(amount)}
                  </button>
                ))}
              </div>
              {Number(amountPaid) >= total && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-success/10 text-success animate-scale-in">
                  <span className="font-medium">Kembalian</span>
                  <span className="font-bold text-lg">{formatPrice(change)}</span>
                </div>
              )}
            </div>
          )}

          {/* QR/Card Info */}
          {paymentMethod !== "cash" && (
            <div className="text-center py-6 bg-pos-cart-bg rounded-lg animate-fade-in">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 text-success" />
              <p className="text-sm text-muted-foreground">
                {paymentMethod === "qr"
                  ? "Scan QRIS untuk melanjutkan pembayaran"
                  : "Tap atau insert kartu untuk melanjutkan"}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Batal
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!isValidPayment}
              className="flex-1 gradient-primary text-primary-foreground"
            >
              Konfirmasi Pembayaran
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
