import { useState } from "react";
import { OwnerLayout } from "@/layouts/OwnerLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { predikats as initialPredikats } from "@/data/dummyOwnerData";
import { Predikat } from "@/types/pos";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const COLOR_OPTIONS = [
  { name: "Gray", value: "#6B7280" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Red", value: "#EF4444" },
  { name: "Green", value: "#10B981" },
  { name: "Yellow", value: "#F59E0B" },
  { name: "Purple", value: "#8B5CF6" },
];

const OwnerPredikat = () => {
  const [predikats, setPredikats] = useState<Predikat[]>(initialPredikats);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState<Predikat | null>(null);
  const [deleteModal, setDeleteModal] = useState<Predikat | null>(null);
  const [formData, setFormData] = useState({ name: "", color: "#6B7280" });

  const handleOpenAdd = () => {
    setFormData({ name: "", color: "#6B7280" });
    setAddModal(true);
  };

  const handleOpenEdit = (predikat: Predikat) => {
    setFormData({ name: predikat.name, color: predikat.color });
    setEditModal(predikat);
  };

  const handleSaveAdd = () => {
    const newPredikat: Predikat = {
      id: Date.now().toString(),
      name: formData.name,
      color: formData.color,
    };
    setPredikats([...predikats, newPredikat]);
    setAddModal(false);
  };

  const handleSaveEdit = () => {
    if (!editModal) return;
    setPredikats(
      predikats.map((p) =>
        p.id === editModal.id
          ? { ...p, name: formData.name, color: formData.color }
          : p
      )
    );
    setEditModal(null);
  };

  const handleDelete = () => {
    if (!deleteModal) return;
    setPredikats(predikats.filter((p) => p.id !== deleteModal.id));
    setDeleteModal(null);
  };

  return (
    <OwnerLayout title="Kelola Predikat">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Kelola Predikat</h1>
            <p className="text-muted-foreground">Tambah, ubah, atau hapus predikat menu</p>
          </div>
          <Button onClick={handleOpenAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Predikat
          </Button>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {predikats.map((predikat) => (
              <div
                key={predikat.id}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
              >
                <Badge style={{ backgroundColor: predikat.color, color: "white" }}>
                  {predikat.name}
                </Badge>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(predikat)}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => setDeleteModal(predikat)}
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
            <DialogTitle>{editModal ? "Edit Predikat" : "Tambah Predikat"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nama Predikat</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nama predikat"
              />
            </div>
            <div>
              <Label>Warna</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setFormData({ ...formData, color: color.value })}
                    className={`w-10 h-10 rounded-lg transition-all ${
                      formData.color === color.value
                        ? "ring-2 ring-primary ring-offset-2"
                        : ""
                    }`}
                    style={{ backgroundColor: color.value }}
                  />
                ))}
              </div>
            </div>
            <div>
              <Label>Preview</Label>
              <div className="mt-2">
                <Badge style={{ backgroundColor: formData.color, color: "white" }}>
                  {formData.name || "Preview"}
                </Badge>
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
            <h2 className="text-xl font-bold mb-2">Hapus Predikat</h2>
            <p className="text-muted-foreground mb-6">Yakin untuk menghapus predikat "{deleteModal?.name}"?</p>
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

export default OwnerPredikat;
