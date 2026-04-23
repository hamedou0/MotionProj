'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { saveSession } from '../../lib/auth';

interface SignInForm {
  email: string;
  password: string;
}

interface AuthResponse {
  token?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  message?: string;
}

export default function SignInPage() {
  const router = useRouter();

  const [form, setForm] = useState<SignInForm>({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setError('');

    if (!form.email || !form.password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data: AuthResponse = await res.json();

      if (!res.ok) {
        setError(data.message || 'Sign in failed');
      } else {
        saveSession(data.token || '', {
          email: data.email || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          role: data.role || '',
        });
        router.push('/');
      }
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F5F5] flex items-center justify-center text-[#333333]">
      <div className="bg-white rounded-xl shadow-sm border border-[#E5E5E5] p-8 w-full max-w-md">
        <div className="text-center mb-8 -mx-8 -mt-8 px-8 py-6 bg-[#222222] text-white rounded-t-xl border-b border-[#D62828]/70">
          <h1 className="text-2xl font-bold text-white">Motion Industries</h1>
          <p className="text-gray-200 text-sm mt-1">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-[#D62828] rounded-lg px-4 py-3 text-sm mb-5">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@company.com"
              className="w-full border border-[#BDBDBD] rounded-lg px-3 py-2 text-sm bg-white text-[#333333]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full border border-[#BDBDBD] rounded-lg px-3 py-2 text-sm bg-white text-[#333333]"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#0C6CD4] hover:bg-[#0a5bb2] disabled:opacity-50 text-white py-2.5 rounded-lg font-medium text-sm"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>

        <p className="text-center text-sm text-[#666666] mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-[#0C6CD4] hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}