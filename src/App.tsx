
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Features from "./pages/Features";
import Documentation from "./pages/Documentation";
import Auth from "./pages/Auth";
import ThreatIntel from "./pages/ThreatIntel";
import Simulator from "./pages/Simulator";
import Dashboard from "./pages/Dashboard";
import Statistics from "./pages/Statistics";
import NotFound from "./pages/NotFound";
import FeedbackButton from "./components/FeedbackButton";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" richColors closeButton />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/features" element={<Features />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/threat-intel" element={<ProtectedRoute><ThreatIntel /></ProtectedRoute>} />
          <Route path="/simulator" element={<ProtectedRoute><Simulator /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/statistics" element={<ProtectedRoute><Statistics /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <FeedbackButton />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
