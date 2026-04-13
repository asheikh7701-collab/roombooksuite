import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import UserLogin from "./pages/UserLogin";
import AdminLogin from "./pages/AdminLogin";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import UserDashboard from "./pages/user/Dashboard";
import BookRoom from "./pages/user/BookRoom";
import UserReservations from "./pages/user/Reservations";
import UserProfile from "./pages/user/Profile";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminInventory from "./pages/admin/Inventory";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminReservations from "./pages/admin/Reservations";
import AdminUsers from "./pages/admin/Users";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner position="top-right" richColors closeButton />
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<UserLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/user" element={<UserLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="book" element={<BookRoom />} />
              <Route path="reservations" element={<UserReservations />} />
              <Route path="profile" element={<UserProfile />} />
            </Route>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="inventory" element={<AdminInventory />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="reservations" element={<AdminReservations />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
