
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import AuthForm from "./components/auth/AuthForm";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Features from "./pages/Features";
import Notes from "./pages/Notes";
import UploadCourses from "./pages/UploadCourses";
import Courses from "./pages/Courses";
import Schedule from "./pages/Schedule";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import PublicCourses from "./pages/PublicCourses";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Guest routes - redirect to dashboard if logged in */}
            <Route path="/" element={
              <GuestRoute>
                <Index />
              </GuestRoute>
            } />
            <Route path="/login" element={
              <GuestRoute>
                <AuthForm type="login" />
              </GuestRoute>
            } />
            <Route path="/register" element={
              <GuestRoute>
                <AuthForm type="register" />
              </GuestRoute>
            } />
            <Route path="/forgot-password" element={
              <GuestRoute>
                <ForgotPassword />
              </GuestRoute>
            } />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/features" element={<Features />} />
            
            {/* Public Course Pages - available to all users */}
            <Route path="/public-courses" element={<PublicCourses />} />
            <Route path="/upload-courses" element={<UploadCourses />} />
            <Route path="/courses" element={<Courses />} />
            
            {/* Protected routes - require authentication */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/notes" element={
              <ProtectedRoute>
                <Notes />
              </ProtectedRoute>
            } />
            <Route path="/schedule" element={
              <ProtectedRoute>
                <Schedule />
              </ProtectedRoute>
            } />
            <Route path="/messages" element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
