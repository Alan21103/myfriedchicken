import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Eye, EyeOff, Lock, User, Coffee } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { Label } from "../components/label";
import { Input } from "../components/input";
import { Button } from "../components/button";


const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error("Username dan password harus diisi");
      return;
    }

    setIsLoading(true);

    const result = await login(username, password);

    if (result.success) {
      toast.success("Login berhasil!");
      // Redirect based on role
      const savedUser = localStorage.getItem("pos_user");
      if (savedUser) {
        const user = JSON.parse(savedUser);
        if (user.role === "owner") {
          navigate("/owner/menu");
        } else {
          navigate("/pos");
        }
      }
    } else {
      toast.error(result.error || "Login gagal");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-header relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-accent blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-primary blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-pos-header-foreground">
          <div className="w-24 h-24 rounded-2xl gradient-primary flex items-center justify-center mb-8 shadow-pos-xl animate-bounce-soft">
            <Coffee className="w-12 h-12" />
          </div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight">KasirKu</h1>
          <p className="text-xl opacity-90 text-center max-w-md">
            Sistem Point of Sale modern untuk bisnis Anda
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold">1000+</p>
              <p className="text-sm opacity-80">Transaksi/Hari</p>
            </div>
            <div>
              <p className="text-3xl font-bold">99%</p>
              <p className="text-sm opacity-80">Uptime</p>
            </div>
            <div>
              <p className="text-3xl font-bold">24/7</p>
              <p className="text-sm opacity-80">Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
              <Coffee className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">KasirKu</h1>
          </div>

          <div className="bg-card rounded-2xl p-8 shadow-pos-lg border border-border">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground">Selamat Datang</h2>
              <p className="text-muted-foreground mt-2">
                Masuk untuk memulai
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Masukkan username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 h-12 bg-background border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 bg-background border-border"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-base font-semibold gradient-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Memvalidasi...
                  </div>
                ) : (
                  "Masuk"
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 rounded-lg bg-muted space-y-2">
              <p className="text-sm text-muted-foreground text-center font-medium">Demo Accounts:</p>
              <p className="text-sm text-muted-foreground text-center">
                <span className="font-medium">Owner:</span> username:{" "}
                <code className="bg-background px-1 rounded">owner</code>, password:{" "}
                <code className="bg-background px-1 rounded">123456</code>
              </p>
              <p className="text-sm text-muted-foreground text-center">
                <span className="font-medium">Kasir:</span> username:{" "}
                <code className="bg-background px-1 rounded">kasir</code>, password:{" "}
                <code className="bg-background px-1 rounded">123456</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
