import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastProvider } from "@/components/ui/toast-notification";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Editor from "./pages/Editor";
import { PublicResume } from "./pages/PublicResume";
import PrintPreview from "./pages/PrintPreview";
import NotFound from "./pages/NotFound";
import TemplatesPage from "./pages/TemplatesPage";

import ProtectedRoute from "./components/ProtectedRoute";

import { HelmetProvider } from 'react-helmet-async';
import { RoleLandingPage } from './pages/RoleLandingPage';
import { BlogIndex } from './pages/BlogIndex';
import { BlogPost } from './pages/BlogPost';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ToastProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/resume-templates/:role" element={<RoleLandingPage />} />
              <Route path="/blog" element={<BlogIndex />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/p/:idOrSlug" element={<PublicResume />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/editor" element={<Editor />} />
              <Route path="/preview/:id" element={<PrintPreview />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
