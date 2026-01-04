'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import { Lock, CheckCircle, XCircle } from 'lucide-react';

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) {
            setError('Invalid reset link. Please request a new password reset.');
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await authApi.resetPassword(token!, password);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Failed to reset password. The link may have expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col">
            {/* Header */}
            <header className="h-16 bg-white border-b border-neutral-200">
                <div className="container-narrow h-full flex items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-primary-500 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">CO</span>
                        </div>
                        <span className="font-semibold text-neutral-900">College OS</span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-sm">
                    <div className="card">
                        {success ? (
                            <div className="text-center py-4">
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-6 h-6 text-success-600" />
                                </div>
                                <h1 className="text-xl font-semibold text-neutral-900 mb-2">
                                    Password Reset Successful
                                </h1>
                                <p className="text-sm text-neutral-600 mb-6">
                                    Your password has been updated. You can now sign in with your new password.
                                </p>
                                <Link href="/login" className="btn btn-primary w-full">
                                    Sign In
                                </Link>
                            </div>
                        ) : !token ? (
                            <div className="text-center py-4">
                                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                                    <XCircle className="w-6 h-6 text-error-500" />
                                </div>
                                <h1 className="text-xl font-semibold text-neutral-900 mb-2">
                                    Invalid Link
                                </h1>
                                <p className="text-sm text-neutral-600 mb-6">
                                    This password reset link is invalid. Please request a new one.
                                </p>
                                <Link href="/forgot-password" className="btn btn-primary w-full">
                                    Request New Link
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="text-center mb-6">
                                    <Lock className="w-10 h-10 text-primary-500 mx-auto mb-3" />
                                    <h1 className="text-xl font-semibold text-neutral-900">
                                        Create new password
                                    </h1>
                                    <p className="text-sm text-neutral-600 mt-1">
                                        Enter your new password below.
                                    </p>
                                </div>

                                {error && (
                                    <div className="alert alert-error mb-4">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="input-label">New Password</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="input-field"
                                            placeholder="Minimum 6 characters"
                                        />
                                    </div>

                                    <div>
                                        <label className="input-label">Confirm Password</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            className="input-field"
                                            placeholder="Re-enter your password"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn btn-primary w-full"
                                    >
                                        {loading ? <div className="spinner"></div> : 'Reset Password'}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                <div className="spinner-lg"></div>
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}
