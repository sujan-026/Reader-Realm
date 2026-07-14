import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BookProvider } from "./context/BookContext";
import { UserProvider } from "./context/UserContext";
import { ThemeProvider } from "./context/ThemeContext";

// Pages
import Index from "./pages/Index";
import Books from "./pages/Books";
import BookDetail from "./pages/BookDetail";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import BookManagement from "./pages/admin/BookManagement";
import BookEditor from "./pages/admin/BookEditor";
import ReviewManagement from "./pages/admin/ReviewManagement";
import UserManagement from "./pages/admin/UserManagement";
import ReviewEditor from "./pages/admin/ReviewEditor";
import UserEditor from "./pages/admin/UserEditor";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <UserProvider>
        <BookProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/books" element={<Books />} />
                <Route path="/books/:id" element={<BookDetail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Admin routes */}
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/books" element={<BookManagement />} />
                <Route path="/admin/books/new" element={<BookEditor />} />
                <Route path="/admin/books/edit/:id" element={<BookEditor />} />
                <Route path="/admin/reviews" element={<ReviewManagement />} />
                <Route
                  path="/admin/reviews/edit/:id"
                  element={<ReviewEditor />}
                />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/users/edit/:id" element={<UserEditor />} />
                <Route path="/admin/settings" element={<AdminSettings />} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </BookProvider>
      </UserProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
