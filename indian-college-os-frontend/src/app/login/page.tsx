'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { authApi } from '@/lib/api';
import { Shield, Mail, RefreshCw } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [twoFactorCode, setTwoFactorCode] = useState('');
    const [show2FA, setShow2FA] = useState(false);
    const [showVerificationRequired, setShowVerificationRequired] = useState(false);
    const [verificationEmail, setVerificationEmail] = useState('');
    const [resendLoading, setResendLoading] = useState(false);
    const [resendMessage, setResendMessage] = useState('');
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

            if (response.emailVerificationRequired) {
                setVerificationEmail(response.email);
                setShowVerificationRequired(true);
                setLoading(false);
                return;
            }

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

    const handleResendVerification = async () => {
        setResendLoading(true);
        setResendMessage('');
        try {
            const response = await authApi.resendVerification(verificationEmail);
            setResendMessage(response.message);
        } catch (err: any) {
            setResendMessage(err.message || 'Failed to resend. Please try again.');
        } finally {
            setResendLoading(false);
        }
    };

    // Email verification required state
    if (showVerificationRequired) {
        return (
            <div className="min-h-screen bg-neutral-50 flex flex-col">
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

                <main className="flex-1 flex items-center justify-center py-12 px-4">
                    <div className="w-full max-w-sm">
                        <div className="card text-center">
                            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-6 h-6 text-warning-600" />
                            </div>
                            <h1 className="text-xl font-semibold text-neutral-900 mb-2">
                                Verify Your Email
                            </h1>
                            <p className="text-sm text-neutral-600 mb-6">
                                We sent a verification link to <strong>{verificationEmail}</strong>.
                                Please check your inbox and click the link to activate your account.
                            </p>

                            {resendMessage && (
                                <div className="alert alert-info mb-4">
                                    {resendMessage}
                                </div>
                            )}

                            <button
                                onClick={handleResendVerification}
                                disabled={resendLoading}
                                className="btn btn-secondary w-full mb-3"
                            >
                                {resendLoading ? <div className="spinner"></div> : (
                                    <>
                                        <RefreshCw className="w-4 h-4" />
                                        Resend Verification Email
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => {
                                    setShowVerificationRequired(false);
                                    setEmail('');
                                    setPassword('');
                                }}
                                className="text-sm text-primary-500 hover:underline"
                            >
                                ← Try a different account
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

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

                                    <div className="text-right">
                                        <Link href="/forgot-password" className="text-sm text-primary-500 hover:underline">
                                            Forgot password?
                                        </Link>
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
