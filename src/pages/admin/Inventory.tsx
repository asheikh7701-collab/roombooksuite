import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Plus, Search, Edit, Trash2, Users, MapPin, CheckCircle, Wrench, X, Save } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Room } from "@/data/appData";

const AdminInventory = () => {
  const { rooms, deleteRoom, updateRoom, addRoom } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<Room | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editFloor, setEditFloor] = useState("");
  const [editCapacity, setEditCapacity] = useState("");
  const [editStatus, setEditStatus] = useState<Room["status"]>("available");
  const [editDescription, setEditDescription] = useState("");
  const [editEquipment, setEditEquipment] = useState("");

  const filteredRooms = rooms.filter((r) => r.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const openEdit = (room: Room) => {
    setEditTarget(room);
    setEditName(room.name);
    setEditFloor(room.floor);
    setEditCapacity(room.capacity.toString());
    setEditStatus(room.status);
    setEditDescription(room.description);
    setEditEquipment(room.equipment.join(", "));
  };

  const openAdd = () => {
    setShowAddDialog(true);
    setEditName("");
    setEditFloor("");
    setEditCapacity("");
    setEditStatus("available");
    setEditDescription("");
    setEditEquipment("");
  };

  const handleSaveEdit = async () => {
    if (!editTarget) return;
    try {
      await updateRoom(editTarget.id, {
      name: editName,
      floor: editFloor,
      capacity: parseInt(editCapacity) || 0,
      status: editStatus,
      description: editDescription,
      equipment: editEquipment.split(",").map((e) => e.trim()).filter(Boolean),
      });
      toast.success("Room updated", { description: `${editName} has been updated.` });
      setEditTarget(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update room.");
    }
  };

  const handleAddRoom = async () => {
    try {
      await addRoom({
      name: editName,
      floor: editFloor,
      capacity: parseInt(editCapacity) || 0,
      status: editStatus,
      description: editDescription,
      equipment: editEquipment.split(",").map((e) => e.trim()).filter(Boolean),
      bookings: 0,
      image: rooms[0]?.image || "",
      });
      toast.success("Room added", { description: `${editName} has been added to inventory.` });
      setShowAddDialog(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not add room.");
    }
  };

  const handleDelete = async () => {
    if (deleteTarget === null) return;
    const room = rooms.find((r) => r.id === deleteTarget);
    try {
      await deleteRoom(deleteTarget);
      toast.success("Room removed", { description: `${room?.name} has been removed from inventory.` });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete room.");
    }
    setDeleteTarget(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available": return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-secondary/10 text-secondary"><CheckCircle className="w-3 h-3" /> Available</span>;
      case "inactive": return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary"><Users className="w-3 h-3" /> Inactive</span>;
      case "maintenance": return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600"><Wrench className="w-3 h-3" /> Maintenance</span>;
      default: return null;
    }
  };

  const roomForm = (
    <div className="space-y-4 py-4">
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Room Name *</label>
        <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-3 py-2 bg-surface-container-low border-0 rounded-lg text-foreground focus:ring-2 focus:ring-secondary/40" placeholder="Director Board" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Floor</label>
          <input type="text" value={editFloor} onChange={(e) => setEditFloor(e.target.value)} className="w-full px-3 py-2 bg-surface-container-low border-0 rounded-lg text-foreground focus:ring-2 focus:ring-secondary/40" placeholder="Floor 12" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Capacity</label>
          <input type="number" value={editCapacity} onChange={(e) => setEditCapacity(e.target.value)} className="w-full px-3 py-2 bg-surface-container-low border-0 rounded-lg text-foreground focus:ring-2 focus:ring-secondary/40" placeholder="12" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Status</label>
        <select value={editStatus} onChange={(e) => setEditStatus(e.target.value as Room["status"])} className="w-full px-3 py-2 bg-surface-container-low border-0 rounded-lg text-foreground focus:ring-2 focus:ring-secondary/40">
          <option value="available">Available</option>
          <option value="inactive">Inactive</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Description</label>
        <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={2} className="w-full px-3 py-2 bg-surface-container-low border-0 rounded-lg text-foreground focus:ring-2 focus:ring-secondary/40 resize-none" placeholder="Premium executive boardroom..." />
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Equipment (comma-separated)</label>
        <input type="text" value={editEquipment} onChange={(e) => setEditEquipment(e.target.value)} className="w-full px-3 py-2 bg-surface-container-low border-0 rounded-lg text-foreground focus:ring-2 focus:ring-secondary/40" placeholder="Wi-Fi, Projector, Whiteboard" />
      </div>
    </div>
  );

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary">Room Inventory</h1>
          <p className="text-on-surface-variant">Manage workspace assets and availability.</p>
        </div>
        <button onClick={openAdd} className="bg-primary hover:bg-primary-container text-primary-foreground px-6 py-3 rounded-xl font-bold tracking-tight transition-all flex items-center gap-2 shadow-xl">
          <Plus className="w-4 h-4" /> Add New Room
        </button>
      </div>

      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search rooms..." className="w-full pl-10 pr-4 py-2.5 bg-surface-container-highest border-none rounded-full text-sm focus:ring-2 focus:ring-secondary/40" />
      </div>

      {/* Cards on mobile, table on desktop */}
      <div className="hidden lg:block bg-surface-container-lowest rounded-xl overflow-hidden shadow-elegant">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-low">
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Room Details</th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Capacity</th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Equipment</th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Status</th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRooms.map((room) => (
              <tr key={room.id} className="hover:bg-surface-container-high/50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <img src={room.image} alt={room.name} className="w-10 h-10 rounded-lg object-cover" loading="lazy" width={40} height={40} />
                    <div>
                      <p className="font-bold text-primary">{room.name}</p>
                      <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {room.floor} • {room.bookings} bookings/mo
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="flex items-center gap-1 text-sm text-primary font-medium">
                    <Users className="w-4 h-4 text-on-surface-variant" /> {room.capacity}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-wrap gap-1">
                    {room.equipment.slice(0, 3).map((e) => (
                      <span key={e} className="px-2 py-0.5 bg-surface-container-low rounded text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{e}</span>
                    ))}
                    {room.equipment.length > 3 && <span className="text-xs text-on-surface-variant">+{room.equipment.length - 3}</span>}
                  </div>
                </td>
                <td className="py-4 px-6">{getStatusBadge(room.status)}</td>
                <td className="py-4 px-6">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(room)} className="p-2 text-primary hover:bg-surface-container-high rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteTarget(room.id)} className="p-2 text-destructive hover:bg-error-container rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-4">
        {filteredRooms.map((room) => (
          <div key={room.id} className="bg-surface-container-lowest rounded-xl p-4 shadow-elegant">
            <div className="flex items-center gap-3 mb-3">
              <img src={room.image} alt={room.name} className="w-12 h-12 rounded-lg object-cover" loading="lazy" width={48} height={48} />
              <div className="flex-1">
                <p className="font-bold text-primary">{room.name}</p>
                <p className="text-xs text-on-surface-variant">{room.floor} • {room.capacity} seats</p>
              </div>
              {getStatusBadge(room.status)}
            </div>
            <div className="flex gap-2 mb-3">
              {room.equipment.slice(0, 3).map((e) => (
                <span key={e} className="px-2 py-0.5 bg-surface-container-low rounded text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{e}</span>
              ))}
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => openEdit(room)} className="px-3 py-1.5 text-primary bg-surface-container-low rounded-lg text-xs font-semibold">Edit</button>
              <button onClick={() => setDeleteTarget(room.id)} className="px-3 py-1.5 text-destructive bg-destructive/10 rounded-lg text-xs font-semibold">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={deleteTarget !== null} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Room?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove this room from inventory. Existing reservations for this room will not be affected.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete Room</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={!!editTarget} onOpenChange={() => setEditTarget(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Edit Room</DialogTitle></DialogHeader>
          {roomForm}
          <DialogFooter>
            <button onClick={() => setEditTarget(null)} className="px-4 py-2 bg-surface-container-high text-primary rounded-lg font-semibold text-sm">Cancel</button>
            <button onClick={handleSaveEdit} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold text-sm flex items-center gap-2"><Save className="w-3 h-3" /> Save</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Add New Room</DialogTitle></DialogHeader>
          {roomForm}
          <DialogFooter>
            <button onClick={() => setShowAddDialog(false)} className="px-4 py-2 bg-surface-container-high text-primary rounded-lg font-semibold text-sm">Cancel</button>
            <button onClick={handleAddRoom} disabled={!editName} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold text-sm flex items-center gap-2 disabled:opacity-40"><Plus className="w-3 h-3" /> Add Room</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminInventory;
