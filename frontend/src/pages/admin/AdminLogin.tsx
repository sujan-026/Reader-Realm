
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, LogIn, Eye, EyeOff, Shield } from 'lucide-react';
import { toast } from 'sonner';

const AdminLogin = () => {
  const { login, isLoading } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if using the default admin credentials
    if (email === 'admin@example.com' && password === 'admin123') {
      const success = await login(email, password);
      if (success) {
        navigate('/admin');
      }
    } else {
      toast.error('Invalid admin credentials');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8 animate-fade-in">
          <Shield className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-3xl font-bold mb-2">Admin Access</h1>
          <p className="text-muted-foreground">Sign in to access the admin dashboard</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm animate-fade-in" style={{ animationDelay: '100ms' }}>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Admin Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-4 w-4" />
              )}
              Sign In as Admin
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
