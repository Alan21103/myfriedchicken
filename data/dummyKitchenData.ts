import { CartItem } from "@/types/pos";

export type ItemCookingStatus = "menunggu" | "dimasak" | "selesai";
export type OrderCookingStatus = "menunggu" | "dimasak" | "selesai";

export interface KitchenOrderItem extends CartItem {
  cookingStatus: ItemCookingStatus;
  notes?: string;
}

export interface KitchenOrder {
  id: string;
  orderCode: string;
  orderType: "dine-in" | "take-away";
  tableNumber?: number;
  customerName?: string;
  items: KitchenOrderItem[];
  orderTime: string;
  status: OrderCookingStatus;
  assignedTo?: string;
}

export interface StockItem {
  id: string;
  code: string;
  name: string;
  category: string;
  stock: number;
  inQueue: number;
  status: "Rendah" | "Cukup";
  orders: {
    orderCode: string;
    orderTime: string;
    quantity: number;
    orderType: "dine-in" | "take-away";
  }[];
}

export const dummyKitchenOrders: KitchenOrder[] = [
  {
    id: "1",
    orderCode: "PSN-001",
    orderType: "dine-in",
    tableNumber: 5,
    customerName: "Sahroni",
    orderTime: "15.30",
    status: "dimasak",
    items: [
      {
        id: "1",
        name: "Chicken Burger Deluxe",
        description: "Burger ayam dengan keju",
        price: 45000,
        image: "/placeholder.svg",
        category: "makanan",
        needsWaitingTime: true,
        stock: 50,
        quantity: 3,
        cookingStatus: "menunggu",
        notes: "tanpa sayur"
      },
      {
        id: "8",
        name: "Mineral Water",
        description: "Air mineral",
        price: 5000,
        image: "/placeholder.svg",
        category: "minuman",
        needsWaitingTime: false,
        stock: 100,
        quantity: 2,
        cookingStatus: "selesai"
      },
      {
        id: "9",
        name: "Fruit Tea Lemon",
        description: "Teh buah rasa lemon",
        price: 18000,
        image: "/placeholder.svg",
        category: "minuman",
        needsWaitingTime: true,
        stock: 80,
        quantity: 3,
        cookingStatus: "dimasak",
        notes: "less sugar"
      }
    ]
  },
  {
    id: "2",
    orderCode: "PSN-002",
    orderType: "dine-in",
    tableNumber: 11,
    customerName: "Djarot",
    orderTime: "11.30",
    status: "selesai",
    items: [
      {
        id: "6",
        name: "Chicken Snack Wrap",
        description: "Wrap ayam snack",
        price: 25000,
        image: "/placeholder.svg",
        category: "makanan",
        needsWaitingTime: true,
        stock: 40,
        quantity: 2,
        cookingStatus: "selesai",
        notes: "extran saos"
      },
      {
        id: "8",
        name: "Mineral Water",
        description: "Air mineral",
        price: 5000,
        image: "/placeholder.svg",
        category: "minuman",
        needsWaitingTime: false,
        stock: 100,
        quantity: 2,
        cookingStatus: "selesai"
      }
    ]
  },
  {
    id: "3",
    orderCode: "PSN-003",
    orderType: "dine-in",
    tableNumber: 9,
    customerName: "Jagoan",
    orderTime: "16.00",
    status: "dimasak",
    items: [
      {
        id: "2",
        name: "Ayam Spicy",
        description: "Ayam goreng pedas",
        price: 35000,
        image: "/placeholder.svg",
        category: "makanan",
        needsWaitingTime: true,
        stock: 30,
        quantity: 2,
        cookingStatus: "dimasak",
        notes: "level 3"
      },
      {
        id: "10",
        name: "Hot Tea",
        description: "Teh panas",
        price: 8000,
        image: "/placeholder.svg",
        category: "minuman",
        needsWaitingTime: false,
        stock: 100,
        quantity: 2,
        cookingStatus: "dimasak"
      }
    ]
  },
  {
    id: "4",
    orderCode: "PSN-004",
    orderType: "take-away",
    customerName: "Zambek",
    orderTime: "15.30",
    status: "menunggu",
    items: [
      {
        id: "3",
        name: "Panas Wings Korean Soy Garlic",
        description: "Sayap ayam dengan saus korea",
        price: 42000,
        image: "/placeholder.svg",
        category: "makanan",
        needsWaitingTime: true,
        stock: 25,
        quantity: 1,
        cookingStatus: "menunggu"
      },
      {
        id: "11",
        name: "Es Kopi Gula Aren",
        description: "Kopi dengan gula aren",
        price: 22000,
        image: "/placeholder.svg",
        category: "minuman",
        needsWaitingTime: true,
        stock: 50,
        quantity: 1,
        cookingStatus: "menunggu",
        notes: "less sugar"
      }
    ]
  },
  {
    id: "5",
    orderCode: "PSN-005",
    orderType: "take-away",
    customerName: "Takbir",
    orderTime: "15.30",
    status: "dimasak",
    items: [
      {
        id: "1",
        name: "Ayam Krispy",
        description: "Ayam goreng krispy",
        price: 32000,
        image: "/placeholder.svg",
        category: "makanan",
        needsWaitingTime: true,
        stock: 50,
        quantity: 2,
        cookingStatus: "dimasak"
      },
      {
        id: "4",
        name: "PaNas Spesial",
        description: "Paket nasi spesial",
        price: 48000,
        image: "/placeholder.svg",
        category: "makanan",
        needsWaitingTime: true,
        stock: 40,
        quantity: 3,
        cookingStatus: "dimasak"
      }
    ]
  },
  {
    id: "6",
    orderCode: "PSN-006",
    orderType: "take-away",
    customerName: "Dana",
    orderTime: "15.30",
    status: "dimasak",
    items: [
      {
        id: "5",
        name: "PaMer 7",
        description: "Paket Hemat 7",
        price: 55000,
        image: "/placeholder.svg",
        category: "makanan",
        needsWaitingTime: true,
        stock: 60,
        quantity: 5,
        cookingStatus: "dimasak"
      }
    ]
  },
  {
    id: "7",
    orderCode: "PSN-007",
    orderType: "dine-in",
    tableNumber: 3,
    customerName: "Khaled",
    orderTime: "15.30",
    status: "dimasak",
    items: [
      {
        id: "7",
        name: "MfSpicy",
        description: "Menu fried spicy",
        price: 38000,
        image: "/placeholder.svg",
        category: "makanan",
        needsWaitingTime: true,
        stock: 35,
        quantity: 5,
        cookingStatus: "dimasak"
      }
    ]
  },
  {
    id: "8",
    orderCode: "PSN-008",
    orderType: "take-away",
    customerName: "Restila",
    orderTime: "15.30",
    status: "dimasak",
    items: [
      {
        id: "1",
        name: "Ayam Krispy",
        description: "Ayam goreng krispy",
        price: 32000,
        image: "/placeholder.svg",
        category: "makanan",
        needsWaitingTime: true,
        stock: 50,
        quantity: 5,
        cookingStatus: "dimasak"
      }
    ]
  },
  {
    id: "9",
    orderCode: "PSN-009",
    orderType: "dine-in",
    tableNumber: 7,
    customerName: "Silavan",
    orderTime: "15.30",
    status: "dimasak",
    items: [
      {
        id: "2",
        name: "Ayam Spicy",
        description: "Ayam goreng pedas",
        price: 35000,
        image: "/placeholder.svg",
        category: "makanan",
        needsWaitingTime: true,
        stock: 30,
        quantity: 5,
        cookingStatus: "dimasak"
      }
    ]
  },
  {
    id: "10",
    orderCode: "PSN-010",
    orderType: "dine-in",
    tableNumber: 10,
    customerName: "Acid",
    orderTime: "19.30",
    status: "menunggu",
    items: [
      {
        id: "5",
        name: "Pamer 7",
        description: "Paket Hemat 7",
        price: 55000,
        image: "/placeholder.svg",
        category: "makanan",
        needsWaitingTime: true,
        stock: 60,
        quantity: 1,
        cookingStatus: "menunggu"
      },
      {
        id: "12",
        name: "Iced Milo",
        description: "Es milo",
        price: 15000,
        image: "/placeholder.svg",
        category: "minuman",
        needsWaitingTime: false,
        stock: 70,
        quantity: 1,
        cookingStatus: "menunggu"
      }
    ]
  }
];

