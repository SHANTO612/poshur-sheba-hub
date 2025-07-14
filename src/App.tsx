
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/layout/Navbar";
import Index from "./pages/public/Index";
import Market from "./pages/public/Market";
import MeatShop from "./pages/public/MeatShop";
import Farmers from "./pages/public/Farmers";
import Dairy from "./pages/public/Dairy";
import Vet from "./pages/public/Vet";
import VetContact from "./pages/public/VetContact";
import Feed from "./pages/public/Feed";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Admin from "./pages/admin/Admin";
import News from "./pages/public/News";
import Contact from "./pages/public/Contact";
import NotFound from "./pages/public/NotFound";
import Premium from "./pages/public/premium";
import Dashboard from "./pages/dashboard/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <BrowserRouter>
              <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50">
                <Navbar />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/market" element={<Market />} />
                  <Route path="/meat-shop" element={<MeatShop />} />
                  <Route path="/farmers" element={<Farmers />} />
                  <Route path="/dairy" element={<Dairy />} />
                  <Route path="/vet" element={<Vet />} />
                  <Route path="/vet-contact" element={<VetContact />} />
                  <Route path="/premium" element={<Premium />} />
                  <Route path="/feed" element={<Feed />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
