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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, TrendingUp, AlertTriangle, CheckCircle, Search, Filter, FileText, Clock, ChefHat } from "lucide-react";
import { dummyStockItems, stockStats, StockItem } from "@/data/dummyKitchenData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

const KitchenStok = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filteredItems = dummyStockItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleViewDetail = (item: StockItem) => {
    setSelectedItem(item);
    setDetailOpen(true);
  };

  const handleNotifyKasir = (item: StockItem) => {
    toast.success(`Notifikasi stok ${item.name} menipis telah dikirim ke Kasir`, {
      description: `Stok tersisa: ${item.stock} - Status: ${item.status}`
    });
  };

  return (
    <KitchenLayout title="Stok">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4 flex items-center gap-4 rounded-2xl border-border">
          <div className="w-12 h-12 rounded-xl bg-foreground flex items-center justify-center">
            <Package className="w-6 h-6 text-background" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stockStats.totalMenu}</p>
            <p className="text-sm text-muted-foreground">Total Menu</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4 rounded-2xl border-border">
          <div className="w-12 h-12 rounded-xl bg-foreground flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-background" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stockStats.totalAntrean}</p>
            <p className="text-sm text-muted-foreground">Total Antrean</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4 rounded-2xl border-border">
          <div className="w-12 h-12 rounded-xl bg-foreground flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-background" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stockStats.stokRendah}</p>
            <p className="text-sm text-muted-foreground">Stok Rendah</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4 rounded-2xl border-border">
          <div className="w-12 h-12 rounded-xl bg-foreground flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-background" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stockStats.stokAman}</p>
            <p className="text-sm text-muted-foreground">Stok Aman</p>
          </div>
        </Card>
      </div>

      {/* Table Header */}
      <Card className="rounded-2xl border-border">
        <div className="p-4 flex items-center justify-between border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">LIST MENU DAN STOK</h2>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search"
                className="pl-10 w-48"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">KODE</TableHead>
              <TableHead className="text-center">MENU</TableHead>
              <TableHead className="text-center">KATEGORI</TableHead>
              <TableHead className="text-center">STOK</TableHead>
              <TableHead className="text-center">ANTREAN</TableHead>
              <TableHead className="text-center">STATUS</TableHead>
              <TableHead className="text-center">AKSI</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="text-center font-medium">{item.code}</TableCell>
                <TableCell className="text-center">{item.name}</TableCell>
                <TableCell className="text-center">{item.category}</TableCell>
                <TableCell className="text-center">{item.stock}</TableCell>
                <TableCell className="text-center">{item.inQueue} Pesanan</TableCell>
                <TableCell className="text-center">
                  <Badge
                    className={cn(
                      "px-4",
                      item.status === "Rendah"
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => handleViewDetail(item)}
                  >
                    <FileText className="w-4 h-4" />
                    Catatan
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="p-4 flex items-center justify-between border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredItems.length)} of {filteredItems.length} result
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
      </Card>

      {/* Stock Detail Modal */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          {selectedItem && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-foreground flex items-center justify-center">
                    <Package className="w-6 h-6 text-background" />
                  </div>
                  <div className="flex-1">
                    <DialogTitle className="text-xl font-bold">
                      {selectedItem.name}
                    </DialogTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-foreground text-background text-xs">
                        {selectedItem.category}
                      </Badge>
                      <Badge
                        className={cn(
                          "text-xs",
                          selectedItem.status === "Rendah"
                            ? "bg-foreground text-background"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {selectedItem.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              {/* Stock Summary */}
              <div className="grid grid-cols-2 gap-3 my-4">
                <div className="p-4 rounded-xl bg-foreground text-background text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Package className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-bold">{selectedItem.stock}</p>
                  <p className="text-xs">Stok Tersedia</p>
                </div>
                <div className="p-4 rounded-xl bg-foreground text-background text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-bold">{selectedItem.inQueue}</p>
                  <p className="text-xs">Dalam Antrean</p>
                </div>
              </div>

              {/* Orders List */}
              {selectedItem.orders.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">
                    PESANAN MASUK ({selectedItem.orders.length})
                  </p>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedItem.orders.map((order, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-muted/50 rounded-xl flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-foreground flex items-center justify-center">
                            {order.orderType === "dine-in" ? (
                              <svg className="w-5 h-5 text-background" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <ellipse cx="12" cy="18" rx="8" ry="3" />
                                <path d="M12 15V6" />
                                <ellipse cx="12" cy="6" rx="4" ry="2" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-background" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{order.orderCode}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              Order {order.orderTime}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-foreground text-background rounded-lg text-sm">
                          <ChefHat className="w-4 h-4" />
                          X {order.quantity}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notify Button for Low Stock */}
              {selectedItem.status === "Rendah" && (
                <Button
                  className="w-full mt-4 gap-2"
                  onClick={() => {
                    handleNotifyKasir(selectedItem);
                    setDetailOpen(false);
                  }}
                >
                  <AlertTriangle className="w-4 h-4" />
                  Kirim Notifikasi ke Kasir
                </Button>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </KitchenLayout>
  );
};

export default KitchenStok;
