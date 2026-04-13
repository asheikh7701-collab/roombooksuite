import { useApp } from "@/context/AppContext";
import { TrendingUp, TrendingDown, Users, DoorOpen, Calendar, Clock, AlertTriangle, Activity } from "lucide-react";

const AdminDashboard = () => {
  const { rooms, reservations, users } = useApp();

  const activeReservations = reservations.filter((r) => r.status === "confirmed" || r.status === "pending");
  const completedReservations = reservations.filter((r) => r.status === "completed");
  const maintenanceRooms = rooms.filter((r) => r.status === "maintenance");

  const kpis = [
    { label: "Total Reservations", value: reservations.length.toString(), change: "+12%", up: true, icon: Calendar },
    { label: "Active Rooms", value: rooms.filter((r) => r.status !== "maintenance").length.toString(), change: `${rooms.length} total`, up: true, icon: DoorOpen },
    { label: "Active Users", value: users.filter((u) => u.status === "active").length.toString(), change: "+3", up: true, icon: Users },
    { label: "Maintenance", value: maintenanceRooms.length.toString(), change: maintenanceRooms.length === 0 ? "All clear" : "Needs attention", up: maintenanceRooms.length === 0, icon: AlertTriangle },
  ];

  const recentBookings = reservations.slice(0, 6);

  const roomUtilization = rooms.map((room) => {
    const roomBookings = reservations.filter((r) => r.roomId === room.id && r.status !== "cancelled");
    return { name: room.name, utilization: Math.min(Math.round((roomBookings.length / Math.max(reservations.length, 1)) * 100 * 3), 100), bookings: roomBookings.length, image: room.image };
  }).sort((a, b) => b.utilization - a.utilization);

  return (
    <div className="px-6 lg:px-12 py-8 lg:py-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-4">
        <div>
          <h2 className="text-3xl lg:text-4xl font-headline font-bold tracking-tight text-primary mb-2">Admin Dashboard</h2>
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

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-surface-container-lowest p-5 lg:p-6 rounded-xl hover:shadow-xl transition-shadow group">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Recent Bookings */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-6 shadow-elegant">
          <h3 className="text-lg font-bold text-primary mb-6">Recent Bookings</h3>
          <div className="space-y-0">
            {recentBookings.map((b) => {
              const room = rooms.find((r) => r.id === b.roomId);
              return (
                <div key={b.id} className="flex items-center justify-between py-3 hover:bg-surface-container-high/50 px-3 -mx-3 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    {room && <img src={room.image} alt={room.name} className="w-9 h-9 rounded-lg object-cover" loading="lazy" width={36} height={36} />}
                    <div>
                      <p className="font-semibold text-sm text-primary">{b.bookedBy}</p>
                      <p className="text-xs text-on-surface-variant">{b.roomName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-medium text-primary">{b.startTime}</p>
                      <p className="text-xs text-on-surface-variant">{b.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      b.status === "confirmed" ? "bg-secondary/10 text-secondary" :
                      b.status === "pending" ? "bg-amber-50 text-amber-600" :
                      b.status === "cancelled" ? "bg-destructive/10 text-destructive" :
                      "bg-surface-container-high text-on-surface-variant"
                    }`}>
                      {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Room Utilization */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-6 shadow-elegant">
          <h3 className="text-lg font-bold text-primary mb-6">Room Utilization</h3>
          <div className="space-y-5">
            {roomUtilization.slice(0, 5).map((room) => (
              <div key={room.name}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <img src={room.image} alt={room.name} className="w-6 h-6 rounded object-cover" loading="lazy" width={24} height={24} />
                    <p className="text-sm font-medium text-primary">{room.name}</p>
                  </div>
                  <p className="text-xs font-bold text-on-surface-variant">{room.utilization}%</p>
                </div>
                <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ${room.utilization > 80 ? "bg-secondary" : room.utilization > 50 ? "bg-primary" : "bg-outline-variant"}`} style={{ width: `${room.utilization}%` }} />
                </div>
                <p className="text-[10px] text-on-surface-variant mt-1">{room.bookings} bookings</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
