import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, X, UtensilsCrossed, Send, Zap, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { CartItem } from "@/types/pos";

interface WaitingTimeModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (needsWaiting: boolean, tableNumber?: number, customerName?: string) => void;
  orderCode: string;
  items: CartItem[];
  orderType: "dine-in" | "take-away";
}

export const WaitingTimeModal = ({
  open,
  onClose,
  onConfirm,
  orderCode,
  items,
  orderType,
}: WaitingTimeModalProps) => {
  const [step, setStep] = useState<"question" | "input">("question");
  const [tableNumber, setTableNumber] = useState("");
  const [customerName, setCustomerName] = useState("");

  const isTakeAway = orderType === "take-away";

  // Analyze items - simplified to boolean status
  const slowItems = items.filter((item) => item.needsWaitingTime);
  const fastItems = items.filter((item) => !item.needsWaitingTime);
  const hasSlowItems = slowItems.length > 0;

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setStep("question");
      setTableNumber("");
      setCustomerName("");
    }
  }, [open]);

  const handleYes = () => {
    setStep("input");
  };

  const handleNo = () => {
    onConfirm(false);
  };

  const handleConfirm = () => {
    if (isTakeAway) {
      if (customerName.trim()) {
        onConfirm(true, undefined, customerName.trim());
      }
    } else {
      if (tableNumber) {
        onConfirm(true, parseInt(tableNumber));
      }
    }
  };

  const isInputValid = isTakeAway ? customerName.trim() !== "" : tableNumber !== "";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card p-0 overflow-hidden">
        {step === "question" ? (
          <>
            {/* Header */}
            <div className={cn(
              "p-6 text-center",
              hasSlowItems ? "bg-warning/10" : "bg-success/10"
            )}>
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3",
                hasSlowItems ? "bg-warning/20 animate-pulse-soft" : "bg-success/20"
              )}>
                {hasSlowItems ? (
                  <Clock className="w-8 h-8 text-warning" />
                ) : (
                  <Zap className="w-8 h-8 text-success" />
                )}
              </div>
              <h2 className="text-xl font-bold text-foreground">
                {hasSlowItems ? "Pesanan Membutuhkan Waktu" : "Pesanan Cepat Siap"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Kode: <span className="font-semibold">{orderCode}</span>
              </p>
            </div>

            {/* Items Analysis */}
            <div className="p-6">
              {/* Slow Items */}
              {slowItems.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-warning" />
                    <span className="text-sm font-medium text-warning">
                      Butuh Waktu
                    </span>
                  </div>
                  <div className="space-y-2">
                    {slowItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-warning/5 border border-warning/20"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-md object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {item.name} x{item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-warning bg-warning/10 px-2 py-1 rounded-full">
                          Butuh Waktu
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fast Items */}
              {fastItems.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-success" />
                    <span className="text-sm font-medium text-success">
                      Cepat
                    </span>
                  </div>
                  <div className="space-y-2">
                    {fastItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-success/5 border border-success/20"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-md object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {item.name} x{item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-success bg-success/10 px-2 py-1 rounded-full">
                          Cepat
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Question */}
              <p className="text-center text-foreground font-medium mb-4 pt-2 border-t border-border">
                {hasSlowItems
                  ? isTakeAway
                    ? "Apakah pelanggan akan menunggu pesanan?"
                    : "Apakah pelanggan akan menunggu di meja?"
                  : isTakeAway
                    ? "Apakah perlu mencatat nama pelanggan?"
                    : "Apakah pelanggan membutuhkan nomor meja?"}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={handleNo}
                  variant="outline"
                  className="h-20 flex-col gap-2 border-2 hover:border-success hover:bg-success/5"
                >
                  <X className="w-6 h-6 text-muted-foreground" />
                  <span className="font-semibold">Tidak</span>
                  <span className="text-xs text-muted-foreground">
                    Ambil langsung
                  </span>
                </Button>
                <Button
                  onClick={handleYes}
                  variant="outline"
                  className={cn(
                    "h-20 flex-col gap-2 border-2",
                    hasSlowItems
                      ? "border-warning/50 bg-warning/5 hover:border-warning hover:bg-warning/10"
                      : "hover:border-primary hover:bg-primary/5"
                  )}
                >
                  {isTakeAway ? (
                    <User className={cn(
                      "w-6 h-6",
                      hasSlowItems ? "text-warning" : "text-primary"
                    )} />
                  ) : (
                    <UtensilsCrossed className={cn(
                      "w-6 h-6",
                      hasSlowItems ? "text-warning" : "text-primary"
                    )} />
                  )}
                  <span className="font-semibold">Ya, Tunggu</span>
                  <span className="text-xs text-muted-foreground">
                    {isTakeAway ? "Input nama" : "Input no. meja"}
                  </span>
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Header for Input */}
            <div className="bg-primary/10 p-6 text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3 animate-scale-in">
                {isTakeAway ? (
                  <User className="w-8 h-8 text-primary" />
                ) : (
                  <UtensilsCrossed className="w-8 h-8 text-primary" />
                )}
              </div>
              <h2 className="text-xl font-bold text-foreground">
                {isTakeAway ? "Input Nama Pelanggan" : "Input Nomor Meja"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Pesanan akan dikirim ke dapur
              </p>
            </div>

            {/* Input Section */}
            <div className="p-6 animate-fade-in">
              {isTakeAway ? (
                <div className="mb-6">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Nama Pelanggan
                  </label>
                  <Input
                    type="text"
                    placeholder="Masukkan nama pelanggan"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="text-center text-xl font-bold h-16"
                    autoFocus
                  />
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Nomor Meja Pelanggan
                    </label>
                    <Input
                      type="number"
                      placeholder="Masukkan nomor meja"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="text-center text-2xl font-bold h-16"
                      autoFocus
                    />
                  </div>

                  {/* Quick Table Numbers */}
                  <div className="grid grid-cols-5 gap-2 mb-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <button
                        key={num}
                        onClick={() => setTableNumber(num.toString())}
                        className={cn(
                          "py-3 rounded-lg font-semibold transition-all",
                          tableNumber === num.toString()
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        )}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep("question")}
                  className="flex-1"
                >
                  Kembali
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={!isInputValid}
                  className="flex-1 gradient-primary text-primary-foreground"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Kirim ke Dapur
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};