'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { Shield, Smartphone, SmartphoneNfc, CheckCircle, AlertTriangle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function SettingsPage() {
    const { user, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [secret, setSecret] = useState<string | null>(null);
    const [verifyCode, setVerifyCode] = useState('');
    const [step, setStep] = useState<'IDLE' | 'SETUP' | 'VERIFY'>('IDLE');
    const [message, setMessage] = useState('');

    const startSetup = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/2fa/setup`, {
                method: 'POST',
                credentials: 'include'
            });
            const data = await res.json();
            if (res.ok) {
                setQrCode(data.qrCodeUri);
                setSecret(data.secret);
                setStep('SETUP');
            } else {
                setMessage('Failed to start setup');
            }
        } catch (e) {
            setMessage('Error starting setup');
        } finally {
            setLoading(false);
        }
    };

    const confirmSetup = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/2fa/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: verifyCode }),
                credentials: 'include'
            });

            if (res.ok) {
                setMessage('2FA Enabled Successfully!');
                setStep('IDLE');
                setQrCode(null);
                refreshUser(); // Refresh user profile to update 2FA status
            } else {
                setMessage('Invalid Code. Try again.');
            }
        } catch (e) {
            setMessage('Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const disable2FA = async () => {
        if (!confirm('Are you sure you want to disable 2FA? Your account will be less secure.')) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/2fa/disable`, {
                method: 'POST',
                credentials: 'include'
            });
            if (res.ok) {
                setMessage('2FA Disabled');
                refreshUser();
            }
        } catch (e) {
            setMessage('Failed to disable 2FA');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-10 px-4 animate-fade-in">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <Shield className="w-8 h-8 text-primary-500" />
                Security Settings
            </h1>

            <div className="glass p-8 rounded-2xl border border-white/5">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-1">Two-Factor Authentication</h2>
                        <p className="text-gray-400 text-sm">
                            Add an extra layer of security to your account using an authenticator app.
                        </p>
                    </div>
                    {user?.twoFactorRequired || (user as any)?.twoFactorEnabled ? (
                        <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            ENABLED
                        </div>
                    ) : (
                        <div className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            DISABLED
                        </div>
                    )}
                </div>

                {message && (
                    <div className="mb-4 p-3 bg-primary-500/10 text-primary-400 rounded-lg text-sm text-center">
                        {message}
                    </div>
                )}

                {!qrCode ? (
                    <div className="mt-8">
                        {user?.twoFactorRequired || (user as any)?.twoFactorEnabled ? (
                            <button
                                onClick={disable2FA}
                                disabled={loading}
                                className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors font-semibold"
                            >
                                Disable Two-Factor Authentication
                            </button>
                        ) : (
                            <button
                                onClick={startSetup}
                                disabled={loading}
                                className="btn-primary w-full flex items-center justify-center gap-2"
                            >
                                <Smartphone className="w-5 h-5" />
                                Enable 2FA
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="mt-6 bg-white/5 p-6 rounded-xl animate-fade-in">
                        <div className="text-center mb-6">
                            <div className="bg-white p-4 rounded-lg inline-block mx-auto mb-4">
                                {qrCode && <img src={qrCode} alt="QR Code" className="w-48 h-48" />}
                            </div>
                            <p className="text-sm text-gray-400 mb-2">
                                1. Scan this QR code with Google Authenticator or Authy
                            </p>
                            <p className="text-xs text-gray-500 font-mono select-all">
                                Secret: {secret}
                            </p>
                        </div>

                        <div className="max-w-xs mx-auto">
                            <label className="block text-sm text-gray-400 mb-2 text-center">
                                2. Enter the 6-digit code
                            </label>
                            <input
                                type="text"
                                maxLength={6}
                                value={verifyCode}
                                onChange={e => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                                className="input-field text-center text-2xl tracking-[0.5em] font-mono mb-4"
                                placeholder="000000"
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setQrCode(null)}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmSetup}
                                    disabled={verifyCode.length !== 6 || loading}
                                    className="btn-primary flex-1"
                                >
                                    Verify & Enable
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
