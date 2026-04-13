import { CalendarPlus, Clock, MapPin, Users, Wifi, Video, CheckCircle } from "lucide-react";

const upcomingBooking = {
  room: "Director Board Meeting Room",
  time: "2:00 PM - 3:30 PM",
  floor: "Floor 12",
};

const quickStats = [
  { label: "Active Bookings", value: "3", icon: CalendarPlus, accent: true },
  { label: "Hours This Week", value: "12", icon: Clock },
  { label: "Rooms Available", value: "5", icon: MapPin },
];

const availableRooms = [
  { name: "Meeting Room #1", capacity: 6, floor: "Floor 8", amenities: ["Wi-Fi", "Whiteboard"], available: true },
  { name: "Executive Lounge", capacity: 4, floor: "Floor 12", amenities: ["Video Call", "Wi-Fi"], available: true },
  { name: "Innovation Lab", capacity: 10, floor: "Floor 6", amenities: ["Display", "Wi-Fi"], available: false },
];

const UserDashboard = () => {
  return (
    <div className="p-10 max-w-7xl mx-auto">
      {/* Hero */}
      <section className="mb-12 relative overflow-hidden rounded-3xl bg-primary p-12">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-primary-container" />
        <div className="relative z-10 max-w-lg">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-container/20 text-tertiary-fixed text-xs font-bold uppercase tracking-widest mb-6">
            Welcome Back
          </span>
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-primary-foreground">Good Morning, Alex!</h1>
          <p className="text-primary-foreground/70 text-lg mb-8 leading-relaxed">
            You have an upcoming meeting in 2 hours. Your workspace is prepped and ready.
          </p>
          <button className="bg-secondary-container text-secondary px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:scale-105 active:scale-95 transition-all duration-150">
            <CalendarPlus className="w-5 h-5" />
            Reserve a Space
          </button>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {quickStats.map((stat) => (
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

      {/* Upcoming Booking */}
      <section className="mb-12">
        <h2 className="text-xl font-bold tracking-tight text-primary mb-6">Next Up</h2>
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-elegant flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-secondary" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-primary">{upcomingBooking.room}</h3>
              <div className="flex items-center gap-4 mt-1 text-sm text-on-surface-variant">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {upcomingBooking.time}</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {upcomingBooking.floor}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-surface-container-low text-primary rounded-xl text-sm font-semibold hover:bg-surface-container-high transition-colors">
              Modify
            </button>
            <button className="px-5 py-2.5 bg-destructive/10 text-destructive rounded-xl text-sm font-semibold hover:bg-destructive/20 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </section>

      {/* Available Rooms */}
      <section>
        <h2 className="text-xl font-bold tracking-tight text-primary mb-6">Available Now</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {availableRooms.map((room) => (
            <div key={room.name} className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-elegant group hover:shadow-xl transition-all">
              <div className="h-40 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                <MapPin className="w-12 h-12 text-primary/20" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-primary">{room.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${room.available ? "bg-secondary/10 text-secondary" : "bg-surface-container-high text-on-surface-variant"}`}>
                    {room.available ? "Available" : "Occupied"}
                  </span>
                </div>
                <div className="flex gap-3 text-xs text-on-surface-variant mb-4">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {room.capacity} Seats</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {room.floor}</span>
                </div>
                <div className="flex gap-2 mb-4">
                  {room.amenities.map((a) => (
                    <span key={a} className="px-2 py-1 bg-surface-container-low rounded text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      {a}
                    </span>
                  ))}
                </div>
                {room.available && (
                  <button className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary-container transition-colors">
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
