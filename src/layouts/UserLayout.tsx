import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { LayoutDashboard, CalendarPlus, CalendarDays, User, Settings, HelpCircle, DoorOpen, LogOut, Bell, Search, Menu, X } from "lucide-react";

const navItems = [
  { to: "/user/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/user/book", icon: CalendarPlus, label: "Book Now" },
  { to: "/user/reservations", icon: CalendarDays, label: "Reservations" },
  { to: "/user/profile", icon: User, label: "Profile" },
];

const UserLayout = () => {
  const navigate = useNavigate();
  const { currentUser, reservations, signOut, loading, session } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!loading && !session) navigate("/");

  const notifications = reservations.filter((r) => r.status === "pending" && r.bookedBy === currentUser.name).length;

  const sidebar = (
    <>
      <div className="px-8 mb-10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <DoorOpen className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-primary font-extrabold tracking-tighter text-xl leading-none">RoomBook</h2>
          <p className="text-on-surface-variant text-[10px] uppercase tracking-widest font-bold mt-1">Executive Suite</p>
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

      <div className="mt-auto px-2 space-y-1">
        <button className="mx-2 px-4 py-3 flex items-center gap-3 font-medium text-sm text-muted-foreground hover:bg-surface-container-high w-full transition-all duration-200 rounded-lg">
          <Settings className="w-5 h-5" /> Settings
        </button>
        <button className="mx-2 px-4 py-3 flex items-center gap-3 font-medium text-sm text-muted-foreground hover:bg-surface-container-high w-full transition-all duration-200 rounded-lg">
          <HelpCircle className="w-5 h-5" /> Support
        </button>
        <button onClick={async () => { await signOut(); navigate("/"); setSidebarOpen(false); }} className="mx-2 px-4 py-3 flex items-center gap-3 font-medium text-sm text-destructive hover:bg-error-container w-full transition-all duration-200 rounded-lg">
          <LogOut className="w-5 h-5" /> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex h-screen w-72 flex-col fixed left-0 top-0 bg-surface-container-low py-6 z-50">
        {sidebar}
      </aside>

      {/* Mobile Sidebar Overlay */}
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

      {/* Main */}
      <div className="flex-1 lg:ml-72">
        <header className="glass-panel sticky top-0 z-40 flex justify-between items-center w-full px-4 lg:px-8 h-16">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-muted-foreground hover:bg-surface-container-high rounded-lg">
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
              <input type="text" placeholder="Find a workspace..." className="bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-sm w-48 lg:w-64 focus:ring-2 focus:ring-secondary/40 transition-all" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-muted-foreground hover:bg-surface-container-high p-2 rounded-full transition-colors relative">
              <Bell className="w-5 h-5" />
              {notifications > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-surface-container-lowest" />}
            </button>
            <div className="flex items-center gap-3 pl-3 border-l border-outline-variant/30">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-primary">{currentUser.name}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
            </div>
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
