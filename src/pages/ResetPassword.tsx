import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ArrowRight, DoorOpen } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 8) {
      toast.error("Use at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Password updated. Please sign in again.");
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <header className="mb-10 flex flex-col items-center">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg mb-3">
          <DoorOpen className="w-5 h-5 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tighter text-primary">Reset Password</h1>
      </header>

      <main className="w-full max-w-[420px] bg-surface-container-lowest rounded-3xl p-8 shadow-elegant">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="block w-full pl-11 pr-4 py-4 bg-surface-container-low border-0 rounded-2xl text-foreground focus:ring-2 focus:ring-secondary/40" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="block w-full px-4 py-4 bg-surface-container-low border-0 rounded-2xl text-foreground focus:ring-2 focus:ring-secondary/40" />
          </div>
          <button type="submit" disabled={saving} className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
            {saving ? "Saving..." : "Save New Password"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </main>
    </div>
  );
};

export default ResetPassword;
