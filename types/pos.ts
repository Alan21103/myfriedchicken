export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  needsWaitingTime: boolean; // true = butuh waktu, false = cepat
  stock: number; // jumlah stok, -1 = unlimited
  lowStockThreshold?: number; // threshold untuk notifikasi stok menipis
  isBestSeller?: boolean;
  predikat?: string; // e.g., "Best Seller", "New", "Promo"
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  orderCode: string;
  items: CartItem[];
  orderType: 'dine-in' | 'take-away';
  tableNumber?: number;
  customerName?: string; // untuk take-away yang butuh waktu
  subtotal: number;
  tax: number;
  serviceFee: number;
  total: number;
  paymentMethod: 'cash' | 'qr' | 'card';
  amountPaid: number;
  change: number;
  createdAt: Date;
}

export type OrderType = 'dine-in' | 'take-away';
export type PaymentMethod = 'cash' | 'qr' | 'card';

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Predikat {
  id: string;
  name: string;
  color: string;
}

// Dummy data types for Owner features
export interface SalesData {
  date: string;
  revenue: number;
  previousRevenue?: number;
}

export interface MenuTrend {
  id: string;
  name: string;
  sold: number;
  revenue: number;
  trend: number; // percentage change
}

export interface TaxSettings {
  taxRate: number;
  serviceFeeRate: number;
}
