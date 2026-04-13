import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, CalendarPlus, CalendarDays, User, Settings, HelpCircle, DoorOpen, LogOut, Bell, Search } from "lucide-react";

const navItems = [
  { to: "/user/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/user/book", icon: CalendarPlus, label: "Book Now" },
  { to: "/user/reservations", icon: CalendarDays, label: "Reservations" },
  { to: "/user/profile", icon: User, label: "Profile" },
];

const UserLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="h-screen w-72 flex flex-col fixed left-0 top-0 bg-surface-container-low py-6 z-50">
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
              className={({ isActive }) =>
                `mx-2 px-4 py-3 flex items-center gap-3 font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground rounded-lg"
                    : "text-muted-foreground hover:bg-surface-container-high"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto px-2 space-y-1">
          <button
            className="mx-2 px-4 py-3 flex items-center gap-3 font-medium text-sm text-muted-foreground hover:bg-surface-container-high w-full transition-all duration-200"
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
          <button className="mx-2 px-4 py-3 flex items-center gap-3 font-medium text-sm text-muted-foreground hover:bg-surface-container-high w-full transition-all duration-200">
            <HelpCircle className="w-5 h-5" />
            Support
          </button>
          <button
            onClick={() => navigate("/")}
            className="mx-2 px-4 py-3 flex items-center gap-3 font-medium text-sm text-destructive hover:bg-error-container w-full transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-72">
        {/* Top Nav */}
        <header className="glass-panel sticky top-0 z-40 flex justify-between items-center w-full px-8 h-16">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
              <input
                type="text"
                placeholder="Find a workspace..."
                className="bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:ring-2 focus:ring-secondary/40 transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-muted-foreground hover:bg-surface-container-high p-2 rounded-full transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/30">
              <div className="text-right">
                <p className="text-sm font-bold text-primary">Alex Sterling</p>
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
