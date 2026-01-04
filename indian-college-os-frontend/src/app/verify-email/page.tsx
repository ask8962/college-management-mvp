'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import { Mail, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (token) {
            verifyEmail();
        } else {
            setLoading(false);
            setError('No verification token provided.');
        }
    }, [token]);

    const verifyEmail = async () => {
        try {
            const response = await authApi.verifyEmail(token!);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Verification failed. The link may have expired.');
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
                    <div className="card text-center py-8">
                        {loading ? (
                            <>
                                <div className="spinner-lg mx-auto mb-4"></div>
                                <h1 className="text-xl font-semibold text-neutral-900">
                                    Verifying your email...
                                </h1>
                            </>
                        ) : success ? (
                            <>
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-6 h-6 text-success-600" />
                                </div>
                                <h1 className="text-xl font-semibold text-neutral-900 mb-2">
                                    Email Verified!
                                </h1>
                                <p className="text-sm text-neutral-600 mb-6">
                                    Your email has been verified successfully. You can now sign in to your account.
                                </p>
                                <Link href="/login" className="btn btn-primary w-full">
                                    Sign In
                                </Link>
                            </>
                        ) : (
                            <>
                                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                                    <XCircle className="w-6 h-6 text-error-500" />
                                </div>
                                <h1 className="text-xl font-semibold text-neutral-900 mb-2">
                                    Verification Failed
                                </h1>
                                <p className="text-sm text-neutral-600 mb-6">
                                    {error}
                                </p>
                                <Link href="/login" className="btn btn-primary w-full">
                                    Go to Sign In
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                <div className="spinner-lg"></div>
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
