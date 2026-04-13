import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Calendar, Clock, MapPin, Users, CheckCircle, AlertCircle, XCircle, Search } from "lucide-react";
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

const AdminReservations = () => {
  const { reservations, rooms, cancelReservation, updateReservation } = useApp();
  const [filter, setFilter] = useState<"all" | "confirmed" | "pending" | "completed" | "cancelled">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);

  const filtered = reservations
    .filter((r) => filter === "all" || r.status === filter)
    .filter((r) => r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.bookedBy.toLowerCase().includes(searchTerm.toLowerCase()) || r.roomName.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleCancel = () => {
    if (!cancelTarget) return;
    cancelReservation(cancelTarget);
    toast.success("Reservation cancelled by admin.");
    setCancelTarget(null);
  };

  const handleApprove = (id: string) => {
    updateReservation(id, { status: "confirmed" });
    toast.success("Reservation approved.");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed": return <CheckCircle className="w-4 h-4 text-secondary" />;
      case "pending": return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case "cancelled": return <XCircle className="w-4 h-4 text-destructive" />;
      default: return <CheckCircle className="w-4 h-4 text-on-surface-variant" />;
    }
  };

  const counts = {
    all: reservations.length,
    confirmed: reservations.filter((r) => r.status === "confirmed").length,
    pending: reservations.filter((r) => r.status === "pending").length,
    completed: reservations.filter((r) => r.status === "completed").length,
    cancelled: reservations.filter((r) => r.status === "cancelled").length,
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-primary mb-2">All Reservations</h1>
        <p className="text-on-surface-variant">Manage and oversee all booking activity across The Atrium.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by title, user, or room..." className="w-full pl-10 pr-4 py-2.5 bg-surface-container-highest border-none rounded-full text-sm focus:ring-2 focus:ring-secondary/40" />
        </div>
        <div className="flex p-1 bg-surface-container-low rounded-xl overflow-x-auto">
          {(["all", "confirmed", "pending", "completed", "cancelled"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${filter === f ? "text-secondary bg-surface-container-lowest shadow-sm" : "text-on-surface-variant"}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-elegant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Meeting</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Booked By</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Room</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Schedule</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Status</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((res) => {
                const room = rooms.find((r) => r.id === res.roomId);
                return (
                  <tr key={res.id} className="hover:bg-surface-container-high/50 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-bold text-primary text-sm">{res.title}</p>
                      <p className="text-xs text-on-surface-variant">{res.attendees} attendees</p>
                    </td>
                    <td className="py-4 px-6 text-sm text-primary font-medium">{res.bookedBy}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {room && <img src={room.image} alt={room.name} className="w-7 h-7 rounded object-cover" loading="lazy" width={28} height={28} />}
                        <div>
                          <p className="text-sm font-medium text-primary">{res.roomName}</p>
                          <p className="text-xs text-on-surface-variant">{res.floor}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-primary">{res.date}</p>
                      <p className="text-xs text-on-surface-variant">{res.startTime} - {res.endTime}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                        res.status === "confirmed" ? "bg-secondary/10 text-secondary" :
                        res.status === "pending" ? "bg-amber-50 text-amber-600" :
                        res.status === "cancelled" ? "bg-destructive/10 text-destructive" :
                        "bg-surface-container-high text-on-surface-variant"
                      }`}>
                        {getStatusIcon(res.status)}
                        {res.status.charAt(0).toUpperCase() + res.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-end gap-2">
                        {res.status === "pending" && (
                          <button onClick={() => handleApprove(res.id)} className="px-3 py-1.5 bg-secondary/10 text-secondary rounded-lg text-xs font-semibold hover:bg-secondary/20 transition-colors">
                            Approve
                          </button>
                        )}
                        {(res.status === "confirmed" || res.status === "pending") && (
                          <button onClick={() => setCancelTarget(res.id)} className="px-3 py-1.5 bg-destructive/10 text-destructive rounded-lg text-xs font-semibold hover:bg-destructive/20 transition-colors">
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <Calendar className="w-12 h-12 text-outline-variant mx-auto mb-3" />
            <p className="text-on-surface-variant font-medium">No reservations found</p>
          </div>
        )}
      </div>

      <AlertDialog open={!!cancelTarget} onOpenChange={() => setCancelTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Reservation?</AlertDialogTitle>
            <AlertDialogDescription>This will cancel this booking. The user will be notified.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Cancel Booking</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminReservations;
