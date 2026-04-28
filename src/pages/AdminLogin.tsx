import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn(email, password, "admin");
    if (result.error) {
      toast.error(result.error);
      return;
    }
    navigate("/admin/dashboard");
  };

  const handleCreateFirstAdmin = async () => {
    const result = await signUp({ email, password, name: email.split("@")[0] || "Admin", role: "admin" });
    if (result.error) toast.error(result.error);
    else toast.success(result.message ?? "Check your email to verify your admin account.");
  };

  const handleGoogle = async () => {
    const result = await signInWithGoogle("admin");
    if (result.error) toast.error(result.error);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-primary relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-96 h-96 bg-secondary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full">
        <header className="mb-12 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-secondary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tighter text-primary-foreground mb-1">Admin Console</h1>
          <p className="text-primary-foreground/60 font-medium tracking-tight text-sm">The Atrium Executive Suite • Management Portal</p>
        </header>

        <main className="w-full max-w-[420px]">
          <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-elegant">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant px-1">
                  Admin Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@company.com"
                    required
                    className="block w-full pl-11 pr-4 py-4 bg-surface-container-low border-0 rounded-2xl text-foreground placeholder:text-outline focus:ring-2 focus:ring-secondary/40 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant px-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="block w-full pl-11 pr-12 py-4 bg-surface-container-low border-0 rounded-2xl text-foreground placeholder:text-outline focus:ring-2 focus:ring-secondary/40 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-on-surface-variant"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>Access Admin Panel</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button type="button" onClick={handleGoogle} className="w-full py-4 bg-surface-container-low text-primary font-bold rounded-2xl hover:bg-surface-container-high transition-all duration-200">Continue with Google</button>
              <button type="button" onClick={handleCreateFirstAdmin} className="w-full text-xs font-semibold text-secondary hover:underline">Create first admin account</button>
            </form>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-xs font-semibold text-primary-foreground/50 hover:text-primary-foreground/80 transition-colors">
              ← Back to User Login
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLogin;
