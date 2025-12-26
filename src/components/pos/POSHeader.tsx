import { LogOut, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface POSHeaderProps {
  userName: string;
  onLogout: () => void;
}

export const POSHeader = ({ userName, onLogout }: POSHeaderProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  return (
    <header className="gradient-header text-pos-header-foreground px-6 py-4 shadow-pos-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">KasirKu</h1>
            <p className="text-sm opacity-80">Point of Sale System</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden md:block">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Clock className="w-5 h-5 opacity-80" />
              {formatTime(currentTime)}
            </div>
            <p className="text-sm opacity-80">{formatDate(currentTime)}</p>
          </div>

          <div className="flex items-center gap-3 pl-6 border-l border-pos-header-foreground/20">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <p className="font-medium">{userName}</p>
              <p className="text-xs opacity-80">Kasir</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="text-pos-header-foreground hover:bg-pos-header-foreground/10"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
