import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Search, User, Building, Calendar, Shield, UserCheck, UserX, Plus, Save } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { AppUser, UserPermissions } from "@/data/appData";

const permissionOptions: { key: keyof UserPermissions; label: string }[] = [
  { key: "canViewDashboard", label: "Dashboard" },
  { key: "canBookRooms", label: "Book rooms" },
  { key: "canViewReservations", label: "Reservations" },
  { key: "canManageProfile", label: "Profile" },
];

const defaultPermissions: UserPermissions = {
  canViewDashboard: true,
  canBookRooms: true,
  canViewReservations: true,
  canManageProfile: true,
};

const AdminUsers = () => {
  const { users, createUser, updateUserAccess } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [showAdd, setShowAdd] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [form, setForm] = useState({ email: "", password: "", fullName: "", department: "", jobTitle: "", role: "user" as "user" | "admin", permissions: defaultPermissions });

  const filtered = users
    .filter((u) => filter === "all" || u.status === filter)
    .filter((u) => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));

  const counts = {
    all: users.length,
    active: users.filter((u) => u.status === "active").length,
    inactive: users.filter((u) => u.status === "inactive").length,
  };

  const resetForm = () => setForm({ email: "", password: "", fullName: "", department: "", jobTitle: "", role: "user", permissions: defaultPermissions });

  const handleAdd = async () => {
    try {
      await createUser(form);
      toast.success("User created", { description: `${form.fullName} can now access RoomBook.` });
      setShowAdd(false);
      resetForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create user.");
    }
  };

  const openAccess = (user: AppUser) => {
    setEditingUser(user);
    setForm({ email: user.email, password: "", fullName: user.name, department: user.department, jobTitle: "", role: user.role, permissions: user.permissions });
  };

  const handleSaveAccess = async () => {
    if (!editingUser) return;
    try {
      await updateUserAccess(editingUser.id, { role: form.role, permissions: form.permissions });
      toast.success("Access updated", { description: editingUser.name });
      setEditingUser(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update access.");
    }
  };

  const toggleStatus = async (user: AppUser) => {
    const nextStatus = user.status === "active" ? "inactive" : "active";
    try {
      await updateUserAccess(user.id, { status: nextStatus });
      toast.success(`User ${nextStatus === "active" ? "activated" : "deactivated"}`, { description: user.name });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update user status.");
    }
  };

  const permissionsForm = (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {permissionOptions.map((permission) => (
        <button
          type="button"
          key={permission.key}
          onClick={() => setForm((prev) => ({ ...prev, permissions: { ...prev.permissions, [permission.key]: !prev.permissions[permission.key] } }))}
          className={`px-4 py-3 rounded-xl text-sm font-semibold text-left transition-colors ${form.permissions[permission.key] ? "bg-secondary/10 text-secondary" : "bg-surface-container-high text-on-surface-variant"}`}
        >
          {form.permissions[permission.key] ? "✓" : "—"} {permission.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary mb-2">User Management</h1>
          <p className="text-on-surface-variant">Create accounts, assign roles, and control user-side access.</p>
        </div>
        <button onClick={() => { resetForm(); setShowAdd(true); }} className="bg-primary text-primary-foreground px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 lg:gap-6 mb-8">
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-elegant"><p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Total Users</p><p className="text-2xl font-extrabold text-primary">{users.length}</p></div>
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-elegant"><p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Active</p><p className="text-2xl font-extrabold text-secondary">{counts.active}</p></div>
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-elegant"><p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Inactive</p><p className="text-2xl font-extrabold text-on-surface-variant">{counts.inactive}</p></div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search users..." className="w-full pl-10 pr-4 py-2.5 bg-surface-container-highest border-none rounded-full text-sm focus:ring-2 focus:ring-secondary/40" />
        </div>
        <div className="flex p-1 bg-surface-container-low rounded-xl">
          {(["all", "active", "inactive"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all ${filter === f ? "text-secondary bg-surface-container-lowest shadow-sm" : "text-on-surface-variant"}`}>{f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {filtered.map((user) => (
          <div key={user.id} className="bg-surface-container-lowest rounded-2xl p-6 shadow-elegant hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center"><User className="w-5 h-5 text-primary-foreground" /></div>
                <div><h3 className="font-bold text-primary">{user.name}</h3><p className="text-xs text-on-surface-variant">{user.email}</p></div>
              </div>
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${user.role === "admin" ? "bg-primary/10 text-primary" : "bg-surface-container-high text-on-surface-variant"}`}>{user.role === "admin" ? "Admin" : "User"}</span>
            </div>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center gap-2 text-on-surface-variant"><Building className="w-3.5 h-3.5" /><span>{user.department}</span></div>
              <div className="flex items-center gap-2 text-on-surface-variant"><Calendar className="w-3.5 h-3.5" /><span>Joined {user.joinedAt}</span></div>
              <div className="flex items-center gap-2 text-on-surface-variant"><Shield className="w-3.5 h-3.5" /><span>{user.totalBookings} total bookings</span></div>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {permissionOptions.filter((p) => user.permissions[p.key]).map((p) => <span key={p.key} className="px-2 py-0.5 bg-secondary/10 text-secondary rounded text-[10px] font-bold uppercase tracking-widest">{p.label}</span>)}
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20 gap-2">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${user.status === "active" ? "bg-secondary/10 text-secondary" : "bg-surface-container-high text-on-surface-variant"}`}>{user.status === "active" ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}{user.status === "active" ? "Active" : "Inactive"}</span>
              <div className="flex gap-2">
                <button onClick={() => openAccess(user)} className="px-3 py-1.5 bg-surface-container-low text-primary rounded-lg text-xs font-semibold">Access</button>
                <button onClick={() => toggleStatus(user)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${user.status === "active" ? "bg-destructive/10 text-destructive hover:bg-destructive/20" : "bg-secondary/10 text-secondary hover:bg-secondary/20"}`}>{user.status === "active" ? "Deactivate" : "Activate"}</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="sm:max-w-xl" aria-describedby="add-user-description">
          <DialogHeader><DialogTitle>Add User</DialogTitle><DialogDescription id="add-user-description">Create a login and choose the user-side features this person can access.</DialogDescription></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Full name" className="px-3 py-2 bg-surface-container-low border-0 rounded-lg" />
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" type="email" className="px-3 py-2 bg-surface-container-low border-0 rounded-lg" />
              <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Temporary password" type="password" className="px-3 py-2 bg-surface-container-low border-0 rounded-lg" />
              <input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="Department" className="px-3 py-2 bg-surface-container-low border-0 rounded-lg" />
            </div>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as "user" | "admin" })} className="w-full px-3 py-2 bg-surface-container-low border-0 rounded-lg"><option value="user">User</option><option value="admin">Admin</option></select>
            {permissionsForm}
          </div>
          <div className="flex justify-end gap-2"><button onClick={() => setShowAdd(false)} className="px-4 py-2 bg-surface-container-high text-primary rounded-lg font-semibold text-sm">Cancel</button><button onClick={handleAdd} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold text-sm flex items-center gap-2"><Plus className="w-3 h-3" /> Create</button></div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="sm:max-w-lg" aria-describedby="edit-access-description">
          <DialogHeader><DialogTitle>Access Control</DialogTitle><DialogDescription id="edit-access-description">Adjust role and user-side feature permissions.</DialogDescription></DialogHeader>
          <div className="space-y-4 py-2">
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as "user" | "admin" })} className="w-full px-3 py-2 bg-surface-container-low border-0 rounded-lg"><option value="user">User</option><option value="admin">Admin</option></select>
            {permissionsForm}
          </div>
          <div className="flex justify-end gap-2"><button onClick={() => setEditingUser(null)} className="px-4 py-2 bg-surface-container-high text-primary rounded-lg font-semibold text-sm">Cancel</button><button onClick={handleSaveAccess} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold text-sm flex items-center gap-2"><Save className="w-3 h-3" /> Save Access</button></div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
