import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";

import Index from "@/pages/Index";
import Ranking from "@/pages/Ranking";
import NotFound from "@/pages/NotFound";
import Login from "./pages/Login";
import RequireAuth from "@/components/RequireAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <Routes>
        {/* pública */}
        <Route path="/login" element={<Login />} />

        {/* protegidas */}
        <Route path="/" element={<RequireAuth />}>
          <Route index element={<Index />} />
          <Route path="ranking" element={<Ranking />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
