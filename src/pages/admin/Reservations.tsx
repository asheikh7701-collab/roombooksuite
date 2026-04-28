import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Calendar, CheckCircle, AlertCircle, XCircle, Search, Plus } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TIME_SLOTS } from "@/data/appData";

const AdminReservations = () => {
  const { reservations, rooms, users, cancelReservation, updateReservation, addReservation } = useApp();
  const [filter, setFilter] = useState<"all" | "confirmed" | "pending" | "completed" | "cancelled">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [newBooking, setNewBooking] = useState({ userId: "", roomId: "", date: "", startTime: "", endTime: "", title: "", attendees: "2", notes: "" });

  const filtered = reservations
    .filter((r) => filter === "all" || r.status === filter)
    .filter((r) => r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.bookedBy.toLowerCase().includes(searchTerm.toLowerCase()) || r.roomName.toLowerCase().includes(searchTerm.toLowerCase()));

  const activeUsers = users.filter((u) => u.status === "active");
  const activeRooms = rooms.filter((r) => r.status === "available");

  const handleCancel = async () => {
    if (!cancelTarget) return;
    try {
      await cancelReservation(cancelTarget);
      toast.success("Reservation cancelled by admin.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not cancel reservation.");
    }
    setCancelTarget(null);
  };

  const handleApprove = async (id: string) => {
    try {
      await updateReservation(id, { status: "confirmed" });
      toast.success("Reservation approved.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not approve reservation.");
    }
  };

  const handleCreateReservation = async () => {
    if (!newBooking.userId || !newBooking.roomId || !newBooking.date || !newBooking.startTime || !newBooking.endTime || !newBooking.title) {
      toast.error("Complete all required reservation fields.");
      return;
    }
    try {
      await addReservation({
        userId: newBooking.userId,
        roomId: newBooking.roomId,
        date: newBooking.date,
        startTime: newBooking.startTime,
        endTime: newBooking.endTime,
        attendees: Number(newBooking.attendees) || 1,
        status: "confirmed",
        title: newBooking.title,
        attendeeEmails: newBooking.notes,
      });
      toast.success("Reservation created", { description: "The user can now see it on their side." });
      setShowNew(false);
      setNewBooking({ userId: "", roomId: "", date: "", startTime: "", endTime: "", title: "", attendees: "2", notes: "" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create reservation.");
    }
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
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary mb-2">All Reservations</h1>
          <p className="text-on-surface-variant">Manage booking activity and create reservations for users.</p>
        </div>
        <button onClick={() => setShowNew(true)} className="bg-primary text-primary-foreground px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg"><Plus className="w-4 h-4" /> New Reservation</button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by title, user, or room..." className="w-full pl-10 pr-4 py-2.5 bg-surface-container-highest border-none rounded-full text-sm focus:ring-2 focus:ring-secondary/40" />
        </div>
        <div className="flex p-1 bg-surface-container-low rounded-xl overflow-x-auto">
          {(["all", "confirmed", "pending", "completed", "cancelled"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${filter === f ? "text-secondary bg-surface-container-lowest shadow-sm" : "text-on-surface-variant"}`}>{f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})</button>
          ))}
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-elegant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead><tr className="bg-surface-container-low"><th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Meeting</th><th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Booked By</th><th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Room</th><th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Schedule</th><th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Status</th><th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-right">Actions</th></tr></thead>
            <tbody>
              {filtered.map((res) => {
                const room = rooms.find((r) => r.id === res.roomId);
                return (
                  <tr key={res.id} className="hover:bg-surface-container-high/50 transition-colors">
                    <td className="py-4 px-6"><p className="font-bold text-primary text-sm">{res.title}</p><p className="text-xs text-on-surface-variant">{res.attendees} attendees</p></td>
                    <td className="py-4 px-6 text-sm text-primary font-medium">{res.bookedBy}</td>
                    <td className="py-4 px-6"><div className="flex items-center gap-2">{room && <img src={room.image} alt={room.name} className="w-7 h-7 rounded object-cover" loading="lazy" width={28} height={28} />}<div><p className="text-sm font-medium text-primary">{res.roomName}</p><p className="text-xs text-on-surface-variant">{res.floor}</p></div></div></td>
                    <td className="py-4 px-6"><p className="text-sm text-primary">{res.date}</p><p className="text-xs text-on-surface-variant">{res.startTime} - {res.endTime}</p></td>
                    <td className="py-4 px-6"><span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${res.status === "confirmed" ? "bg-secondary/10 text-secondary" : res.status === "pending" ? "bg-amber-50 text-amber-600" : res.status === "cancelled" ? "bg-destructive/10 text-destructive" : "bg-surface-container-high text-on-surface-variant"}`}>{getStatusIcon(res.status)}{res.status.charAt(0).toUpperCase() + res.status.slice(1)}</span></td>
                    <td className="py-4 px-6"><div className="flex justify-end gap-2">{res.status === "pending" && <button onClick={() => handleApprove(res.id)} className="px-3 py-1.5 bg-secondary/10 text-secondary rounded-lg text-xs font-semibold hover:bg-secondary/20 transition-colors">Approve</button>}{(res.status === "confirmed" || res.status === "pending") && <button onClick={() => setCancelTarget(res.id)} className="px-3 py-1.5 bg-destructive/10 text-destructive rounded-lg text-xs font-semibold hover:bg-destructive/20 transition-colors">Cancel</button>}</div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="py-16 text-center"><Calendar className="w-12 h-12 text-outline-variant mx-auto mb-3" /><p className="text-on-surface-variant font-medium">No reservations found</p></div>}
      </div>

      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="sm:max-w-xl" aria-describedby="new-reservation-description">
          <DialogHeader><DialogTitle>New Reservation</DialogTitle><DialogDescription id="new-reservation-description">Create a room reservation for any active user.</DialogDescription></DialogHeader>
          <div className="space-y-4 py-2">
            <input value={newBooking.title} onChange={(e) => setNewBooking({ ...newBooking, title: e.target.value })} placeholder="Meeting title" className="w-full px-3 py-2 bg-surface-container-low border-0 rounded-lg" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select value={newBooking.userId} onChange={(e) => setNewBooking({ ...newBooking, userId: e.target.value })} className="px-3 py-2 bg-surface-container-low border-0 rounded-lg"><option value="">Select user</option>{activeUsers.map((user) => <option key={user.id} value={user.id}>{user.name} — {user.email}</option>)}</select>
              <select value={newBooking.roomId} onChange={(e) => setNewBooking({ ...newBooking, roomId: e.target.value })} className="px-3 py-2 bg-surface-container-low border-0 rounded-lg"><option value="">Select room</option>{activeRooms.map((room) => <option key={room.id} value={room.id}>{room.name}</option>)}</select>
              <input type="date" value={newBooking.date} min={new Date().toISOString().split("T")[0]} onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })} className="px-3 py-2 bg-surface-container-low border-0 rounded-lg" />
              <input type="number" value={newBooking.attendees} min="1" onChange={(e) => setNewBooking({ ...newBooking, attendees: e.target.value })} className="px-3 py-2 bg-surface-container-low border-0 rounded-lg" />
              <select value={newBooking.startTime} onChange={(e) => setNewBooking({ ...newBooking, startTime: e.target.value })} className="px-3 py-2 bg-surface-container-low border-0 rounded-lg"><option value="">Start time</option>{TIME_SLOTS.map((slot) => <option key={slot} value={slot}>{slot}</option>)}</select>
              <select value={newBooking.endTime} onChange={(e) => setNewBooking({ ...newBooking, endTime: e.target.value })} className="px-3 py-2 bg-surface-container-low border-0 rounded-lg"><option value="">End time</option>{TIME_SLOTS.map((slot) => <option key={slot} value={slot}>{slot}</option>)}</select>
            </div>
            <textarea value={newBooking.notes} onChange={(e) => setNewBooking({ ...newBooking, notes: e.target.value })} placeholder="Notes or attendee emails" rows={3} className="w-full px-3 py-2 bg-surface-container-low border-0 rounded-lg resize-none" />
          </div>
          <div className="flex justify-end gap-2"><button onClick={() => setShowNew(false)} className="px-4 py-2 bg-surface-container-high text-primary rounded-lg font-semibold text-sm">Cancel</button><button onClick={handleCreateReservation} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold text-sm flex items-center gap-2"><Plus className="w-3 h-3" /> Create Reservation</button></div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!cancelTarget} onOpenChange={() => setCancelTarget(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Cancel Reservation?</AlertDialogTitle><AlertDialogDescription>This will cancel this booking. The user will see the updated status.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Keep</AlertDialogCancel><AlertDialogAction onClick={handleCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Cancel Booking</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminReservations;
