import { useApp } from "@/context/AppContext";
import { Download, Calendar, Clock, Users, DoorOpen } from "lucide-react";
import { toast } from "sonner";

const AdminAnalytics = () => {
  const { rooms, reservations, users } = useApp();

  const confirmed = reservations.filter((r) => r.status === "confirmed").length;
  const completed = reservations.filter((r) => r.status === "completed").length;
  const activeUsers = users.filter((u) => u.status === "active").length;

  const dailyBookings = [
    { day: "MON", value: 75 }, { day: "TUE", value: 88 }, { day: "WED", value: 100 },
    { day: "THU", value: 62 }, { day: "FRI", value: 82 }, { day: "SAT", value: 30 }, { day: "SUN", value: 15 },
  ];
  const maxDaily = Math.max(...dailyBookings.map((d) => d.value));

  const peakHours = [
    { hour: "8 AM", bookings: 12 }, { hour: "9 AM", bookings: 28 }, { hour: "10 AM", bookings: 45 },
    { hour: "11 AM", bookings: 42 }, { hour: "12 PM", bookings: 20 }, { hour: "1 PM", bookings: 15 },
    { hour: "2 PM", bookings: 38 }, { hour: "3 PM", bookings: 35 }, { hour: "4 PM", bookings: 22 }, { hour: "5 PM", bookings: 10 },
  ];
  const maxPeak = Math.max(...peakHours.map((h) => h.bookings));

  const roomPerformance = rooms.map((room) => {
    const roomRes = reservations.filter((r) => r.roomId === room.id && r.status !== "cancelled");
    const util = Math.min(Math.round((roomRes.length / Math.max(reservations.length, 1)) * 100 * 3), 100);
    return { name: room.name, sessions: roomRes.length, hours: roomRes.length * 1.5, utilization: util, image: room.image };
  }).sort((a, b) => b.utilization - a.utilization);

  const handleExport = () => {
    const csv = [
      "Room,Sessions,Hours,Utilization",
      ...roomPerformance.map((r) => `${r.name},${r.sessions},${r.hours},${r.utilization}%`),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "room-analytics.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported", { description: "Room analytics data has been downloaded." });
  };

  return (
    <div className="p-6 lg:p-12 max-w-7xl mx-auto">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-4">
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-primary mb-2">System Usage</h2>
          <p className="text-on-surface-variant font-medium">Monitoring organizational performance and room efficiency.</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleExport} className="flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-opacity">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12">
        {[
          { label: "Total Bookings", value: reservations.length.toString(), icon: Calendar },
          { label: "Peak Hours", value: "10-12 AM", icon: Clock },
          { label: "Active Users", value: activeUsers.toString(), icon: Users },
          { label: "Avg Duration", value: "1.5h", icon: Clock },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-surface-container-lowest p-5 lg:p-6 rounded-xl shadow-elegant">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center"><kpi.icon className="w-5 h-5 text-primary" /></div>
            </div>
            <p className="text-2xl font-extrabold text-primary">{kpi.value}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6 lg:gap-8 mb-12">
        {/* Bookings per Day */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-6 lg:p-8 rounded-xl shadow-elegant">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-primary">Bookings per Day</h3>
            <span className="text-xs font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full">+12% vs last week</span>
          </div>
          <div className="flex items-end justify-between h-48 px-2 lg:px-4">
            {dailyBookings.map((d) => (
              <div key={d.day} className="flex flex-col items-center gap-2 w-full">
                <div className="w-6 lg:w-8 bg-primary/10 rounded-t-lg relative" style={{ height: "128px" }}>
                  <div className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-700 ${d.value === maxDaily ? "bg-secondary" : "bg-primary"}`} style={{ height: `${(d.value / maxDaily) * 128}px` }} />
                </div>
                <span className={`text-[10px] font-bold ${d.value === maxDaily ? "text-secondary" : "text-on-surface-variant"}`}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Hours */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest p-6 lg:p-8 rounded-xl shadow-elegant">
          <h3 className="text-lg font-bold text-primary mb-6">Peak Hours</h3>
          <div className="space-y-3">
            {peakHours.map((h) => (
              <div key={h.hour} className="flex items-center gap-3">
                <span className="text-xs font-medium text-on-surface-variant w-12">{h.hour}</span>
                <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${h.bookings === maxPeak ? "bg-secondary" : "bg-primary/60"}`} style={{ width: `${(h.bookings / maxPeak) * 100}%` }} />
                </div>
                <span className="text-xs font-bold text-primary w-8 text-right">{h.bookings}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Room Performance */}
      <div className="bg-surface-container-lowest rounded-xl shadow-elegant overflow-hidden">
        <div className="p-6"><h3 className="text-lg font-bold text-primary">Room Performance</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Room</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Sessions</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Hours Used</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Utilization</th>
              </tr>
            </thead>
            <tbody>
              {roomPerformance.map((room) => (
                <tr key={room.name} className="hover:bg-surface-container-high/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img src={room.image} alt={room.name} className="w-8 h-8 rounded-lg object-cover" loading="lazy" width={32} height={32} />
                      <span className="font-semibold text-primary">{room.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-on-surface-variant">{room.sessions}</td>
                  <td className="py-4 px-6 text-sm text-on-surface-variant">{room.hours}h</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-surface-container-high rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${room.utilization > 80 ? "bg-secondary" : "bg-primary"}`} style={{ width: `${room.utilization}%` }} />
                      </div>
                      <span className="text-xs font-bold text-primary">{room.utilization}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
