import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth, UserRole } from "@/contexts/AuthContext";
import Login from "./pages/Login";
import POS from "./src/pages/POS";
import NotFound from "./src/pages/NotFound";
import OwnerMenu from "./src/pages/owner/OwnerMenu";
import OwnerKategori from "./src/pages/owner/OwnerKategori";
import OwnerPredikat from "./src/pages/owner/OwnerPredikat";
import OwnerPajak from "./src/pages/owner/OwnerPajak";
import OwnerKeuntungan from "./src/pages/owner/OwnerKeuntungan";
import OwnerTren from "./src/pages/owner/OwnerTren";
import KitchenPesanan from "./src/pages/kitchen/KitchenPesanan";
import KitchenStok from "./src/pages/kitchen/KitchenStok";

const queryClient = new QueryClient();

const getDefaultRoute = (role: UserRole) => {
  switch (role) {
    case "owner": return "/owner/menu";
    case "kasir": return "/pos";
    case "dapur": return "/kitchen/pesanan";
    default: return "/";
  }
};

const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode; allowedRole?: UserRole }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={getDefaultRoute(user.role)} replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/pos" element={<ProtectedRoute allowedRole="kasir"><POS /></ProtectedRoute>} />
      <Route path="/owner/menu" element={<ProtectedRoute allowedRole="owner"><OwnerMenu /></ProtectedRoute>} />
      <Route path="/owner/kategori" element={<ProtectedRoute allowedRole="owner"><OwnerKategori /></ProtectedRoute>} />
      <Route path="/owner/predikat" element={<ProtectedRoute allowedRole="owner"><OwnerPredikat /></ProtectedRoute>} />
      <Route path="/owner/pajak" element={<ProtectedRoute allowedRole="owner"><OwnerPajak /></ProtectedRoute>} />
      <Route path="/owner/keuntungan" element={<ProtectedRoute allowedRole="owner"><OwnerKeuntungan /></ProtectedRoute>} />
      <Route path="/owner/tren" element={<ProtectedRoute allowedRole="owner"><OwnerTren /></ProtectedRoute>} />
      <Route path="/kitchen/pesanan" element={<ProtectedRoute allowedRole="dapur"><KitchenPesanan /></ProtectedRoute>} />
      <Route path="/kitchen/stok" element={<ProtectedRoute allowedRole="dapur"><KitchenStok /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;