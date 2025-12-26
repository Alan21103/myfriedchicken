import { useState } from "react";
import { OwnerLayout } from "@/layouts/OwnerLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { ownerCategories } from "@/data/dummyOwnerData";
import { Category } from "@/types/pos";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const EMOJI_OPTIONS = ["🍛", "🥤", "🍟", "🍰", "🍕", "🍔", "🌮", "🍜", "🍣", "🥗"];

const OwnerKategori = () => {
  const [categories, setCategories] = useState<Category[]>(ownerCategories);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState<Category | null>(null);
  const [deleteModal, setDeleteModal] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: "", icon: "🍛" });

  const handleOpenAdd = () => {
    setFormData({ name: "", icon: "🍛" });
    setAddModal(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setFormData({ name: cat.name, icon: cat.icon });
    setEditModal(cat);
  };

  const handleSaveAdd = () => {
    const newCategory: Category = {
      id: formData.name.toLowerCase().replace(/\s+/g, "-"),
      name: formData.name,
      icon: formData.icon,
    };
    setCategories([...categories, newCategory]);
    setAddModal(false);
  };

  const handleSaveEdit = () => {
    if (!editModal) return;
    setCategories(
      categories.map((cat) =>
        cat.id === editModal.id
          ? { ...cat, name: formData.name, icon: formData.icon }
          : cat
      )
    );
    setEditModal(null);
  };

  const handleDelete = () => {
    if (!deleteModal) return;
    setCategories(categories.filter((cat) => cat.id !== deleteModal.id));
    setDeleteModal(null);
  };

  return (
    <OwnerLayout title="Kelola Kategori">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Kelola Kategori</h1>
            <p className="text-muted-foreground">Tambah, ubah, atau hapus kategori menu</p>
          </div>
          <Button onClick={handleOpenAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Kategori
          </Button>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="font-medium">{cat.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => setDeleteModal(cat)}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={addModal || !!editModal} onOpenChange={() => { setAddModal(false); setEditModal(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editModal ? "Edit Kategori" : "Tambah Kategori"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nama Kategori</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nama kategori"
              />
            </div>
            <div>
              <Label>Icon</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setFormData({ ...formData, icon: emoji })}
                    className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-colors ${
                      formData.icon === emoji
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-secondary"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
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
            <h2 className="text-xl font-bold mb-2">Hapus Kategori</h2>
            <p className="text-muted-foreground mb-6">Yakin untuk menghapus kategori "{deleteModal?.name}"?</p>
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" onClick={() => setDeleteModal(null)}>
                Batal
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Hapus
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </OwnerLayout>
  );
};

export default OwnerKategori;
