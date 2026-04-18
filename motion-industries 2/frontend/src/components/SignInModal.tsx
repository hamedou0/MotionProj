'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveSession } from '../lib/auth';

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

interface SignInModalProps {
  open: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
}

const focusableSelector =
  'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])';

export default function SignInModal({ open, onClose, onSwitchToSignUp }: SignInModalProps) {
  const router = useRouter();
  const [form, setForm] = useState<SignInForm>({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
      if (event.key === 'Tab') {
        const modal = modalRef.current;
        if (!modal) return;
        const focusable = Array.from(modal.querySelectorAll<HTMLElement>(focusableSelector));
        if (focusable.length === 0) return;
        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open && modalRef.current) {
      const input = modalRef.current.querySelector<HTMLInputElement>('input[name="email"]');
      input?.focus();
    }
  }, [open]);

  const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
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
        onClose();
        window.location.reload();
      }
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8"
      onClick={handleOutsideClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby="signin-modal-title"
    >
      <div
        ref={modalRef}
        className="max-w-md w-full transform overflow-hidden rounded-3xl bg-white p-6 shadow-2xl transition duration-300 ease-out md:p-8"
        style={{ animation: 'fadeInScale 180ms ease-out' }}
      >
        <h2 id="signin-modal-title" className="text-2xl font-semibold text-gray-900 mb-2">
          Sign in to Motion Industries
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Use your email and password to sign in.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-5">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@company.com"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl px-4 py-3 text-sm font-semibold transition"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-5 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => {
                onClose();
                onSwitchToSignUp();
              }}
              className="text-teal-600 hover:text-teal-700 font-semibold"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
      <style>{`@keyframes fadeInScale { from { opacity: 0; transform: translateY(10px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }`}</style>
    </div>
  );
}