export const dummyStockItems: StockItem[] = [
  {
    id: "1",
    code: "M001",
    name: "Ayam Krispy",
    category: "Makanan",
    stock: 16,
    inQueue: 8,
    status: "Rendah",
    orders: [
      { orderCode: "PSN-001", orderTime: "16.00", quantity: 2, orderType: "dine-in" },
      { orderCode: "PSN-002", orderTime: "12.00", quantity: 1, orderType: "dine-in" },
      { orderCode: "PSN-004", orderTime: "06.00", quantity: 1, orderType: "take-away" },
      { orderCode: "PSN-010", orderTime: "14.00", quantity: 2, orderType: "dine-in" },
      { orderCode: "PSN-012", orderTime: "11.00", quantity: 2, orderType: "dine-in" }
    ]
  },
  {
    id: "2",
    code: "M002",
    name: "PaNas Spesial",
    category: "Makanan",
    stock: 12,
    inQueue: 1,
    status: "Rendah",
    orders: [
      { orderCode: "PSN-005", orderTime: "15.30", quantity: 1, orderType: "take-away" }
    ]
  },
  {
    id: "3",
    code: "M003",
    name: "Ayam Spicy",
    category: "Makanan",
    stock: 8,
    inQueue: 82,
    status: "Rendah",
    orders: []
  },
  {
    id: "4",
    code: "M004",
    name: "PaNas 1",
    category: "Makanan",
    stock: 10,
    inQueue: 12,
    status: "Rendah",
    orders: []
  },
  {
    id: "5",
    code: "M005",
    name: "PaMer 7",
    category: "Makanan",
    stock: 126,
    inQueue: 19,
    status: "Cukup",
    orders: []
  },
  {
    id: "6",
    code: "M006",
    name: "PaMer 5",
    category: "Makanan",
    stock: 200,
    inQueue: 20,
    status: "Cukup",
    orders: []
  },
  {
    id: "7",
    code: "M006",
    name: "Chicken Snack Wrap",
    category: "Makanan",
    stock: 170,
    inQueue: 8,
    status: "Cukup",
    orders: []
  },
  {
    id: "8",
    code: "M007",
    name: "MfSpicy",
    category: "Makanan",
    stock: 106,
    inQueue: 10,
    status: "Cukup",
    orders: []
  },
  {
    id: "9",
    code: "M008",
    name: "Fruit Tea Lemon",
    category: "Minuman",
    stock: 160,
    inQueue: 8,
    status: "Cukup",
    orders: []
  },
  {
    id: "10",
    code: "M009",
    name: "Hot Tea",
    category: "Minuman",
    stock: 201,
    inQueue: 8,
    status: "Cukup",
    orders: []
  },
  {
    id: "11",
    code: "M010",
    name: "Fanta",
    category: "Minuman",
    stock: 168,
    inQueue: 8,
    status: "Cukup",
    orders: []
  },
  {
    id: "12",
    code: "M011",
    name: "Tehbotol Sosro Kotak",
    category: "Minuman",
    stock: 16,
    inQueue: 8,
    status: "Rendah",
    orders: []
  },
  {
    id: "13",
    code: "M012",
    name: "Iced Coffee Jelly",
    category: "Minuman",
    stock: 12,
    inQueue: 1,
    status: "Rendah",
    orders: []
  },
  {
    id: "14",
    code: "M013",
    name: "Iced Coffee Jelly Float",
    category: "Minuman",
    stock: 8,
    inQueue: 82,
    status: "Rendah",
    orders: []
  }
];

export const kitchenStats = {
  totalPesanan: 29,
  menunggu: 6,
  dimasak: 10,
  selesai: 18
};

export const stockStats = {
  totalMenu: 29,
  totalAntrean: 6,
  stokRendah: 10,
  stokAman: 18
};
