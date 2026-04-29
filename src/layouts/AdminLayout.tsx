import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, BarChart3, CalendarDays, Users, DoorOpen, LogOut, Bell, Search, Plus, Menu, X } from "lucide-react";
import { useApp } from "@/context/AppContext";

const navItems = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/inventory", icon: Package, label: "Inventory" },
  { to: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/admin/reservations", icon: CalendarDays, label: "Reservations" },
  { to: "/admin/users", icon: Users, label: "Users" },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const { signOut, loading, session, isAdmin } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!session || !isAdmin)) navigate("/admin/login");
  }, [loading, session, isAdmin, navigate]);

  const sidebar = (
    <>
      <div className="px-8 mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <DoorOpen className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-headline font-bold text-lg tracking-tighter text-primary">The Atrium</h2>
          <p className="text-xs text-on-surface-variant font-medium">Admin Console</p>
        </div>
      </div>

      <nav className="flex-grow space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `mx-2 px-4 py-3 flex items-center gap-3 font-medium text-sm transition-all duration-200 rounded-lg ${
                isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground hover:bg-surface-container-high"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-2 flex flex-col gap-1 pt-8">
        <button onClick={() => { navigate("/admin/reservations?new=1"); setSidebarOpen(false); }} className="mx-2 px-4 py-4 mb-4 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg">
          <Plus className="w-4 h-4" /> New Reservation
        </button>
        <button onClick={async () => { await signOut(); navigate("/"); setSidebarOpen(false); }} className="mx-2 px-4 py-3 flex items-center gap-3 font-medium text-sm text-destructive hover:bg-error-container w-full transition-all duration-200 rounded-lg">
          <LogOut className="w-5 h-5" /> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden lg:flex h-screen w-72 flex-col fixed left-0 top-0 bg-surface-container-low py-6 z-50">
        {sidebar}
      </aside>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-foreground/30" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-surface-container-low py-6 flex flex-col shadow-2xl">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-1 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex-1 lg:ml-72">
        <header className="glass-panel sticky top-0 z-40 flex justify-between items-center w-full px-4 lg:px-8 h-16">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-muted-foreground hover:bg-surface-container-high rounded-lg">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold tracking-tighter text-primary">RoomBook</h1>
            <div className="relative ml-4 hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
              <input type="text" placeholder="Search..." className="bg-surface-container-highest border-none rounded-full pl-10 pr-4 py-1.5 text-sm w-48 lg:w-80 focus:ring-2 focus:ring-secondary/40 transition-all" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-muted-foreground hover:bg-surface-container-high rounded-full transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center ml-2 ring-2 ring-primary-container">
              <Users className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
