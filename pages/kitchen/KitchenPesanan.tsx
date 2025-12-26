import { useState } from "react";
import { KitchenLayout } from "@/layouts/KitchenLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Package, Clock, ChefHat, CheckCircle, Eye, Search, Filter, MapPin, User, ChevronDown } from "lucide-react";
import { dummyKitchenOrders, kitchenStats, KitchenOrder, KitchenOrderItem, ItemCookingStatus } from "@/data/dummyKitchenData";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 9;

const KitchenPesanan = () => {
  const [orders, setOrders] = useState<KitchenOrder[]>(dummyKitchenOrders);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<KitchenOrder | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filteredOrders = orders.filter(order =>
    order.orderCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customerName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "menunggu":
        return (
          <Badge className="bg-muted text-foreground border border-border gap-1">
            <Clock className="w-3 h-3" />
            Menunggu
          </Badge>
        );
      case "dimasak":
        return (
          <Badge className="bg-foreground text-background gap-1">
            <ChefHat className="w-3 h-3" />
            Dimasak
          </Badge>
        );
      case "selesai":
        return (
          <Badge className="bg-muted text-foreground border border-border gap-1">
            <CheckCircle className="w-3 h-3" />
            Selesai
          </Badge>
        );
      default:
        return null;
    }
  };

  const getOrderIcon = (orderType: string) => {
    if (orderType === "dine-in") {
      return (
        <div className="w-12 h-12 rounded-xl bg-foreground flex items-center justify-center">
          <svg className="w-6 h-6 text-background" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <ellipse cx="12" cy="18" rx="8" ry="3" />
            <path d="M12 15V6" />
            <ellipse cx="12" cy="6" rx="4" ry="2" />
          </svg>
        </div>
      );
    }
    return (
      <div className="w-12 h-12 rounded-xl bg-foreground flex items-center justify-center">
        <svg className="w-6 h-6 text-background" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      </div>
    );
  };

  const handleViewDetail = (order: KitchenOrder) => {
    setSelectedOrder(order);
    setDetailOpen(true);
  };

  const handleItemStatusChange = (itemId: string, newStatus: ItemCookingStatus) => {
    if (!selectedOrder) return;

    const updatedItems = selectedOrder.items.map(item =>
      item.id === itemId ? { ...item, cookingStatus: newStatus } : item
    );

    // Determine new order status based on items
    const allSelesai = updatedItems.every(item => item.cookingStatus === "selesai");
    const anyDimasak = updatedItems.some(item => item.cookingStatus === "dimasak");
    const allMenunggu = updatedItems.every(item => item.cookingStatus === "menunggu");

    let newOrderStatus: "menunggu" | "dimasak" | "selesai" = "menunggu";
    if (allSelesai) newOrderStatus = "selesai";
    else if (anyDimasak || updatedItems.some(item => item.cookingStatus === "selesai")) newOrderStatus = "dimasak";
    else if (allMenunggu) newOrderStatus = "menunggu";

    const updatedOrder = { ...selectedOrder, items: updatedItems, status: newOrderStatus };
    setSelectedOrder(updatedOrder);
    setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
  };

  const handleCompleteOrder = () => {
    if (!selectedOrder) return;

    const updatedItems = selectedOrder.items.map(item => ({
      ...item,
      cookingStatus: "selesai" as ItemCookingStatus
    }));

    const updatedOrder = { ...selectedOrder, items: updatedItems, status: "selesai" as const };
    setSelectedOrder(updatedOrder);
    setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    setDetailOpen(false);
  };

  const getItemStatusCounts = (items: KitchenOrderItem[]) => {
    return {
      menunggu: items.filter(i => i.cookingStatus === "menunggu").length,
      dimasak: items.filter(i => i.cookingStatus === "dimasak").length,
      selesai: items.filter(i => i.cookingStatus === "selesai").length
    };
  };

  return (
    <KitchenLayout title="Pesanan">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4 flex items-center gap-4 rounded-2xl border-border">
          <div className="w-12 h-12 rounded-xl bg-foreground flex items-center justify-center">
            <Package className="w-6 h-6 text-background" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{kitchenStats.totalPesanan}</p>
            <p className="text-sm text-muted-foreground">Total Pesanan</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4 rounded-2xl border-border">
          <div className="w-12 h-12 rounded-xl bg-foreground flex items-center justify-center">
            <Clock className="w-6 h-6 text-background" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{kitchenStats.menunggu}</p>
            <p className="text-sm text-muted-foreground">Menunggu</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4 rounded-2xl border-border">
          <div className="w-12 h-12 rounded-xl bg-foreground flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-background" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{kitchenStats.dimasak}</p>
            <p className="text-sm text-muted-foreground">Dimasak</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4 rounded-2xl border-border">
          <div className="w-12 h-12 rounded-xl bg-foreground flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-background" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{kitchenStats.selesai}</p>
            <p className="text-sm text-muted-foreground">Selesai</p>
          </div>
        </Card>
      </div>

      {/* List Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">List Pesanan</h2>
          <p className="text-sm text-muted-foreground">
            Klik baris pesanan atau tombol "Detail" untuk melihat dan mengubah status makanan.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari Pesanan"
              className="pl-10 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {paginatedOrders.map((order) => (
          <Card
            key={order.id}
            className="p-4 rounded-2xl border-border hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleViewDetail(order)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {getOrderIcon(order.orderType)}
                <div>
                  <p className="font-semibold text-foreground">{order.orderCode}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <User className="w-3 h-3" />
                    {order.customerName}
                  </div>
                </div>
              </div>
              {getStatusBadge(order.status)}
            </div>

            <div className="space-y-2 mb-3">
              {order.tableNumber && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  Meja {order.tableNumber}
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  Order {order.orderTime}
                </div>
                <Badge variant="outline" className="text-xs">
                  {order.orderType === "dine-in" ? "Dine In" : "Take Away"}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="w-4 h-4" />
                {order.items.reduce((acc, item) => acc + item.quantity, 0)} item
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetail(order);
              }}
            >
              <Eye className="w-4 h-4" />
              Detail
            </Button>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredOrders.length)} of {filteredOrders.length} result
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
          >
            {"<"}
          </Button>
          {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          {totalPages > 3 && (
            <>
              <span className="text-muted-foreground">...</span>
              <Button
                variant={currentPage === totalPages ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(totalPages)}
              >
                {totalPages}
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
          >
            {">"}
          </Button>
        </div>
      </div>

      {/* Order Detail Modal */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          {selectedOrder && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-4">
                  {getOrderIcon(selectedOrder.orderType)}
                  <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase">
                      {selectedOrder.orderType === "dine-in" ? "DINE IN" : "TAKE AWAY"}
                    </p>
                    <DialogTitle className="text-xl font-bold">
                      {selectedOrder.orderCode}
                    </DialogTitle>
                    {selectedOrder.tableNumber && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        Meja {selectedOrder.tableNumber}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Badge className="bg-foreground text-background gap-1">
                      <Clock className="w-3 h-3" />
                      Order {selectedOrder.orderTime}
                    </Badge>
                    <div className="flex items-center gap-1 px-3 py-1 bg-foreground text-background rounded-full text-sm">
                      <User className="w-3 h-3" />
                      {selectedOrder.customerName}
                    </div>
                  </div>
                </div>
              </DialogHeader>

              {/* Status Summary */}
              <div className="grid grid-cols-3 gap-3 my-4">
                {(() => {
                  const counts = getItemStatusCounts(selectedOrder.items);
                  return (
                    <>
                      <div className={cn(
                        "p-4 rounded-xl text-center",
                        counts.menunggu > 0 ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
                      )}>
                        <Clock className="w-6 h-6 mx-auto mb-1" />
                        <p className="text-2xl font-bold">{counts.menunggu}</p>
                        <p className="text-xs uppercase">Menunggu</p>
                      </div>
                      <div className={cn(
                        "p-4 rounded-xl text-center",
                        counts.dimasak > 0 ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
                      )}>
                        <ChefHat className="w-6 h-6 mx-auto mb-1" />
                        <p className="text-2xl font-bold">{counts.dimasak}</p>
                        <p className="text-xs uppercase">Dimasak</p>
                      </div>
                      <div className={cn(
                        "p-4 rounded-xl text-center",
                        counts.selesai > 0 ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
                      )}>
                        <CheckCircle className="w-6 h-6 mx-auto mb-1" />
                        <p className="text-2xl font-bold">{counts.selesai}</p>
                        <p className="text-xs uppercase">Selesai</p>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Items List */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3">
                  DAFTAR MENU ({selectedOrder.items.length} ITEM)
                </p>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="p-3 bg-muted/50 rounded-xl">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-sm text-muted-foreground">X {item.quantity}</p>
                          {item.notes && (
                            <p className="text-sm text-muted-foreground">{item.notes}</p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(item.cookingStatus)}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="gap-1 text-xs">
                                {item.cookingStatus === "menunggu" && <Clock className="w-3 h-3" />}
                                {item.cookingStatus === "dimasak" && <ChefHat className="w-3 h-3" />}
                                {item.cookingStatus === "selesai" && <CheckCircle className="w-3 h-3" />}
                                {item.cookingStatus === "menunggu" ? "Menunggu" :
                                  item.cookingStatus === "dimasak" ? "Dimasak" : "Selesai"}
                                <ChevronDown className="w-3 h-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handleItemStatusChange(item.id, "menunggu")}>
                                <Clock className="w-4 h-4 mr-2" />
                                Menunggu
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleItemStatusChange(item.id, "dimasak")}>
                                <ChefHat className="w-4 h-4 mr-2" />
                                Dimasak
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleItemStatusChange(item.id, "selesai")}>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Selesai
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Complete Order Button */}
              {selectedOrder.items.every(item => item.cookingStatus === "selesai") && (
                <Button
                  className="w-full mt-4 gap-2"
                  onClick={handleCompleteOrder}
                >
                  <CheckCircle className="w-4 h-4" />
                  Selesaikan Pesanan
                </Button>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </KitchenLayout>
  );
};

export default KitchenPesanan;
