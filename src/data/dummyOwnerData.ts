import { SalesData, MenuTrend, TaxSettings, Predikat } from "@/types/pos";
import { Category } from "@/types/pos";

// Predikat data
export const predikats: Predikat[] = [
  { id: "1", name: "Best Seller", color: "#6B7280" },
  { id: "2", name: "New", color: "#3B82F6" },
  { id: "3", name: "Promo", color: "#EF4444" },
  { id: "4", name: "Recommended", color: "#10B981" },
];

// Category management data
export const ownerCategories: Category[] = [
  { id: "makanan", name: "Makanan", icon: "🍛" },
  { id: "minuman", name: "Minuman", icon: "🥤" },
  { id: "snack", name: "Snack", icon: "🍟" },
  { id: "dessert", name: "Dessert", icon: "🍰" },
];

// Tax settings
export const taxSettings: TaxSettings = {
  taxRate: 10,
  serviceFeeRate: 5,
};

// Weekly sales data
export const weeklySalesData: SalesData[] = [
  { date: "Senin", revenue: 2500000, previousRevenue: 2200000 },
  { date: "Selasa", revenue: 2800000, previousRevenue: 2500000 },
  { date: "Rabu", revenue: 3200000, previousRevenue: 2900000 },
  { date: "Kamis", revenue: 2900000, previousRevenue: 3100000 },
  { date: "Jumat", revenue: 3500000, previousRevenue: 3300000 },
  { date: "Sabtu", revenue: 4200000, previousRevenue: 3800000 },
  { date: "Minggu", revenue: 3800000, previousRevenue: 3500000 },
];

// Monthly sales data
export const monthlySalesData: SalesData[] = [
  { date: "Jan", revenue: 45000000, previousRevenue: 42000000 },
  { date: "Feb", revenue: 48000000, previousRevenue: 45000000 },
  { date: "Mar", revenue: 52000000, previousRevenue: 48000000 },
  { date: "Apr", revenue: 49000000, previousRevenue: 52000000 },
  { date: "Mei", revenue: 55000000, previousRevenue: 49000000 },
  { date: "Jun", revenue: 58000000, previousRevenue: 55000000 },
  { date: "Jul", revenue: 62000000, previousRevenue: 58000000 },
  { date: "Agu", revenue: 59000000, previousRevenue: 62000000 },
  { date: "Sep", revenue: 65000000, previousRevenue: 59000000 },
  { date: "Okt", revenue: 68000000, previousRevenue: 65000000 },
  { date: "Nov", revenue: 72000000, previousRevenue: 68000000 },
  { date: "Des", revenue: 78000000, previousRevenue: 72000000 },
];

// Yearly sales data
export const yearlySalesData: SalesData[] = [
  { date: "2020", revenue: 450000000, previousRevenue: 380000000 },
  { date: "2021", revenue: 520000000, previousRevenue: 450000000 },
  { date: "2022", revenue: 680000000, previousRevenue: 520000000 },
  { date: "2023", revenue: 750000000, previousRevenue: 680000000 },
  { date: "2024", revenue: 820000000, previousRevenue: 750000000 },
];

// Menu trends - best sellers
export const bestSellerTrends: MenuTrend[] = [
  { id: "1", name: "PaNas 1", sold: 245, revenue: 8575000, trend: 15.2 },
  { id: "2", name: "Ayam Krispy", sold: 198, revenue: 4575000, trend: 5.2 },
  { id: "3", name: "PaNas 2 With Rice", sold: 135, revenue: 1575000, trend: -15.2 },
];

// Menu trends - least sellers
export const leastSellerTrends: MenuTrend[] = [
  { id: "1", name: "Es Krim Vanilla", sold: 12, revenue: 240000, trend: -8.5 },
  { id: "2", name: "Pisang Goreng", sold: 18, revenue: 270000, trend: -5.2 },
  { id: "3", name: "Jus Jeruk", sold: 25, revenue: 375000, trend: 2.1 },
];

// Comparison data for menu trends
export const menuComparisonData = [
  { date: "Senin", menu1: 35, menu2: 28 },
  { date: "Selasa", menu1: 42, menu2: 32 },
  { date: "Rabu", menu1: 48, menu2: 38 },
  { date: "Kamis", menu1: 38, menu2: 45 },
  { date: "Jumat", menu1: 45, menu2: 42 },
  { date: "Sabtu", menu1: 52, menu2: 48 },
  { date: "Minggu", menu1: 42, menu2: 35 },
];
