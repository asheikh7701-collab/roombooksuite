import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight, DoorOpen } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";

const UserLogin = () => {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = isLogin
      ? await signIn(email, password, "user")
      : await signUp({ email, password, name, role: "user" });

    if (result.error) {
      toast.error(result.error);
      return;
    }

    if (result.message) {
      toast.success(result.message);
      setIsLogin(true);
      return;
    }

    navigate("/user/dashboard");
  };

  const handleGoogle = async () => {
    const result = await signInWithGoogle("user");
    if (result.error) toast.error(result.error);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <header className="mb-12 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
            <DoorOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-2xl font-extrabold tracking-tighter text-primary">RoomBook</span>
        </div>
        <p className="text-on-surface-variant font-medium tracking-tight">Welcome back. Access your workspace.</p>
      </header>
      <main className="w-full max-w-[440px]">
        <div className="bg-surface-container-lowest rounded-3xl p-2 shadow-elegant overflow-hidden">
          <nav className="flex p-1 bg-surface-container-low rounded-[1.75rem] mb-6">
            <button onClick={() => setIsLogin(true)} className={`flex-1 py-3 text-sm font-semibold rounded-full transition-all duration-200 ${isLogin ? "text-secondary bg-surface-container-lowest shadow-sm" : "text-on-surface-variant"}`}>Login</button>
            <button onClick={() => setIsLogin(false)} className={`flex-1 py-3 text-sm font-semibold rounded-full transition-all duration-200 ${!isLogin ? "text-secondary bg-surface-container-lowest shadow-sm" : "text-on-surface-variant"}`}>Sign Up</button>
          </nav>
          <div className="px-8 pb-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant px-1">Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="block w-full px-4 py-4 bg-surface-container-low border-0 rounded-2xl text-foreground placeholder:text-outline focus:ring-2 focus:ring-secondary/40 transition-all" />
                </div>
              )}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant px-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" required className="block w-full pl-11 pr-4 py-4 bg-surface-container-low border-0 rounded-2xl text-foreground placeholder:text-outline focus:ring-2 focus:ring-secondary/40 transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Password</label>
                  {isLogin && <button type="button" className="text-xs font-semibold text-secondary hover:underline">Forgot Password?</button>}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="block w-full pl-11 pr-12 py-4 bg-surface-container-low border-0 rounded-2xl text-foreground placeholder:text-outline focus:ring-2 focus:ring-secondary/40 transition-all" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {isLogin && (
                <div className="flex items-center space-x-3 px-1">
                  <input type="checkbox" id="remember" className="h-5 w-5 rounded border-outline-variant bg-surface-container-low text-secondary focus:ring-secondary focus:ring-offset-0" />
                  <label htmlFor="remember" className="text-sm font-medium text-on-surface-variant">Remember me</label>
                </div>
              )}
              <button type="submit" className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2">
                <span>{isLogin ? "Sign In to Workspace" : "Create Account"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button type="button" onClick={handleGoogle} className="w-full py-4 bg-surface-container-low text-primary font-bold rounded-2xl hover:bg-surface-container-high transition-all duration-200 flex items-center justify-center gap-2">
                Continue with Google
              </button>
            </form>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Link to="/admin/login" className="text-xs font-semibold text-on-surface-variant hover:text-secondary transition-colors">Admin? Sign in here →</Link>
        </div>
      </main>
    </div>
  );
};

export default UserLogin;
