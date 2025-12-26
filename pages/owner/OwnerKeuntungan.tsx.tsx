import { useState } from "react";
import { OwnerLayout } from "@/layouts/OwnerLayout";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { weeklySalesData, monthlySalesData, yearlySalesData } from "@/data/dummyOwnerData";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type TimeRange = "weekly" | "monthly" | "yearly" | "comparison";

const OwnerKeuntungan = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("weekly");

  const getChartData = () => {
    switch (timeRange) {
      case "weekly":
        return weeklySalesData;
      case "monthly":
        return monthlySalesData;
      case "yearly":
        return yearlySalesData;
      case "comparison":
        return weeklySalesData;
      default:
        return weeklySalesData;
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `Rp ${(value / 1000000).toFixed(1)}jt`;
    }
    return `Rp ${(value / 1000).toFixed(0)}rb`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-foreground text-background rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium mb-1">
            {timeRange === "comparison" ? "Minggu Ini" : label}
          </p>
          <p className="text-lg font-bold">
            Rp {new Intl.NumberFormat("id-ID").format(payload[0]?.value || 0)}
          </p>
          {payload[1] && (
            <>
              <p className="text-sm font-medium mt-2 mb-1">Minggu Lalu</p>
              <p className="text-lg font-bold">
                Rp {new Intl.NumberFormat("id-ID").format(payload[1]?.value || 0)}
              </p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <OwnerLayout title="Progress Keuntungan">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Progress Keuntungan</h1>
          <p className="text-muted-foreground">Analisis Keuntungan Berdasarkan Timeline</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Grafik Progress Keuntungan</h2>
              <Info className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex gap-2">
              <Button
                variant={timeRange === "weekly" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("weekly")}
              >
                Mingguan
              </Button>
              <Button
                variant={timeRange === "monthly" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("monthly")}
              >
                Bulanan
              </Button>
              <Button
                variant={timeRange === "yearly" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("yearly")}
              >
                Tahunan
              </Button>
              <Button
                variant={timeRange === "comparison" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("comparison")}
              >
                Banding
              </Button>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getChartData()}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--foreground))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--foreground))" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={formatCurrency}
                />
                <Tooltip content={<CustomTooltip />} />
                {timeRange === "comparison" && (
                  <Area
                    type="monotone"
                    dataKey="previousRevenue"
                    stroke="hsl(var(--muted-foreground))"
                    fill="url(#colorPrevious)"
                    strokeWidth={2}
                  />
                )}
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--foreground))"
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
};

export default OwnerKeuntungan;
