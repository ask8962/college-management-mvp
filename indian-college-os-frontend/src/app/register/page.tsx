'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { authApi } from '@/lib/api';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

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
            const response = await authApi.register({ name, studentId, email, password });
            login(response);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
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
                            <h1 className="text-xl font-semibold text-neutral-900">
                                Create your account
                            </h1>
                            <p className="text-sm text-neutral-600 mt-1">
                                Fill in your details to get started
                            </p>
                        </div>

                        {error && (
                            <div className="alert alert-error mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="input-label">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="input-field"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div>
                                <label className="input-label">Student ID</label>
                                <input
                                    type="text"
                                    value={studentId}
                                    onChange={(e) => setStudentId(e.target.value)}
                                    required
                                    className="input-field"
                                    placeholder="e.g., 2024CS001"
                                />
                            </div>

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
                                {loading ? <div className="spinner"></div> : 'Create Account'}
                            </button>
                        </form>

                        <p className="text-center mt-6 text-sm text-neutral-600">
                            Already have an account?{' '}
                            <Link href="/login" className="text-primary-500 hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
