import { useState } from "react";
import { Clock, MapPin, Users, MoreVertical, Calendar, CheckCircle, XCircle } from "lucide-react";

const upcomingReservations = [
  {
    id: 1,
    room: "Director Board Meeting Room",
    date: "Oct 28, 2024",
    time: "2:00 PM - 3:30 PM",
    floor: "Floor 12",
    attendees: 8,
    status: "confirmed",
    title: "Q4 Strategy Review",
  },
  {
    id: 2,
    room: "Meeting Room #1",
    date: "Oct 30, 2024",
    time: "10:00 AM - 11:00 AM",
    floor: "Floor 8",
    attendees: 4,
    status: "confirmed",
    title: "Design Sprint Kickoff",
  },
  {
    id: 3,
    room: "Innovation Lab",
    date: "Nov 1, 2024",
    time: "9:00 AM - 12:00 PM",
    floor: "Floor 6",
    attendees: 10,
    status: "pending",
    title: "Product Demo Session",
  },
];

const pastReservations = [
  {
    id: 4,
    room: "Executive Lounge",
    date: "Oct 20, 2024",
    time: "3:00 PM - 4:00 PM",
    floor: "Floor 12",
    attendees: 3,
    status: "completed",
    title: "Client Onboarding",
  },
  {
    id: 5,
    room: "Meeting Room #1",
    date: "Oct 18, 2024",
    time: "1:00 PM - 2:00 PM",
    floor: "Floor 8",
    attendees: 5,
    status: "completed",
    title: "Weekly Stand-up",
  },
];

const UserReservations = () => {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const reservations = tab === "upcoming" ? upcomingReservations : pastReservations;

  return (
    <div className="px-8 py-10 max-w-6xl mx-auto">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-primary mb-2">My Reservations</h2>
          <p className="text-on-surface-variant text-sm max-w-md">
            Manage your workspace bookings and view history of past office sessions.
          </p>
        </div>
        <div className="flex p-1 bg-surface-container-low rounded-xl">
          <button
            onClick={() => setTab("upcoming")}
            className={`px-6 py-2 text-sm font-semibold rounded-lg transition-all ${
              tab === "upcoming" ? "text-secondary bg-surface-container-lowest shadow-sm" : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setTab("past")}
            className={`px-6 py-2 text-sm font-semibold rounded-lg transition-all ${
              tab === "past" ? "text-secondary bg-surface-container-lowest shadow-sm" : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Past
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-elegant">
          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Total Bookings</p>
          <p className="text-2xl font-extrabold text-primary">{upcomingReservations.length + pastReservations.length}</p>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-elegant">
          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Upcoming</p>
          <p className="text-2xl font-extrabold text-secondary">{upcomingReservations.length}</p>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-elegant">
          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Hours Booked</p>
          <p className="text-2xl font-extrabold text-primary">18.5</p>
        </div>
      </div>

      {/* Reservation Cards */}
      <div className="space-y-4">
        {reservations.map((r) => (
          <div key={r.id} className="bg-surface-container-lowest rounded-2xl p-6 shadow-elegant hover:shadow-xl transition-shadow flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                r.status === "confirmed" ? "bg-secondary/10" : r.status === "pending" ? "bg-amber-50" : "bg-surface-container-high"
              }`}>
                {r.status === "confirmed" ? <CheckCircle className="w-7 h-7 text-secondary" /> :
                 r.status === "pending" ? <Clock className="w-7 h-7 text-amber-500" /> :
                 <CheckCircle className="w-7 h-7 text-on-surface-variant" />}
              </div>
              <div>
                <h3 className="font-bold text-primary text-lg">{r.title}</h3>
                <p className="text-sm text-on-surface-variant">{r.room}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-on-surface-variant">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {r.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {r.time}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {r.floor}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {r.attendees}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                r.status === "confirmed" ? "bg-secondary/10 text-secondary" :
                r.status === "pending" ? "bg-amber-50 text-amber-600" :
                "bg-surface-container-high text-on-surface-variant"
              }`}>
                {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
              </span>
              {tab === "upcoming" && (
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-surface-container-low text-primary rounded-lg text-xs font-semibold hover:bg-surface-container-high transition-colors">
                    Modify
                  </button>
                  <button className="px-4 py-2 bg-destructive/10 text-destructive rounded-lg text-xs font-semibold hover:bg-destructive/20 transition-colors">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserReservations;
