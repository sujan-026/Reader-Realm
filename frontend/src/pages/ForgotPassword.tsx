
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';

const ForgotPassword = () => {
  const { resetPassword, isLoading } = useUser();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await resetPassword(email);
    if (success) {
      setSubmitted(true);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto pt-10 pb-20">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
          <p className="text-muted-foreground">We'll send you a link to reset your password</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm animate-fade-in" style={{ animationDelay: '100ms' }}>
          {submitted ? (
            <div className="text-center py-4">
              <Mail className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-medium mb-2">Check your email</h3>
              <p className="text-muted-foreground mb-4">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <Link to="/login" className="inline-flex items-center text-primary hover:underline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="mr-2 h-4 w-4" />
                )}
                Send Reset Link
              </Button>

              <div className="text-center mt-4">
                <Link to="/login" className="text-sm text-primary hover:underline">
                  <ArrowLeft className="inline-block mr-1 h-3 w-3" />
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
