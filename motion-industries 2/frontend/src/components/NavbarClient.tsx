'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import SignInModal from './SignInModal';
import SignUpModal from './SignUpModal';
import { getUser, logout, SessionUser } from '../lib/auth';

export default function NavbarClient() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);

  useEffect(() => {
    setUser(getUser());
    const handleStorage = () => setUser(getUser());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <>
      <nav className="bg-gray-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="text-xl font-bold hover:text-teal-300">
          Motion Industries
        </Link>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Link href="/search" className="hover:text-teal-400">
            Products
          </Link>
          {user ? (
            <>
              <Link href="/settings" className="hover:text-teal-400">
                Settings
              </Link>
              <span className="text-teal-300">Hi, {user.firstName}</span>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setSignInModalOpen(true)}
                className="rounded-lg bg-teal-600 px-4 py-2 text-white transition hover:bg-teal-700"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setSignUpModalOpen(true)}
                className="rounded-lg bg-gray-700 px-4 py-2 text-white transition hover:bg-gray-800"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>
      <SignInModal
        open={signInModalOpen}
        onClose={() => setSignInModalOpen(false)}
        onSwitchToSignUp={() => {
          setSignInModalOpen(false);
          setSignUpModalOpen(true);
        }}
      />
      <SignUpModal
        open={signUpModalOpen}
        onClose={() => setSignUpModalOpen(false)}
        onSwitchToSignIn={() => {
          setSignUpModalOpen(false);
          setSignInModalOpen(true);
        }}
      />
    </>
  );
}
