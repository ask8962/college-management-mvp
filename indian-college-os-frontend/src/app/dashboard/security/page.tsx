'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { twoFactorApi, TwoFactorSetup } from '@/lib/api';
import { Shield, ShieldCheck, ShieldOff, Key, Copy, Check } from 'lucide-react';

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
    }, []);

    const loadStatus = async () => {
        // Token check removed - using cookies
        try {
            const data = await twoFactorApi.getStatus();
            setIsEnabled(data.enabled);
        } catch (error) {
            console.error('Failed to load 2FA status:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSetup = async () => {
        // Token check removed - using cookies
        setMessage('');
        try {
            const data = await twoFactorApi.setup();
            setSetupData(data);
        } catch (error) {
            setMessage('Failed to setup 2FA. Please try again.');
        }
    };

    const handleVerify = async () => {
        if (!token || !code) return;
        setMessage('');
        try {
            const data = await twoFactorApi.verify(code);
            if (data.success) {
                setIsEnabled(true);
                setSetupData(null);
                setCode('');
                setMessage('Two-factor authentication enabled successfully.');
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
            const data = await twoFactorApi.disable(code);
            if (data.success) {
                setIsEnabled(false);
                setShowDisable(false);
                setCode('');
                setMessage('Two-factor authentication has been disabled.');
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
            <div className="flex items-center justify-center h-64">
                <div className="spinner-lg"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl">
            {/* Page Header */}
            <div className="page-header">
                <h1 className="page-title">Security Settings</h1>
                <p className="page-subtitle">Manage your account security preferences.</p>
            </div>

            {/* 2FA Card */}
            <div className="card">
                <div className="flex items-center gap-4 mb-4">
                    {isEnabled ? (
                        <div className="w-12 h-12 rounded bg-green-50 flex items-center justify-center">
                            <ShieldCheck className="w-6 h-6 text-success-600" />
                        </div>
                    ) : (
                        <div className="w-12 h-12 rounded bg-yellow-50 flex items-center justify-center">
                            <ShieldOff className="w-6 h-6 text-warning-600" />
                        </div>
                    )}
                    <div>
                        <h2 className="font-semibold text-neutral-900">Two-Factor Authentication</h2>
                        <p className={`text-sm ${isEnabled ? 'text-success-600' : 'text-warning-600'}`}>
                            {isEnabled ? 'Enabled' : 'Not enabled'}
                        </p>
                    </div>
                </div>

                <p className="text-neutral-600 mb-6">
                    Two-factor authentication adds an extra layer of security to your account.
                    You'll need to enter a code from your authenticator app when signing in.
                </p>

                {message && (
                    <div className={`alert mb-4 ${message.includes('success') || message.includes('enabled') ? 'alert-success' : 'alert-error'}`}>
                        {message}
                    </div>
                )}

                {!isEnabled && !setupData && (
                    <button onClick={handleSetup} className="btn btn-primary">
                        Enable Two-Factor Authentication
                    </button>
                )}

                {setupData && (
                    <div className="space-y-6">
                        <div>
                            <p className="text-sm text-neutral-600 mb-4">
                                Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                            </p>
                            <div className="flex justify-center">
                                <img
                                    src={setupData.qrCodeDataUri}
                                    alt="2FA QR Code"
                                    className="w-48 h-48 border border-neutral-200 rounded p-2"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="input-label">Or enter this secret key manually:</label>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 bg-neutral-50 px-4 py-3 rounded border border-neutral-200 font-mono text-sm break-all">
                                    {setupData.secret}
                                </code>
                                <button
                                    onClick={copySecret}
                                    className="btn btn-secondary btn-sm"
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="input-label">Enter the 6-digit code from your app:</label>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                    placeholder="000000"
                                    className="input-field flex-1 text-center text-xl tracking-widest font-mono"
                                />
                                <button
                                    onClick={handleVerify}
                                    disabled={code.length !== 6}
                                    className="btn btn-primary"
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
                        className="btn btn-secondary text-error-500 border-error-500 hover:bg-error-50"
                    >
                        Disable Two-Factor Authentication
                    </button>
                )}

                {showDisable && (
                    <div className="p-4 bg-red-50 rounded border border-red-200">
                        <p className="text-sm text-error-600 mb-4">
                            Enter your 2FA code to confirm disabling:
                        </p>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                maxLength={6}
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                placeholder="000000"
                                className="input-field flex-1 text-center text-xl tracking-widest font-mono"
                            />
                            <button onClick={handleDisable} disabled={code.length !== 6} className="btn btn-danger">
                                Confirm
                            </button>
                            <button onClick={() => { setShowDisable(false); setCode(''); }} className="btn btn-secondary">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Security Tips */}
            <div className="card">
                <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                    <Key className="w-5 h-5 text-primary-500" />
                    Security Recommendations
                </h3>
                <ul className="space-y-2 text-sm text-neutral-600">
                    <li>• Use a strong, unique password for your account</li>
                    <li>• Never share your 2FA codes with anyone</li>
                    <li>• Keep your authenticator app backed up</li>
                    <li>• Sign out from shared or public devices</li>
                </ul>
            </div>
        </div>
    );
}
