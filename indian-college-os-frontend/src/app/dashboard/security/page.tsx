'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { twoFactorApi, TwoFactorSetup } from '@/lib/api';
import { Shield, ShieldCheck, ShieldOff, Lock, Key, Copy, Check } from 'lucide-react';

export default function SecurityPage() {
    const { token } = useAuth();
    const [isEnabled, setIsEnabled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [setupData, setSetupData] = useState<TwoFactorSetup | null>(null);
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const [copied, setCopied] = useState(false);
    const [showDisable, setShowDisable] = useState(false);

    useEffect(() => {
        loadStatus();
    }, [token]);

    const loadStatus = async () => {
        if (!token) return;
        try {
            const data = await twoFactorApi.getStatus(token);
            setIsEnabled(data.enabled);
        } catch (error) {
            console.error('Failed to load 2FA status:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSetup = async () => {
        if (!token) return;
        setMessage('');
        try {
            const data = await twoFactorApi.setup(token);
            setSetupData(data);
        } catch (error) {
            setMessage('Failed to setup 2FA. Please try again.');
        }
    };

    const handleVerify = async () => {
        if (!token || !code) return;
        setMessage('');
        try {
            const data = await twoFactorApi.verify(token, code);
            if (data.success) {
                setIsEnabled(true);
                setSetupData(null);
                setCode('');
                setMessage('✅ 2FA enabled successfully!');
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage('Invalid code. Please try again.');
        }
    };

    const handleDisable = async () => {
        if (!token || !code) return;
        setMessage('');
        try {
            const data = await twoFactorApi.disable(token, code);
            if (data.success) {
                setIsEnabled(false);
                setShowDisable(false);
                setCode('');
                setMessage('2FA has been disabled.');
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage('Invalid code. Please try again.');
        }
    };

    const copySecret = () => {
        if (setupData?.secret) {
            navigator.clipboard.writeText(setupData.secret);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in max-w-2xl">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-3 bg-primary-500/20 rounded-xl">
                    <Shield className="h-8 w-8 text-primary-300" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Security Settings</h1>
                    <p className="text-gray-400">Manage your account security</p>
                </div>
            </div>

            {/* 2FA Status Card */}
            <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        {isEnabled ? (
                            <ShieldCheck className="h-8 w-8 text-green-400" />
                        ) : (
                            <ShieldOff className="h-8 w-8 text-orange-400" />
                        )}
                        <div>
                            <h2 className="text-xl font-semibold">Two-Factor Authentication</h2>
                            <p className={`text-sm ${isEnabled ? 'text-green-400' : 'text-orange-400'}`}>
                                {isEnabled ? '✅ Enabled' : '⚠️ Not enabled'}
                            </p>
                        </div>
                    </div>
                </div>

                <p className="text-gray-400 mb-6">
                    Two-factor authentication adds an extra layer of security to your account.
                    You'll need to enter a code from your authenticator app when logging in.
                </p>

                {message && (
                    <div className={`p-4 rounded-xl mb-6 ${message.includes('✅') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {message}
                    </div>
                )}

                {!isEnabled && !setupData && (
                    <button onClick={handleSetup} className="btn-primary flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Enable 2FA
                    </button>
                )}

                {setupData && (
                    <div className="space-y-6">
                        <div className="flex flex-col items-center">
                            <p className="text-sm text-gray-400 mb-4">
                                Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                            </p>
                            <img
                                src={setupData.qrCodeDataUri}
                                alt="2FA QR Code"
                                className="w-48 h-48 bg-white rounded-xl p-2"
                            />
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm text-gray-400">Or enter this secret key manually:</p>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 bg-white/10 px-4 py-3 rounded-xl font-mono text-sm break-all">
                                    {setupData.secret}
                                </code>
                                <button
                                    onClick={copySecret}
                                    className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                                >
                                    {copied ? <Check className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm text-gray-400">
                                Enter the 6-digit code from your app:
                            </label>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={code}
                                    onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                                    placeholder="000000"
                                    className="input-field flex-1 text-center text-2xl tracking-widest font-mono"
                                />
                                <button
                                    onClick={handleVerify}
                                    disabled={code.length !== 6}
                                    className="btn-primary disabled:opacity-50"
                                >
                                    Verify
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {isEnabled && !showDisable && (
                    <button
                        onClick={() => setShowDisable(true)}
                        className="btn-secondary text-red-400 border-red-500/30"
                    >
                        Disable 2FA
                    </button>
                )}

                {showDisable && (
                    <div className="space-y-4 p-4 bg-red-500/10 rounded-xl border border-red-500/30">
                        <p className="text-red-400">
                            ⚠️ Are you sure? Enter your 2FA code to confirm:
                        </p>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                maxLength={6}
                                value={code}
                                onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                                placeholder="000000"
                                className="input-field flex-1 text-center text-2xl tracking-widest font-mono"
                            />
                            <button
                                onClick={handleDisable}
                                disabled={code.length !== 6}
                                className="px-6 py-2 bg-red-500 text-white rounded-xl disabled:opacity-50"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => { setShowDisable(false); setCode(''); }}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Security Tips */}
            <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Key className="h-5 w-5 text-primary-400" />
                    Security Tips
                </h3>
                <ul className="space-y-2 text-sm text-gray-400">
                    <li>• Use a strong, unique password</li>
                    <li>• Never share your 2FA codes with anyone</li>
                    <li>• Keep your authenticator app backed up</li>
                    <li>• Log out from shared devices</li>
                </ul>
            </div>
        </div>
    );
}
