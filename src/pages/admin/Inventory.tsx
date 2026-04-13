import { useState } from "react";
import { Plus, Search, Edit, Trash2, Users, MapPin, Wifi, Video, Monitor, MoreVertical, CheckCircle, AlertTriangle, Wrench } from "lucide-react";

const roomsData = [
  { id: 1, name: "Director Board Meeting Room", floor: "Floor 12", capacity: 12, status: "available", equipment: ["4K VC", "Whiteboard", "Wi-Fi"], bookings: 45 },
  { id: 2, name: "Meeting Room #1", floor: "Floor 8", capacity: 6, status: "available", equipment: ["Display", "Wi-Fi"], bookings: 38 },
  { id: 3, name: "Innovation Lab", floor: "Floor 6", capacity: 10, status: "maintenance", equipment: ["Display", "Whiteboard", "Wi-Fi"], bookings: 28 },
  { id: 4, name: "Executive Lounge", floor: "Floor 12", capacity: 4, status: "available", equipment: ["Video Call", "Wi-Fi"], bookings: 22 },
  { id: 5, name: "Meeting Room #2", floor: "Floor 8", capacity: 8, status: "occupied", equipment: ["Display", "Wi-Fi", "Whiteboard"], bookings: 15 },
  { id: 6, name: "Town Hall", floor: "Floor 1", capacity: 50, status: "available", equipment: ["Projector", "Mic System", "Wi-Fi"], bookings: 8 },
];

const AdminInventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredRooms = roomsData.filter((r) => r.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-secondary/10 text-secondary"><CheckCircle className="w-3 h-3" /> Available</span>;
      case "occupied":
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary"><Users className="w-3 h-3" /> Occupied</span>;
      case "maintenance":
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600"><Wrench className="w-3 h-3" /> Maintenance</span>;
      default:
        return null;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary">Room Inventory</h1>
          <p className="text-on-surface-variant">Manage and audit high-end workspace assets and availability.</p>
        </div>
        <button className="bg-primary hover:bg-primary-container text-primary-foreground px-6 py-3 rounded-xl font-bold tracking-tight transition-all flex items-center gap-2 shadow-xl">
          <Plus className="w-4 h-4" />
          Add New Room
        </button>
      </div>

      {/* Search */}
      <div className="mb-8 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search rooms by name..."
          className="w-full pl-10 pr-4 py-2.5 bg-surface-container-highest border-none rounded-full text-sm focus:ring-2 focus:ring-secondary/40"
        />
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-elegant">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-low">
              <th className="py-5 px-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Room Details</th>
              <th className="py-5 px-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Capacity</th>
              <th className="py-5 px-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Equipment</th>
              <th className="py-5 px-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Status</th>
              <th className="py-5 px-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRooms.map((room) => (
              <tr key={room.id} className="hover:bg-surface-container-high/50 transition-colors">
                <td className="py-5 px-6">
                  <div>
                    <p className="font-bold text-primary">{room.name}</p>
                    <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {room.floor} • {room.bookings} bookings/mo
                    </p>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <span className="flex items-center gap-1 text-sm text-primary font-medium">
                    <Users className="w-4 h-4 text-on-surface-variant" /> {room.capacity}
                  </span>
                </td>
                <td className="py-5 px-6">
                  <div className="flex flex-wrap gap-1">
                    {room.equipment.map((e) => (
                      <span key={e} className="px-2 py-0.5 bg-surface-container-low rounded text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                        {e}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-5 px-6">{getStatusBadge(room.status)}</td>
                <td className="py-5 px-6">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 text-primary hover:bg-surface-container-high rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-destructive hover:bg-error-container rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminInventory;
