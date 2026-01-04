'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { authApi } from '@/lib/api';
import { Shield } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [twoFactorCode, setTwoFactorCode] = useState('');
    const [show2FA, setShow2FA] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authApi.login({
                email,
                password,
                twoFactorCode: show2FA ? twoFactorCode : undefined
            });

            if (response.twoFactorRequired) {
                setShow2FA(true);
                setLoading(false);
                return;
            }

            login(response);

            if (response.role === 'ADMIN') {
                router.push('/admin');
            } else {
                router.push('/dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.');
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
                        <div className="text-center mb-6">
                            {show2FA ? (
                                <Shield className="w-10 h-10 text-primary-500 mx-auto mb-3" />
                            ) : null}
                            <h1 className="text-xl font-semibold text-neutral-900">
                                {show2FA ? 'Two-Factor Authentication' : 'Sign in to your account'}
                            </h1>
                            <p className="text-sm text-neutral-600 mt-1">
                                {show2FA
                                    ? 'Enter the 6-digit code from your authenticator app'
                                    : 'Enter your credentials to continue'
                                }
                            </p>
                        </div>

                        {error && (
                            <div className="alert alert-error mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!show2FA ? (
                                <>
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

                                    <div>
                                        <label className="input-label">Password</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="input-field"
                                            placeholder="Enter your password"
                                        />
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <label className="input-label">Authentication Code</label>
                                    <input
                                        type="text"
                                        maxLength={6}
                                        value={twoFactorCode}
                                        onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                                        required
                                        autoFocus
                                        className="input-field text-center text-xl tracking-widest font-mono"
                                        placeholder="000000"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => { setShow2FA(false); setTwoFactorCode(''); setError(''); }}
                                        className="mt-3 text-sm text-primary-500 hover:underline w-full text-center"
                                    >
                                        ← Back to login
                                    </button>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || (show2FA && twoFactorCode.length !== 6)}
                                className="btn btn-primary w-full"
                            >
                                {loading ? <div className="spinner"></div> : (show2FA ? 'Verify Code' : 'Sign In')}
                            </button>
                        </form>

                        {!show2FA && (
                            <p className="text-center mt-6 text-sm text-neutral-600">
                                Don't have an account?{' '}
                                <Link href="/register" className="text-primary-500 hover:underline">
                                    Create account
                                </Link>
                            </p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
