'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { authApi } from '@/lib/api';
import { GraduationCap, Mail, Lock, ArrowLeft, Shield } from 'lucide-react';

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

            // Check if 2FA is required
            if (response.twoFactorRequired) {
                setShow2FA(true);
                setLoading(false);
                return;
            }

            login(response);

            // Redirect based on role
            if (response.role === 'ADMIN') {
                router.push('/admin');
            } else {
                router.push('/dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md animate-fade-in">
                <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Back to home
                </Link>

                <div className="glass rounded-3xl p-8">
                    <div className="flex justify-center mb-6">
                        <div className={`p-3 ${show2FA ? 'bg-purple-500/20' : 'bg-primary-500/20'} rounded-xl`}>
                            {show2FA ? (
                                <Shield className="h-10 w-10 text-purple-300" />
                            ) : (
                                <GraduationCap className="h-10 w-10 text-primary-300" />
                            )}
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-center mb-2">
                        {show2FA ? 'Two-Factor Auth' : 'Welcome Back'}
                    </h1>
                    <p className="text-gray-400 text-center mb-8">
                        {show2FA
                            ? 'Enter the code from your authenticator app'
                            : 'Sign in to continue to your dashboard'
                        }
                    </p>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!show2FA ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:border-primary-500 transition-colors"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:border-primary-500 transition-colors"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium mb-2">Authentication Code</label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={twoFactorCode}
                                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                                    required
                                    autoFocus
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white text-center text-3xl tracking-[0.5em] font-mono placeholder-gray-500 focus:border-purple-500 transition-colors"
                                    placeholder="000000"
                                />
                                <button
                                    type="button"
                                    onClick={() => { setShow2FA(false); setTwoFactorCode(''); setError(''); }}
                                    className="mt-4 text-gray-400 hover:text-white text-sm w-full text-center"
                                >
                                    ← Back to login
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || (show2FA && twoFactorCode.length !== 6)}
                            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <div className="spinner"></div> : (show2FA ? 'Verify Code' : 'Sign In')}
                        </button>
                    </form>

                    {!show2FA && (
                        <p className="text-center mt-6 text-gray-400">
                            Don&apos;t have an account?{' '}
                            <Link href="/register" className="text-primary-400 hover:text-primary-300 transition-colors">
                                Sign up
                            </Link>
                        </p>
                    )}
                </div>
            </div>
        </main>
    );
}
