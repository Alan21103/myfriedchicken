import { useState } from "react";
import { OwnerLayout } from "@/layouts/OwnerLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Percent, Info, Save } from "lucide-react";
import { taxSettings as initialTaxSettings } from "@/data/dummyOwnerData";
import { toast } from "sonner";

const OwnerPajak = () => {
  const [taxRate, setTaxRate] = useState(initialTaxSettings.taxRate);
  const [serviceFeeRate, setServiceFeeRate] = useState(initialTaxSettings.serviceFeeRate);

  // Demo calculation
  const demoSubtotal = 100000;
  const demoTax = demoSubtotal * (taxRate / 100);
  const demoServiceFee = demoSubtotal * (serviceFeeRate / 100);
  const demoTotal = demoSubtotal + demoTax + demoServiceFee;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID").format(price);
  };

  const handleSave = () => {
    toast.success("Pengaturan pajak berhasil disimpan!");
  };

  return (
    <OwnerLayout title="Kelola Predikat">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pajak & Service Fee</h1>
          <p className="text-muted-foreground">Atur persentase pajak dan service fee restoran</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Settings Card */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Percent className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold">Pengaturan Persentase</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Masukkan persentase pajak dan service fee yang akan diterapkan
            </p>

            <div className="space-y-4">
              <div>
                <Label>Pajak (PPN)</Label>
                <div className="relative mt-1">
                  <Input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    %
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Persentase pajak yang ditambahkan ke setiap transaksi
                </p>
              </div>

              <div>
                <Label>Service Fee (%)</Label>
                <div className="relative mt-1">
                  <Input
                    type="number"
                    value={serviceFeeRate}
                    onChange={(e) => setServiceFeeRate(Number(e.target.value))}
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    %
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Persentase biaya layanan yang ditambahkan ke setiap transaksi
                </p>
              </div>

              <Button onClick={handleSave} className="w-full mt-4">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>

          {/* Preview Card */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold">Contoh Perhitungan</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Simulasi penerapan pajak dan service fee
            </p>

            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>Rp {formatPrice(demoSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pajak ({taxRate}%)</span>
                <span>Rp {formatPrice(demoTax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service Fee ({serviceFeeRate}%)</span>
                <span>Rp {formatPrice(demoServiceFee)}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span>Rp {formatPrice(demoTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
};

export default OwnerPajak;
