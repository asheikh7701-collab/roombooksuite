import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Clock, MapPin, Users, Calendar, CheckCircle, XCircle, AlertCircle } from "lucide-react";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { TIME_SLOTS } from "@/data/appData";

const UserReservations = () => {
  const { reservations, rooms, cancelReservation, updateReservation, currentUser } = useApp();
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);
  const [modifyTarget, setModifyTarget] = useState<string | null>(null);
  const [modifyDate, setModifyDate] = useState("");
  const [modifyStart, setModifyStart] = useState("");
  const [modifyEnd, setModifyEnd] = useState("");
  const [modifyTitle, setModifyTitle] = useState("");

  const userReservations = reservations.filter((r) => r.userId === currentUser.id);
  const upcoming = userReservations.filter((r) => r.status === "confirmed" || r.status === "pending");
  const past = userReservations.filter((r) => r.status === "completed" || r.status === "cancelled");
  const displayed = tab === "upcoming" ? upcoming : past;

  const handleCancel = async () => {
    if (!cancelTarget) return;
    try {
      await cancelReservation(cancelTarget);
      toast.success("Reservation cancelled", { description: "Your booking has been cancelled successfully." });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not cancel reservation.");
    }
    setCancelTarget(null);
  };

  const openModify = (id: string) => {
    const res = reservations.find((r) => r.id === id);
    if (!res) return;
    setModifyTarget(id);
    setModifyDate(res.date);
    setModifyStart(res.startTime);
    setModifyEnd(res.endTime);
    setModifyTitle(res.title);
  };

  const handleModify = async () => {
    if (!modifyTarget) return;
    try {
      if (modifyEnd <= modifyStart) {
        toast.error("End time must be after start time.");
        return;
      }
      await updateReservation(modifyTarget, {
        date: modifyDate,
        startTime: modifyStart,
        endTime: modifyEnd,
        title: modifyTitle,
      });
      toast.success("Reservation updated", { description: "Your booking has been modified." });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update reservation.");
    }
    setModifyTarget(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed": return <CheckCircle className="w-7 h-7 text-secondary" />;
      case "pending": return <AlertCircle className="w-7 h-7 text-amber-500" />;
      case "cancelled": return <XCircle className="w-7 h-7 text-destructive" />;
      default: return <CheckCircle className="w-7 h-7 text-on-surface-variant" />;
    }
  };

  return (
    <div className="px-6 lg:px-8 py-8 lg:py-10 max-w-6xl mx-auto">
      <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-primary mb-2">My Reservations</h2>
          <p className="text-on-surface-variant text-sm max-w-md">Manage your workspace bookings and view history.</p>
        </div>
        <div className="flex p-1 bg-surface-container-low rounded-xl">
          <button onClick={() => setTab("upcoming")} className={`px-6 py-2 text-sm font-semibold rounded-lg transition-all ${tab === "upcoming" ? "text-secondary bg-surface-container-lowest shadow-sm" : "text-on-surface-variant"}`}>
            Upcoming ({upcoming.length})
          </button>
          <button onClick={() => setTab("past")} className={`px-6 py-2 text-sm font-semibold rounded-lg transition-all ${tab === "past" ? "text-secondary bg-surface-container-lowest shadow-sm" : "text-on-surface-variant"}`}>
            Past ({past.length})
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 lg:gap-6 mb-10">
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-elegant">
          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Total</p>
          <p className="text-2xl font-extrabold text-primary">{userReservations.length}</p>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-elegant">
          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Upcoming</p>
          <p className="text-2xl font-extrabold text-secondary">{upcoming.length}</p>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-elegant">
          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Completed</p>
          <p className="text-2xl font-extrabold text-primary">{past.filter((r) => r.status === "completed").length}</p>
        </div>
      </div>

      {displayed.length === 0 ? (
        <div className="text-center py-20">
          <Calendar className="w-16 h-16 text-outline-variant mx-auto mb-4" />
          <h3 className="text-xl font-bold text-primary mb-2">No {tab} reservations</h3>
          <p className="text-on-surface-variant">
            {tab === "upcoming" ? "Book a room to get started!" : "Your past bookings will appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayed.map((r) => {
            const room = rooms.find((rm) => rm.id === r.roomId);
            return (
              <div key={r.id} className="bg-surface-container-lowest rounded-2xl p-4 lg:p-6 shadow-elegant hover:shadow-xl transition-shadow flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4 lg:gap-6">
                  {room ? (
                    <img src={room.image} alt={room.name} className="w-14 h-14 rounded-xl object-cover hidden sm:block" loading="lazy" width={56} height={56} />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-surface-container-high hidden sm:flex">
                      {getStatusIcon(r.status)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-primary text-lg">{r.title}</h3>
                    <p className="text-sm text-on-surface-variant">{r.roomName}</p>
                    <div className="flex flex-wrap items-center gap-3 lg:gap-4 mt-2 text-xs text-on-surface-variant">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {r.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {r.startTime} - {r.endTime}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {r.floor}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {r.attendees}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 self-end lg:self-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    r.status === "confirmed" ? "bg-secondary/10 text-secondary" :
                    r.status === "pending" ? "bg-amber-50 text-amber-600" :
                    r.status === "cancelled" ? "bg-destructive/10 text-destructive" :
                    "bg-surface-container-high text-on-surface-variant"
                  }`}>
                    {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                  </span>
                  {(r.status === "confirmed" || r.status === "pending") && (
                    <div className="flex gap-2">
                      <button onClick={() => openModify(r.id)} className="px-4 py-2 bg-surface-container-low text-primary rounded-lg text-xs font-semibold hover:bg-surface-container-high transition-colors">
                        Modify
                      </button>
                      <button onClick={() => setCancelTarget(r.id)} className="px-4 py-2 bg-destructive/10 text-destructive rounded-lg text-xs font-semibold hover:bg-destructive/20 transition-colors">
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Dialog */}
      <AlertDialog open={!!cancelTarget} onOpenChange={() => setCancelTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Reservation?</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel your booking. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Cancel Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modify Dialog */}
      <Dialog open={!!modifyTarget} onOpenChange={() => setModifyTarget(null)}>
        <DialogContent className="sm:max-w-md" aria-describedby="modify-reservation-description">
          <DialogHeader>
            <DialogTitle>Modify Reservation</DialogTitle>
            <DialogDescription id="modify-reservation-description">Update the date, time, or title for this booking.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Title</label>
              <input type="text" value={modifyTitle} onChange={(e) => setModifyTitle(e.target.value)} className="w-full px-3 py-2 bg-surface-container-low border-0 rounded-lg text-foreground focus:ring-2 focus:ring-secondary/40" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Date</label>
              <input type="date" value={modifyDate} onChange={(e) => setModifyDate(e.target.value)} className="w-full px-3 py-2 bg-surface-container-low border-0 rounded-lg text-foreground focus:ring-2 focus:ring-secondary/40" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Start</label>
                <select value={modifyStart} onChange={(e) => setModifyStart(e.target.value)} className="w-full px-3 py-2 bg-surface-container-low border-0 rounded-lg text-foreground focus:ring-2 focus:ring-secondary/40">
                  {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">End</label>
                <select value={modifyEnd} onChange={(e) => setModifyEnd(e.target.value)} className="w-full px-3 py-2 bg-surface-container-low border-0 rounded-lg text-foreground focus:ring-2 focus:ring-secondary/40">
                  {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setModifyTarget(null)} className="px-4 py-2 bg-surface-container-high text-primary rounded-lg font-semibold text-sm">Cancel</button>
            <button onClick={handleModify} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold text-sm">Save Changes</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserReservations;
