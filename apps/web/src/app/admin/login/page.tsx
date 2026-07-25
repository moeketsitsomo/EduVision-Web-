'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'forgot' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [schoolSlug, setSchoolSlug] = useState('demo-school');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, schoolSlug, totpCode }),
      });
      const data = (await res.json()) as { access_token?: string; requiresTwoFactor?: boolean; userId?: string; message?: string };
      if (!res.ok) throw new Error(data.message || 'Login failed');
      if (data.requiresTwoFactor) {
        setRequiresTwoFactor(true);
        setSubmitting(false);
        return;
      }
      if (!data.access_token) throw new Error('Login failed');
      localStorage.setItem('eduvision_token', data.access_token);
      toast.success('Welcome back');
      router.push('/admin');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, schoolSlug }),
      });
      const data = (await res.json()) as { message?: string };
      if (!res.ok) throw new Error(data.message || 'Request failed');
      toast.success(data.message || 'Reset email sent');
      setMode('login');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, newPassword }),
      });
      const data = (await res.json()) as { message?: string };
      if (!res.ok) throw new Error(data.message || 'Reset failed');
      toast.success('Password reset. Please sign in.');
      setMode('login');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Reset failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted">
      <Card className="w-full max-w-md">
        {mode === 'login' && (
          <form onSubmit={handleLogin}>
            <CardHeader>
              <CardTitle>School Admin Login</CardTitle>
              <CardDescription>
                Enter your credentials to manage your school website.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="schoolSlug">School Slug</Label>
                <Input
                  id="schoolSlug"
                  value={schoolSlug}
                  onChange={(e) => setSchoolSlug(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {requiresTwoFactor && (
                <div className="space-y-2">
                  <Label htmlFor="totpCode">Two-Factor Code</Label>
                  <Input
                    id="totpCode"
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value)}
                    required={requiresTwoFactor}
                    placeholder="123456"
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Signing in...' : requiresTwoFactor ? 'Verify & Sign In' : 'Sign In'}
              </Button>
              <div className="flex justify-between w-full text-sm">
                <button type="button" className="text-primary hover:underline" onClick={() => setMode('forgot')}>
                  Forgot password?
                </button>
                <button type="button" className="text-primary hover:underline" onClick={() => setMode('reset')}>
                  Reset via token
                </button>
              </div>
            </CardFooter>
          </form>
        )}

        {mode === 'forgot' && (
          <form onSubmit={handleForgot}>
            <CardHeader>
              <CardTitle>Reset Password</CardTitle>
              <CardDescription>We will email you a reset link if the account exists.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="schoolSlug">School Slug</Label>
                <Input id="schoolSlug" value={schoolSlug} onChange={(e) => setSchoolSlug(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Sending...' : 'Send Reset Link'}
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => setMode('login')}>
                Back to login
              </Button>
            </CardFooter>
          </form>
        )}

        {mode === 'reset' && (
          <form onSubmit={handleReset}>
            <CardHeader>
              <CardTitle>Reset via Token</CardTitle>
              <CardDescription>Paste the reset token from your email.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resetToken">Reset Token</Label>
                <Input id="resetToken" value={resetToken} onChange={(e) => setResetToken(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Resetting...' : 'Set New Password'}
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => setMode('login')}>
                Back to login
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
