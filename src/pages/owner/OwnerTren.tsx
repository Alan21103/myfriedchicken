import { useState } from "react";
import { OwnerLayout } from "@/layouts/OwnerLayout";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";
import { bestSellerTrends, leastSellerTrends, menuComparisonData } from "@/data/dummyOwnerData";
import { menuItems } from "@/data/menuData";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TrendType = "best" | "least";
type TimeRange = "weekly" | "monthly" | "yearly";

const OwnerTren = () => {
  const [trendType, setTrendType] = useState<TrendType>("best");
  const [timeRange, setTimeRange] = useState<TimeRange>("weekly");
  const [menu1, setMenu1] = useState(menuItems[0]?.id || "");
  const [menu2, setMenu2] = useState(menuItems[1]?.id || "");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID").format(price);
  };

  const trends = trendType === "best" ? bestSellerTrends : leastSellerTrends;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm">
              {entry.name === "menu1" ? menuItems.find(m => m.id === menu1)?.name : menuItems.find(m => m.id === menu2)?.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <OwnerLayout title="Trend Menu">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tren Menu</h1>
          <p className="text-muted-foreground">Analisis performa menu makanan dan minuman</p>
        </div>

        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trend List */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Trend Menu</h2>
              <div className="flex gap-2">
                <Button
                  variant={trendType === "best" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTrendType("best")}
                >
                  Paling Laris
                </Button>
                <Button
                  variant={trendType === "least" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTrendType("least")}
                >
                  Kurang Laris
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {trends.map((trend, index) => (
                <div key={trend.id} className="flex items-center gap-4 pb-4 border-b border-border last:border-0">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{trend.name}</h3>
                    <p className="text-sm text-muted-foreground">{trend.sold} Terjual</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">Rp {formatPrice(trend.revenue)}</p>
                    <p className={`text-sm flex items-center justify-end gap-1 ${
                      trend.trend > 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {trend.trend > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      {trend.trend > 0 ? "+" : ""}{trend.trend}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="lg:col-span-2 flex items-start justify-end gap-2">
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
          </div>
        </div>

        {/* Comparison Chart */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold uppercase tracking-wider">Perbandingan Tren Menu</h2>
            <div className="flex gap-4">
              <Select value={menu1} onValueChange={setMenu1}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Pilih Menu 1" />
                </SelectTrigger>
                <SelectContent>
                  {menuItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={menu2} onValueChange={setMenu2}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Pilih Menu 2" />
                </SelectTrigger>
                <SelectContent>
                  {menuItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={menuComparisonData}>
                <defs>
                  <linearGradient id="colorMenu1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorMenu2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--foreground))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--foreground))" stopOpacity={0.2} />
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
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="menu1"
                  stroke="hsl(var(--muted-foreground))"
                  fill="url(#colorMenu1)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="menu2"
                  stroke="hsl(var(--foreground))"
                  fill="url(#colorMenu2)"
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

export default OwnerTren;
