import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { User, Mail, Building, Calendar, Save, Camera } from "lucide-react";
import { toast } from "sonner";

const UserProfile = () => {
  const { currentUser, reservations } = useApp();
  const userReservations = reservations.filter((r) => r.bookedBy === currentUser.name);

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [department, setDepartment] = useState("Product");
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [notifications, setNotifications] = useState(true);
  const [emailReminders, setEmailReminders] = useState(true);

  const handleSave = () => {
    toast.success("Profile updated", { description: "Your changes have been saved successfully." });
  };

  return (
    <div className="px-6 lg:px-8 py-8 lg:py-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold tracking-tight text-primary mb-2">My Profile</h1>
      <p className="text-on-surface-variant mb-10">Manage your account settings and preferences.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-elegant text-center">
            <div className="relative mx-auto w-24 h-24 mb-4">
              <div className="w-24 h-24 rounded-full bg-primary-container flex items-center justify-center">
                <User className="w-10 h-10 text-primary-foreground" />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h3 className="font-bold text-lg text-primary">{name}</h3>
            <p className="text-sm text-on-surface-variant">{email}</p>
            <p className="text-xs text-on-surface-variant mt-1">{department}</p>

            <div className="mt-6 pt-6 border-t border-outline-variant/20 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Total Bookings</span>
                <span className="font-bold text-primary">{userReservations.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Active</span>
                <span className="font-bold text-secondary">{userReservations.filter((r) => r.status === "confirmed").length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Member Since</span>
                <span className="font-bold text-primary">Jun 2023</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-elegant">
            <h3 className="font-bold text-primary mb-6">Personal Information</h3>
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-surface-container-low border-0 rounded-xl text-foreground focus:ring-2 focus:ring-secondary/40" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-surface-container-low border-0 rounded-xl text-foreground focus:ring-2 focus:ring-secondary/40" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Department</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                    <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-surface-container-low border-0 rounded-xl text-foreground focus:ring-2 focus:ring-secondary/40" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Phone</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 bg-surface-container-low border-0 rounded-xl text-foreground focus:ring-2 focus:ring-secondary/40" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-elegant">
            <h3 className="font-bold text-primary mb-6">Notification Preferences</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <p className="font-medium text-primary">Push Notifications</p>
                  <p className="text-xs text-on-surface-variant">Get notified about booking confirmations and reminders</p>
                </div>
                <button onClick={() => setNotifications(!notifications)} className={`relative w-12 h-7 rounded-full transition-colors ${notifications ? "bg-secondary" : "bg-surface-container-highest"}`}>
                  <span className={`absolute top-1 w-5 h-5 rounded-full bg-primary-foreground shadow transition-transform ${notifications ? "left-6" : "left-1"}`} />
                </button>
              </label>
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <p className="font-medium text-primary">Email Reminders</p>
                  <p className="text-xs text-on-surface-variant">Receive email reminders 30 minutes before meetings</p>
                </div>
                <button onClick={() => setEmailReminders(!emailReminders)} className={`relative w-12 h-7 rounded-full transition-colors ${emailReminders ? "bg-secondary" : "bg-surface-container-highest"}`}>
                  <span className={`absolute top-1 w-5 h-5 rounded-full bg-primary-foreground shadow transition-transform ${emailReminders ? "left-6" : "left-1"}`} />
                </button>
              </label>
            </div>
          </div>

          <button onClick={handleSave} className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold flex items-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
