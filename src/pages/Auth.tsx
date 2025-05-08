
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  // If user is already logged in, redirect to home
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setIsSubmitting(true);
      await signIn(email, password);
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setIsSubmitting(true);
      await signUp(email, password);
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-earth-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center space-x-2 mb-8">
            <span className="h-10 w-10 rounded-full bg-leaf-600 flex items-center justify-center">
              <span className="text-white font-heading font-bold text-lg">OG</span>
            </span>
            <span className="font-heading font-bold text-2xl">OrganicGrocer</span>
          </a>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome to OrganicGrocer</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one to shop for fresh, organic produce
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Create Account</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-1">
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-leaf-600 hover:bg-leaf-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <label htmlFor="signup-email" className="block text-sm font-medium mb-1">
                      Email Address
                    </label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="signup-password" className="block text-sm font-medium mb-1">
                      Password
                    </label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Password must be at least 6 characters
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-leaf-600 hover:bg-leaf-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 items-center text-sm text-earth-700">
            <div>
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </div>
            <div>
              <a href="/" className="text-leaf-600 hover:underline">
                Back to home page
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
