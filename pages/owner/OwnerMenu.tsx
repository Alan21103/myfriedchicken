import { useState } from "react";
import { OwnerLayout } from "@/layouts/OwnerLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Edit2, Info, Trash2, X, Clock, Upload, Image as ImageIcon } from "lucide-react";
import { menuItems as initialMenuItems, categories } from "@/data/menuData";
import { MenuItem } from "@/types/pos";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { predikats } from "@/data/dummyOwnerData";

const OwnerMenu = () => {
  const [menuData, setMenuData] = useState<MenuItem[]>(initialMenuItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPredikat, setSelectedPredikat] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Modal states
  const [detailModal, setDetailModal] = useState<MenuItem | null>(null);
  const [editModal, setEditModal] = useState<MenuItem | null>(null);
  const [deleteModal, setDeleteModal] = useState<MenuItem | null>(null);
  const [addModal, setAddModal] = useState(false);

  // Form state for add/edit
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "makanan",
    needsWaitingTime: true,
    predikat: "",
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID").format(price);
  };

  // Filter menu items
  const filteredItems = menuData.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesPredikat = selectedPredikat === "all" || item.predikat === selectedPredikat;
    return matchesSearch && matchesCategory && matchesPredikat;
  });

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "makanan",
      needsWaitingTime: true,
      predikat: "",
    });
    setAddModal(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      needsWaitingTime: item.needsWaitingTime,
      predikat: item.predikat || "",
    });
    setEditModal(item);
  };

  const handleSaveAdd = () => {
    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: parseInt(formData.price) || 0,
      image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
      category: formData.category,
      needsWaitingTime: formData.needsWaitingTime,
      stock: 20,
      lowStockThreshold: 5,
      predikat: formData.predikat || undefined,
    };
    setMenuData([...menuData, newItem]);
    setAddModal(false);
  };

  const handleSaveEdit = () => {
    if (!editModal) return;
    setMenuData(
      menuData.map((item) =>
        item.id === editModal.id
          ? {
              ...item,
              name: formData.name,
              description: formData.description,
              price: parseInt(formData.price) || 0,
              category: formData.category,
              needsWaitingTime: formData.needsWaitingTime,
              predikat: formData.predikat || undefined,
            }
          : item
      )
    );
    setEditModal(null);
  };

  const handleDelete = () => {
    if (!deleteModal) return;
    setMenuData(menuData.filter((item) => item.id !== deleteModal.id));
    setDeleteModal(null);
  };

  return (
    <OwnerLayout title="Kelola Menu">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">List Menu</h1>
            <p className="text-muted-foreground">Tambah, ubah, atau hapus menu restoran</p>
          </div>
          <Button className="w-8 h-8 p-0 rounded-full" variant="ghost">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari Menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/50 border-0"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[160px] bg-secondary/50 border-0">
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {categories.filter(c => c.id !== "all").map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedPredikat} onValueChange={setSelectedPredikat}>
            <SelectTrigger className="w-[160px] bg-secondary/50 border-0">
              <SelectValue placeholder="Semua Predikat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Predikat</SelectItem>
              {predikats.map((p) => (
                <SelectItem key={p.id} value={p.name}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleOpenAdd} className="ml-auto">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Menu
          </Button>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedItems.map((item) => (
            <div
              key={item.id}
              className="bg-card rounded-xl overflow-hidden border border-border shadow-sm"
            >
              <div className="h-40 bg-muted relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground">{item.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {item.description}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-semibold text-foreground">
                    Rp {formatPrice(item.price)}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => setDetailModal(item)}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    >
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => setDeleteModal(item)}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, filteredItems.length)} of{" "}
            {filteredItems.length} result
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              &lt;
            </Button>
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            {totalPages > 3 && <span className="text-muted-foreground">...</span>}
            {totalPages > 3 && (
              <Button
                variant={currentPage === totalPages ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
              >
                {totalPages}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              &gt;
            </Button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!detailModal} onOpenChange={() => setDetailModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center gradient-header text-primary-foreground py-3 -mx-6 -mt-6 rounded-t-lg">
              Detail Menu
            </DialogTitle>
          </DialogHeader>
          {detailModal && (
            <div className="space-y-4">
              <div className="relative">
                <div className="flex gap-2 mb-4">
                  <Badge variant="secondary" className="bg-muted">
                    <Clock className="w-3 h-3 mr-1" />
                    {detailModal.needsWaitingTime ? "Butuh Waktu" : "Cepat"}
                  </Badge>
                  {detailModal.predikat && (
                    <Badge variant="secondary">{detailModal.predikat}</Badge>
                  )}
                </div>
                <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                  <img
                    src={detailModal.image}
                    alt={detailModal.name}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              </div>
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-semibold">{detailModal.name}</h3>
                <Badge variant="outline">Kategori : {
                  categories.find(c => c.id === detailModal.category)?.name || detailModal.category
                }</Badge>
              </div>
              <p className="text-muted-foreground">{detailModal.description}</p>
              <p className="text-2xl font-bold">Rp {formatPrice(detailModal.price)}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add/Edit Modal */}
      <Dialog open={addModal || !!editModal} onOpenChange={() => { setAddModal(false); setEditModal(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-center gradient-header text-primary-foreground py-3 -mx-6 -mt-6 rounded-t-lg">
              {editModal ? "Edit Menu" : "Tambah Menu"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nama Menu</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nama menu"
              />
            </div>
            <div>
              <Label>Deskripsi</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Deskripsi menu"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Harga</Label>
                <Input
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="Rp. 0"
                />
              </div>
              <div>
                <Label>Kategori</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c.id !== "all").map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Tipe Saji</Label>
              <RadioGroup
                value={formData.needsWaitingTime ? "wait" : "fast"}
                onValueChange={(v) => setFormData({ ...formData, needsWaitingTime: v === "wait" })}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="wait" id="wait" />
                  <Label htmlFor="wait">Butuh Waktu</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fast" id="fast" />
                  <Label htmlFor="fast">Cepat</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label>Foto</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center mt-2">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Drag your file(s) or <span className="font-medium text-foreground">browse</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">Max 10 MB files are allowed</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => { setAddModal(false); setEditModal(null); }}>
                Batal
              </Button>
              <Button onClick={editModal ? handleSaveEdit : handleSaveAdd}>
                Simpan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={!!deleteModal} onOpenChange={() => setDeleteModal(null)}>
        <DialogContent className="max-w-sm">
          <div className="text-center py-6">
            <h2 className="text-xl font-bold mb-2">Hapus Menu</h2>
            <p className="text-muted-foreground mb-6">Yakin untuk menghapus Menu?</p>
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" onClick={() => setDeleteModal(null)}>
                Batal
              </Button>
              <Button variant="default" onClick={handleDelete}>
                Hapus
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </OwnerLayout>
  );
};

export default OwnerMenu;
