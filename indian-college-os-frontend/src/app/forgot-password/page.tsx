'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authApi.forgotPassword(email);
            setSent(true);
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
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
                        {sent ? (
                            <div className="text-center py-4">
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-6 h-6 text-success-600" />
                                </div>
                                <h1 className="text-xl font-semibold text-neutral-900 mb-2">
                                    Check your email
                                </h1>
                                <p className="text-sm text-neutral-600 mb-6">
                                    If an account exists for <strong>{email}</strong>,
                                    you'll receive a password reset link shortly.
                                </p>
                                <Link href="/login" className="btn btn-primary w-full">
                                    Back to Sign In
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="text-center mb-6">
                                    <h1 className="text-xl font-semibold text-neutral-900">
                                        Forgot your password?
                                    </h1>
                                    <p className="text-sm text-neutral-600 mt-1">
                                        Enter your email and we'll send you a reset link.
                                    </p>
                                </div>

                                {error && (
                                    <div className="alert alert-error mb-4">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="input-label">Email Address</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="input-field"
                                            placeholder="you@example.com"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn btn-primary w-full"
                                    >
                                        {loading ? <div className="spinner"></div> : 'Send Reset Link'}
                                    </button>
                                </form>

                                <p className="text-center mt-6 text-sm text-neutral-600">
                                    <Link href="/login" className="text-primary-500 hover:underline inline-flex items-center gap-1">
                                        <ArrowLeft className="w-4 h-4" />
                                        Back to Sign In
                                    </Link>
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
