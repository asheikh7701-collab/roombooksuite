import { Download, Calendar, TrendingUp, Users, Clock, DoorOpen, BarChart3 } from "lucide-react";

const dailyBookings = [
  { day: "MON", value: 75, max: 100 },
  { day: "TUE", value: 88, max: 100 },
  { day: "WED", value: 100, max: 100, highlight: true },
  { day: "THU", value: 62, max: 100 },
  { day: "FRI", value: 82, max: 100 },
  { day: "SAT", value: 30, max: 100 },
  { day: "SUN", value: 15, max: 100 },
];

const topKpis = [
  { label: "Total Bookings", value: "1,247", icon: Calendar, change: "+12%" },
  { label: "Peak Hours", value: "10-12 AM", icon: Clock },
  { label: "Unique Users", value: "342", icon: Users, change: "+8%" },
  { label: "Avg Duration", value: "1.5h", icon: Clock },
];

const roomPerformance = [
  { name: "Director Board", sessions: 45, hours: 67.5, utilization: 92, revenue: "$4,500" },
  { name: "Meeting Room #1", sessions: 38, hours: 38, utilization: 78, revenue: "$1,900" },
  { name: "Innovation Lab", sessions: 28, hours: 84, utilization: 65, revenue: "$4,200" },
  { name: "Executive Lounge", sessions: 22, hours: 22, utilization: 54, revenue: "$1,100" },
  { name: "Meeting Room #2", sessions: 15, hours: 15, utilization: 41, revenue: "$750" },
];

const peakHours = [
  { hour: "8 AM", bookings: 12 },
  { hour: "9 AM", bookings: 28 },
  { hour: "10 AM", bookings: 45 },
  { hour: "11 AM", bookings: 42 },
  { hour: "12 PM", bookings: 20 },
  { hour: "1 PM", bookings: 15 },
  { hour: "2 PM", bookings: 38 },
  { hour: "3 PM", bookings: 35 },
  { hour: "4 PM", bookings: 22 },
  { hour: "5 PM", bookings: 10 },
];

const maxBookings = Math.max(...peakHours.map((h) => h.bookings));

const AdminAnalytics = () => {
  return (
    <div className="p-12 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-primary mb-2">System Usage</h2>
          <p className="text-on-surface-variant font-medium">Monitoring organizational performance and room efficiency.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-surface-container-lowest px-4 py-2.5 rounded-xl shadow-sm gap-3">
            <Calendar className="w-4 h-4 text-secondary" />
            <span className="text-sm font-semibold text-primary">Oct 01 - Oct 31, 2024</span>
          </div>
          <button className="flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-opacity">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </header>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        {topKpis.map((kpi) => (
          <div key={kpi.label} className="bg-surface-container-lowest p-6 rounded-xl shadow-elegant">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center">
                <kpi.icon className="w-5 h-5 text-primary" />
              </div>
              {kpi.change && <span className="text-xs font-bold text-secondary">{kpi.change}</span>}
            </div>
            <p className="text-2xl font-extrabold text-primary">{kpi.value}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8 mb-12">
        {/* Bookings per Day Chart */}
        <div className="col-span-8 bg-surface-container-lowest p-8 rounded-xl shadow-elegant">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-primary">Bookings per Day</h3>
            <span className="text-xs font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full">+12% vs last week</span>
          </div>
          <div className="flex items-end justify-between h-48 px-4">
            {dailyBookings.map((d) => (
              <div key={d.day} className="flex flex-col items-center gap-2 w-full">
                <div className="w-8 bg-primary/10 rounded-t-lg relative" style={{ height: "128px" }}>
                  <div
                    className={`absolute bottom-0 w-full rounded-t-lg ${d.highlight ? "bg-secondary" : "bg-primary"}`}
                    style={{ height: `${(d.value / d.max) * 128}px` }}
                  />
                </div>
                <span className={`text-[10px] font-bold ${d.highlight ? "text-secondary" : "text-on-surface-variant"}`}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Hours */}
        <div className="col-span-4 bg-surface-container-lowest p-8 rounded-xl shadow-elegant">
          <h3 className="text-lg font-bold text-primary mb-6">Peak Hours</h3>
          <div className="space-y-3">
            {peakHours.map((h) => (
              <div key={h.hour} className="flex items-center gap-3">
                <span className="text-xs font-medium text-on-surface-variant w-12">{h.hour}</span>
                <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${h.bookings === maxBookings ? "bg-secondary" : "bg-primary/60"}`}
                    style={{ width: `${(h.bookings / maxBookings) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-primary w-8 text-right">{h.bookings}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Room Performance Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-elegant overflow-hidden">
        <div className="p-6 flex justify-between items-center">
          <h3 className="text-lg font-bold text-primary">Room Performance</h3>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-low">
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Room</th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Sessions</th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Hours Used</th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Utilization</th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-right">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {roomPerformance.map((room) => (
              <tr key={room.name} className="hover:bg-surface-container-high/50 transition-colors">
                <td className="py-4 px-6 font-semibold text-primary">{room.name}</td>
                <td className="py-4 px-6 text-sm text-on-surface-variant">{room.sessions}</td>
                <td className="py-4 px-6 text-sm text-on-surface-variant">{room.hours}h</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-surface-container-high rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${room.utilization > 80 ? "bg-secondary" : "bg-primary"}`}
                        style={{ width: `${room.utilization}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-primary">{room.utilization}%</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-right font-semibold text-primary">{room.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAnalytics;
