import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { POSHeader } from "@/components/pos/POSHeader";
import { MenuCard } from "@/components/pos/MenuCard";
import { CartSidebar } from "@/components/pos/CartSidebar";
import { PaymentModal } from "@/components/pos/PaymentModal";
import { ReceiptModal } from "@/components/pos/ReceiptModal";
import { WaitingTimeModal } from "@/components/pos/WaitingTimeModal";
import { MenuDetailModal } from "@/components/pos/MenuDetailModal";
import { LowStockNotification } from "@/components/pos/LowStockNotification";
import { menuItems, categories, TAX_RATE, SERVICE_FEE_RATE } from "@/data/menuData";
import { CartItem, MenuItem, Order, OrderType, PaymentMethod } from "@/types/pos";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const POS = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>("dine-in");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isWaitingTimeOpen, setIsWaitingTimeOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [pendingOrder, setPendingOrder] = useState<Omit<Order, "tableNumber"> | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [dismissedLowStockItems, setDismissedLowStockItems] = useState<string[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("pos_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/");
    }
  }, [navigate]);

  // Get low stock items for notification
  const lowStockItems = menuItems.filter(
    (item) =>
      item.stock !== -1 &&
      item.lowStockThreshold &&
      item.stock <= item.lowStockThreshold &&
      item.stock > 0 &&
      !dismissedLowStockItems.includes(item.id)
  );

  const handleDismissLowStock = (itemId: string) => {
    setDismissedLowStockItems((prev) => [...prev, itemId]);
  };

  const handleLogout = () => {
    localStorage.removeItem("pos_user");
    toast.success("Logout berhasil");
    navigate("/");
  };

  const addToCart = (item: MenuItem, quantity: number = 1) => {
    if (item.stock !== -1 && item.stock <= 0) {
      toast.error("Stok habis!");
      return;
    }

    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        const newQuantity = existing.quantity + quantity;
        if (item.stock !== -1 && newQuantity > item.stock) {
          toast.error(`Stok tersisa hanya ${item.stock}`);
          return prev;
        }
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: newQuantity } : i
        );
      }
      if (item.stock !== -1 && quantity > item.stock) {
        toast.error(`Stok tersisa hanya ${item.stock}`);
        return prev;
      }
      return [...prev, { ...item, quantity }];
    });
    toast.success(`${item.name} ditambahkan ke pesanan`);
  };

  const handleViewDetail = (item: MenuItem) => {
    setSelectedMenuItem(item);
    setIsDetailModalOpen(true);
  };

  const handleAddFromDetail = (item: MenuItem, quantity: number) => {
    addToCart(item, quantity);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    const item = menuItems.find((i) => i.id === id);
    if (item && item.stock !== -1 && quantity > item.stock) {
      toast.error(`Stok tersisa hanya ${item.stock}`);
      return;
    }
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
    toast.info("Item dihapus dari pesanan");
  };

  const generateOrderCode = () => {
    const prefix = orderType === "dine-in" ? "DI" : "TA";
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}-${timestamp}`;
  };

  const handleCheckout = () => {
    setIsPaymentOpen(true);
  };

  const handleConfirmPayment = (paymentMethod: PaymentMethod, amountPaid: number) => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * TAX_RATE;
    const serviceFee = subtotal * SERVICE_FEE_RATE;
    const total = subtotal + tax + serviceFee;

    const order: Omit<Order, "tableNumber"> & { tableNumber?: number } = {
      id: crypto.randomUUID(),
      orderCode: generateOrderCode(),
      items: [...cart],
      orderType,
      subtotal,
      tax,
      serviceFee,
      total,
      paymentMethod,
      amountPaid,
      change: amountPaid - total,
      createdAt: new Date(),
    };

    setIsPaymentOpen(false);

    // Check if any item needs waiting time
    const hasSlowItems = cart.some((item) => item.needsWaitingTime);

    if (hasSlowItems) {
      // If any item needs waiting time, show waiting time modal
      setPendingOrder(order);
      setIsWaitingTimeOpen(true);
    } else {
      // All items are fast, complete immediately
      setCurrentOrder(order as Order);
      setIsReceiptOpen(true);
      setCart([]);
      toast.success("Transaksi berhasil!");
    }
  };

  const handleWaitingTimeConfirm = (needsWaiting: boolean, tableNumber?: number, customerName?: string) => {
    if (pendingOrder) {
      const finalOrder: Order = {
        ...pendingOrder,
        tableNumber: needsWaiting && pendingOrder.orderType === "dine-in" ? tableNumber : undefined,
        customerName: needsWaiting && pendingOrder.orderType === "take-away" ? customerName : undefined,
      };

      setCurrentOrder(finalOrder);
      setIsWaitingTimeOpen(false);
      setIsReceiptOpen(true);
      setPendingOrder(null);
      setCart([]);

      if (needsWaiting) {
        if (pendingOrder.orderType === "dine-in" && tableNumber) {
          toast.success(`Pesanan dikirim ke dapur - Meja ${tableNumber}`);
        } else if (pendingOrder.orderType === "take-away" && customerName) {
          toast.success(`Pesanan dikirim ke dapur - ${customerName}`);
        }
      } else {
        toast.success("Transaksi berhasil!");
      }
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (!user) return null;

  return (
    <div className="h-screen flex flex-col bg-background">
      <POSHeader userName={user.username} onLogout={handleLogout} />

      {/* Low Stock Notifications */}
      <LowStockNotification items={lowStockItems} onDismiss={handleDismissLowStock} />

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content - Menu */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Search and Categories */}
          <div className="p-4 border-b border-border bg-card">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-background border-border"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200",
                    selectedCategory === category.id
                      ? "gradient-primary text-primary-foreground shadow-pos-sm"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  <span>{category.icon}</span>
                  <span className="font-medium text-sm">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Menu Grid */}
          <div className="flex-1 overflow-y-auto p-4 bg-muted/30">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <MenuCard
                    item={item}
                    onAdd={(item) => addToCart(item, 1)}
                    onViewDetail={handleViewDetail}
                  />
                </div>
              ))}
            </div>
            {filteredItems.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg">Menu tidak ditemukan</p>
                <p className="text-sm mt-1">Coba kata kunci lain</p>
              </div>
            )}
          </div>
        </main>

        {/* Cart Sidebar */}
        <aside className="w-full max-w-sm hidden lg:block">
          <CartSidebar
            items={cart}
            orderType={orderType}
            onOrderTypeChange={setOrderType}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            onCheckout={handleCheckout}
          />
        </aside>
      </div>

      {/* Mobile Cart Button */}
      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-4 left-4 right-4 animate-fade-in">
          <button
            onClick={handleCheckout}
            className="w-full gradient-primary text-primary-foreground py-4 rounded-xl font-semibold shadow-pos-xl flex items-center justify-center gap-3"
          >
            <span className="bg-background/20 px-2 py-1 rounded-full text-sm">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} item
            </span>
            <span>Lihat Pesanan</span>
          </button>
        </div>
      )}

      {/* Modals */}
      <PaymentModal
        open={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        items={cart}
        orderType={orderType}
        onConfirmPayment={handleConfirmPayment}
      />

      <WaitingTimeModal
        open={isWaitingTimeOpen}
        onClose={() => setIsWaitingTimeOpen(false)}
        onConfirm={handleWaitingTimeConfirm}
        orderCode={pendingOrder?.orderCode || ""}
        items={pendingOrder?.items || []}
        orderType={pendingOrder?.orderType || "dine-in"}
      />

      <MenuDetailModal
        item={selectedMenuItem}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onAdd={handleAddFromDetail}
      />

      <ReceiptModal
        open={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        order={currentOrder}
      />
    </div>
  );
};

export default POS;
