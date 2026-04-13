import { TrendingUp, TrendingDown, Users, DoorOpen, Calendar, Clock, AlertTriangle, Activity } from "lucide-react";

const kpis = [
  { label: "Total Reservations", value: "1,247", change: "+12%", up: true, icon: Calendar },
  { label: "Active Rooms", value: "18", change: "+2", up: true, icon: DoorOpen },
  { label: "Avg. Utilization", value: "73%", change: "+5%", up: true, icon: Activity },
  { label: "Maintenance Alerts", value: "3", change: "-1", up: false, icon: AlertTriangle },
];

const recentBookings = [
  { user: "Alex Sterling", room: "Director Board", time: "2:00 PM", status: "active", duration: "1.5h" },
  { user: "Sarah Chen", room: "Meeting Room #1", time: "3:30 PM", status: "upcoming", duration: "1h" },
  { user: "James Wilson", room: "Innovation Lab", time: "9:00 AM", status: "completed", duration: "3h" },
  { user: "Emma Davis", room: "Executive Lounge", time: "11:00 AM", status: "completed", duration: "2h" },
  { user: "Michael Brown", room: "Meeting Room #2", time: "4:00 PM", status: "upcoming", duration: "1h" },
];

const roomUtilization = [
  { name: "Director Board", utilization: 92, bookings: 45 },
  { name: "Meeting Room #1", utilization: 78, bookings: 38 },
  { name: "Innovation Lab", utilization: 65, bookings: 28 },
  { name: "Executive Lounge", utilization: 54, bookings: 22 },
  { name: "Meeting Room #2", utilization: 41, bookings: 15 },
];

const AdminDashboard = () => {
  return (
    <div className="px-12 py-10">
      {/* Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-headline font-bold tracking-tight text-primary mb-2">Admin Dashboard</h2>
          <p className="text-on-surface-variant font-medium">Real-time overview of The Atrium executive operations.</p>
        </div>
        <div className="bg-surface-container-lowest px-5 py-3 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">System Health</span>
            <span className="text-sm font-semibold text-secondary">Optimal Performance</span>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-surface-container-lowest p-6 rounded-xl hover:shadow-xl transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                <kpi.icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold flex items-center gap-1 ${kpi.up ? "text-secondary" : "text-destructive"}`}>
                {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {kpi.change}
              </span>
            </div>
            <p className="text-3xl font-extrabold tracking-tight text-primary">{kpi.value}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Bookings */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-6 shadow-elegant">
          <h3 className="text-lg font-bold text-primary mb-6">Recent Bookings</h3>
          <div className="space-y-0">
            {recentBookings.map((b, i) => (
              <div key={i} className="flex items-center justify-between py-4 hover:bg-surface-container-high/50 px-3 -mx-3 rounded-lg transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center">
                    <Users className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-primary">{b.user}</p>
                    <p className="text-xs text-on-surface-variant">{b.room}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary">{b.time}</p>
                    <p className="text-xs text-on-surface-variant">{b.duration}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    b.status === "active" ? "bg-secondary/10 text-secondary" :
                    b.status === "upcoming" ? "bg-primary/5 text-primary" :
                    "bg-surface-container-high text-on-surface-variant"
                  }`}>
                    {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Room Utilization */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-6 shadow-elegant">
          <h3 className="text-lg font-bold text-primary mb-6">Room Utilization</h3>
          <div className="space-y-5">
            {roomUtilization.map((room) => (
              <div key={room.name}>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-primary">{room.name}</p>
                  <p className="text-xs font-bold text-on-surface-variant">{room.utilization}%</p>
                </div>
                <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${room.utilization > 80 ? "bg-secondary" : room.utilization > 50 ? "bg-primary" : "bg-outline-variant"}`}
                    style={{ width: `${room.utilization}%` }}
                  />
                </div>
                <p className="text-[10px] text-on-surface-variant mt-1">{room.bookings} bookings this month</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
