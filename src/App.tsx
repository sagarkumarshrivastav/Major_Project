
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import LostItems from "./pages/items/LostItems";
import FoundItems from "./pages/items/FoundItems";
import ReportLost from "./pages/items/ReportLost";
import ReportFound from "./pages/items/ReportFound";
import Dashboard from "./pages/Dashboard";
import ItemDetail from "./pages/items/ItemDetail";

// Context providers
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/lost-items" element={<LostItems />} />
            <Route path="/found-items" element={<FoundItems />} />
            <Route path="/report-lost" element={<ReportLost />} />
            <Route path="/report-found" element={<ReportFound />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/item/:id" element={<ItemDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
