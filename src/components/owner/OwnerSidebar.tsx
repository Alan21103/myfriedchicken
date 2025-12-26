import { useLocation, useNavigate } from "react-router-dom";
import { ChefHat, Grid3X3, Tag, Receipt, TrendingUp, BarChart3, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const menuItems = [
  { id: "kelola-menu", label: "Kelola Menu", icon: ChefHat, path: "/owner/menu" },
  { id: "kelola-kategori", label: "Kelola Kategori", icon: Grid3X3, path: "/owner/kategori" },
  { id: "kelola-predikat", label: "Kelola Predikat", icon: Tag, path: "/owner/predikat" },
  { id: "kelola-pajak", label: "Kelola Pajak & Service Fee", icon: Receipt, path: "/owner/pajak" },
];

const reportItems = [
  { id: "progress-keuntungan", label: "Progress Keuntungan", icon: TrendingUp, path: "/owner/keuntungan" },
  { id: "tren-menu", label: "Tren Menu", icon: BarChart3, path: "/owner/tren" },
];

export const OwnerSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <div className="w-6 h-6 bg-muted-foreground/30 rounded-md" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">My Fried Chiken</h1>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="flex-1 p-4">
        <div className="mb-6">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-3">
            Main Menu
          </p>
          <div className="space-y-1">
            <div className="px-3 py-2 rounded-lg bg-secondary/50">
              <span className="text-sm font-medium text-foreground">Menu</span>
            </div>
            <nav className="ml-3 space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                      isActive
                        ? "bg-secondary text-foreground font-medium"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Reports Section */}
        <div className="space-y-1">
          {reportItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-secondary text-foreground font-medium"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* User Section - Bottom */}
      <div className="p-4 border-t border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                  {user?.name?.charAt(0) || "O"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-foreground">{user?.name || "Owner"}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
};
