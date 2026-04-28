import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { CalendarPlus, Clock, MapPin, Users, CheckCircle, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-conference.jpg";

const UserDashboard = () => {
  const { rooms, reservations, currentUser } = useApp();
  const navigate = useNavigate();

  const upcomingReservations = reservations.filter(
    (r) => r.status === "confirmed" || r.status === "pending"
  );
  const availableRooms = rooms.filter((r) => r.status === "available");

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      {/* Hero */}
      <section className="mb-12 relative overflow-hidden rounded-3xl bg-primary min-h-[320px]">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Conference room" className="w-full h-full object-cover" width={1920} height={800} />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/40" />
        </div>
        <div className="relative z-10 p-8 lg:p-12 max-w-lg">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-container/20 text-tertiary-fixed text-xs font-bold uppercase tracking-widest mb-6">
            Welcome Back
          </span>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-primary-foreground">
            Good Morning, {currentUser.name.split(" ")[0]}!
          </h1>
          <p className="text-primary-foreground/70 text-lg mb-8 leading-relaxed">
            {upcomingReservations.length > 0
              ? `You have ${upcomingReservations.length} upcoming reservation${upcomingReservations.length > 1 ? "s" : ""}. Your workspace is prepped and ready.`
              : "No upcoming meetings. Book a space to get started."}
          </p>
          {currentUser.permissions.canBookRooms && (
            <button
              onClick={() => navigate("/user/book")}
              className="bg-secondary-container text-secondary px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:scale-105 active:scale-95 transition-all duration-150"
            >
              <CalendarPlus className="w-5 h-5" />
              Reserve a Space
            </button>
          )}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { label: "Active Bookings", value: upcomingReservations.length.toString(), icon: CalendarPlus, accent: true },
          { label: "Rooms Available", value: availableRooms.length.toString(), icon: MapPin, accent: false },
          { label: "Total Rooms", value: rooms.length.toString(), icon: Users, accent: false },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-container-lowest p-6 rounded-2xl shadow-elegant group hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.accent ? "bg-secondary/10 text-secondary" : "bg-primary/5 text-primary"}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-extrabold tracking-tight text-primary">{stat.value}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Next Up */}
      {upcomingReservations.length > 0 && (
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold tracking-tight text-primary">Next Up</h2>
            <button onClick={() => navigate("/user/reservations")} className="text-sm font-semibold text-secondary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          {upcomingReservations.slice(0, 2).map((res) => {
            const room = rooms.find((r) => r.id === res.roomId);
            return (
              <div key={res.id} className="bg-surface-container-lowest p-6 rounded-2xl shadow-elegant flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-6">
                  {room && (
                    <img src={room.image} alt={room.name} className="w-16 h-16 rounded-xl object-cover hidden sm:block" loading="lazy" width={64} height={64} />
                  )}
                  <div>
                    <h3 className="font-bold text-lg text-primary">{res.title}</h3>
                    <p className="text-sm text-on-surface-variant">{res.roomName}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-on-surface-variant">
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {res.startTime} - {res.endTime}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {res.floor}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  res.status === "confirmed" ? "bg-secondary/10 text-secondary" : "bg-amber-50 text-amber-600"
                }`}>
                  {res.status === "confirmed" ? "Confirmed" : "Pending"}
                </span>
              </div>
            );
          })}
        </section>
      )}

      {/* Available Rooms */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold tracking-tight text-primary">Available Rooms</h2>
          <button onClick={() => navigate("/user/book")} className="text-sm font-semibold text-secondary hover:underline flex items-center gap-1">
            Book now <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableRooms.slice(0, 6).map((room) => (
            <div key={room.id} className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-elegant group hover:shadow-xl transition-all">
              <div className="h-40 overflow-hidden">
                <img src={room.image} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" width={400} height={160} />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-primary">{room.name}</h3>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-secondary/10 text-secondary">Available</span>
                </div>
                <p className="text-xs text-on-surface-variant mb-3 line-clamp-2">{room.description}</p>
                <div className="flex gap-3 text-xs text-on-surface-variant mb-4">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {room.capacity} Seats</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {room.floor}</span>
                </div>
                {currentUser.permissions.canBookRooms && (
                  <button
                    onClick={() => navigate("/user/book")}
                    className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary-container transition-colors"
                  >
                    Book Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;
