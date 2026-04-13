import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Search, User, Mail, Building, Calendar, Shield, UserCheck, UserX } from "lucide-react";
import { toast } from "sonner";

const AdminUsers = () => {
  const { users, setUsers } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  const filtered = users
    .filter((u) => filter === "all" || u.status === filter)
    .filter((u) => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        const newStatus = u.status === "active" ? "inactive" : "active";
        toast.success(`User ${newStatus === "active" ? "activated" : "deactivated"}`, { description: u.name });
        return { ...u, status: newStatus as "active" | "inactive" };
      })
    );
  };

  const counts = {
    all: users.length,
    active: users.filter((u) => u.status === "active").length,
    inactive: users.filter((u) => u.status === "inactive").length,
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-primary mb-2">User Management</h1>
        <p className="text-on-surface-variant">View and manage users across The Atrium.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 lg:gap-6 mb-8">
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-elegant">
          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Total Users</p>
          <p className="text-2xl font-extrabold text-primary">{users.length}</p>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-elegant">
          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Active</p>
          <p className="text-2xl font-extrabold text-secondary">{counts.active}</p>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-elegant">
          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Inactive</p>
          <p className="text-2xl font-extrabold text-on-surface-variant">{counts.inactive}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search users..." className="w-full pl-10 pr-4 py-2.5 bg-surface-container-highest border-none rounded-full text-sm focus:ring-2 focus:ring-secondary/40" />
        </div>
        <div className="flex p-1 bg-surface-container-low rounded-xl">
          {(["all", "active", "inactive"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all ${filter === f ? "text-secondary bg-surface-container-lowest shadow-sm" : "text-on-surface-variant"}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
            </button>
          ))}
        </div>
      </div>

      {/* User Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {filtered.map((user) => (
          <div key={user.id} className="bg-surface-container-lowest rounded-2xl p-6 shadow-elegant hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-primary">{user.name}</h3>
                  <p className="text-xs text-on-surface-variant">{user.email}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${user.role === "admin" ? "bg-primary/10 text-primary" : "bg-surface-container-high text-on-surface-variant"}`}>
                {user.role === "admin" ? "Admin" : "User"}
              </span>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <Building className="w-3.5 h-3.5" />
                <span>{user.department}</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <Calendar className="w-3.5 h-3.5" />
                <span>Joined {user.joinedAt}</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <Shield className="w-3.5 h-3.5" />
                <span>{user.totalBookings} total bookings</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                user.status === "active" ? "bg-secondary/10 text-secondary" : "bg-surface-container-high text-on-surface-variant"
              }`}>
                {user.status === "active" ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                {user.status === "active" ? "Active" : "Inactive"}
              </span>
              <button
                onClick={() => toggleStatus(user.id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  user.status === "active" ? "bg-destructive/10 text-destructive hover:bg-destructive/20" : "bg-secondary/10 text-secondary hover:bg-secondary/20"
                }`}
              >
                {user.status === "active" ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;
