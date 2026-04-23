'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearSession, getToken, getUser, saveSession, SessionUser } from '../../lib/auth';

interface ProfileForm {
  firstName: string;
  lastName: string;
  avatarUrl: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ApiResponse {
  message?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  avatarUrl?: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'danger'>('profile');
  const [profileForm, setProfileForm] = useState<ProfileForm>({ firstName: '', lastName: '', avatarUrl: '' });
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    const storedUser = getUser();
    if (!storedUser) {
      router.push('/');
      return;
    }
    setUser(storedUser);
    setProfileForm({
      firstName: storedUser.firstName,
      lastName: storedUser.lastName,
      avatarUrl: storedUser.avatarUrl || '',
    });
    setAuthorized(true);
  }, [router]);

  const token = getToken();

  const clearAlerts = () => {
    setMessage('');
    setError('');
  };

  const handleProfileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm({ ...profileForm, [event.target.name]: event.target.value });
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [event.target.name]: event.target.value });
  };

  const updateLocalUser = (updated: Partial<SessionUser>) => {
    if (!user || !token) return;
    const nextUser = { ...user, ...updated };
    saveSession(token, nextUser);
    setUser(nextUser);
  };

  const handleSaveProfile = async () => {
    clearAlerts();
    if (!token) {
      setError('You are not authenticated.');
      return;
    }
    if (!profileForm.firstName || !profileForm.lastName) {
      setError('Please provide a first and last name.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileForm),
      });
      const data: ApiResponse = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to update profile.');
      } else {
        updateLocalUser({
          firstName: data.firstName || profileForm.firstName,
          lastName: data.lastName || profileForm.lastName,
          avatarUrl: data.avatarUrl || profileForm.avatarUrl,
        });
        setMessage('Profile updated successfully.');
      }
    } catch {
      setError('Unable to save your profile right now.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    clearAlerts();
    if (!token) {
      setError('You are not authenticated.');
      return;
    }
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setError('Please complete all password fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordForm),
      });
      const data: ApiResponse = await res.json();
      if (!res.ok) {
        setError(data.message || 'Password change failed.');
      } else {
        setMessage(data.message || 'Password updated successfully.');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch {
      setError('Unable to change password right now.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    clearAlerts();
    if (!token) {
      setError('You are not authenticated.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/user/delete-account', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data: ApiResponse = await res.json();
      if (!res.ok) {
        setError(data.message || 'Could not delete account.');
      } else {
        clearSession();
        router.push('/');
      }
    } catch {
      setError('Unable to delete account right now.');
    } finally {
      setLoading(false);
      setDeleteOpen(false);
    }
  };

  if (!authorized) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-200 text-center">
          <p className="text-gray-600">Checking your session. Redirecting if not signed in…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto flex w-full max-w-6xl gap-8 px-6">
        <aside className="w-full max-w-xs rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account settings</h2>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left rounded-2xl px-4 py-3 text-sm font-medium ${
                activeTab === 'profile' ? 'bg-teal-50 text-teal-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Profile
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('account')}
              className={`w-full text-left rounded-2xl px-4 py-3 text-sm font-medium ${
                activeTab === 'account' ? 'bg-teal-50 text-teal-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Account
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('danger')}
              className={`w-full text-left rounded-2xl px-4 py-3 text-sm font-medium ${
                activeTab === 'danger' ? 'bg-red-50 text-red-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Danger zone
            </button>
          </div>
        </aside>

        <section className="flex-1 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-teal-600 uppercase tracking-[0.2em]">Settings</p>
              <h1 className="text-2xl font-semibold text-gray-900">Manage your account</h1>
            </div>
            {message && (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
                {message}
              </div>
            )}
            {error && (
              <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Profile Settings</h2>
                <p className="text-sm text-gray-500">Update your display name, avatar, and profile details.</p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First name</label>
                  <input
                    name="firstName"
                    value={profileForm.firstName}
                    onChange={handleProfileChange}
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last name</label>
                  <input
                    name="lastName"
                    value={profileForm.lastName}
                    onChange={handleProfileChange}
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                  <input
                    readOnly
                    value={user?.email ?? ''}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Avatar URL</label>
                  <input
                    name="avatarUrl"
                    value={profileForm.avatarUrl}
                    onChange={handleProfileChange}
                    placeholder="https://example.com/avatar.png"
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-500">Your profile picture is stored as a URL and will be used across the app.</p>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-2xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save profile'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Account Settings</h2>
                <p className="text-sm text-gray-500">Change your password or review how you sign in.</p>
              </div>

              <div className="space-y-4 rounded-3xl border border-gray-200 bg-gray-50 p-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current password</label>
                  <input
                    name="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New password</label>
                  <input
                    name="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm new password</label>
                  <input
                    name="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleChangePassword}
                disabled={loading}
                className="rounded-2xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
              >
                {loading ? 'Updating password...' : 'Update password'}
              </button>
            </div>
          )}

          {activeTab === 'danger' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Danger zone</h2>
                <p className="text-sm text-gray-500">Delete your account and all related profile data. This action cannot be undone.</p>
              </div>

              <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
                <p className="text-sm text-red-700 mb-4">
                  Deleting your account is permanent and removes your access to Motion Industries.
                </p>
                <button
                  type="button"
                  onClick={() => setDeleteOpen(true)}
                  className="rounded-2xl bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Delete account
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {deleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
          <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Confirm account deletion</h2>
            <p className="text-sm text-gray-600 mb-6">
              This cannot be undone. If you proceed, your account will be permanently deleted.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteOpen(false)}
                className="rounded-2xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={loading}
                className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
