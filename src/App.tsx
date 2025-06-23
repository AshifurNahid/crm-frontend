
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Index from "./pages/Index";
import TerritoryPage from "./pages/TerritoryPage";
import TerritoryCreate from "./pages/TerritoryCreate";
import LeadCreate from "./pages/LeadCreate";
import LeadEdit from "./pages/LeadEdit";
import OpportunityCreate from "./pages/OpportunityCreate";
import CustomerGroupCreate from "./pages/CustomerGroupCreate";
import CustomerCreate from "./pages/CustomerCreate";
import CustomerEdit from "./pages/CustomerEdit";
import ContactEdit from "./pages/ContactEdit";
import CustomerProfileEdit from "./pages/CustomerProfileEdit";
import InventoryEdit from "./pages/InventoryEdit";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/territory/create" element={<TerritoryCreate />} />
            <Route path="/lead/create" element={<LeadCreate />} />
            <Route path="/leads/:id/edit" element={<LeadEdit />} />
            <Route path="/opportunity/create" element={<OpportunityCreate />} />
            <Route path="/opportunities/:id/edit" element={<OpportunityCreate />} />
            <Route path="/customer-group/create" element={<CustomerGroupCreate />} />
            <Route path="/customer/create" element={<CustomerCreate />} />
            <Route path="/customers/:id/edit" element={<CustomerEdit />} />
            <Route path="/contacts/:id/edit" element={<ContactEdit />} />
            <Route path="/customer-profile/:id/edit" element={<CustomerProfileEdit />} />
            <Route path="/inventory/:id/edit" element={<InventoryEdit />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
