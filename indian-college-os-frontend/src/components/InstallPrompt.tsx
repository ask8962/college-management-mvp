'use client';

import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check if iOS
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
        setIsIOS(isIOSDevice);

        // Check if already installed
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        if (isStandalone) return;

        // Check if dismissed recently
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (dismissed && Date.now() - parseInt(dismissed) < 7 * 24 * 60 * 60 * 1000) {
            return;
        }

        // Listen for install prompt
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Show iOS prompt after delay
        if (isIOSDevice && !isStandalone) {
            setTimeout(() => setShowPrompt(true), 3000);
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setShowPrompt(false);
            }
            setDeferredPrompt(null);
        }
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    };

    if (!showPrompt) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
            <div className="glass rounded-2xl p-4 border border-primary-500/30">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary-500/20 rounded-xl">
                        <Smartphone className="h-6 w-6 text-primary-400" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-white">Install College OS</h3>
                        <p className="text-sm text-gray-400 mt-1">
                            {isIOS
                                ? 'Tap the share button and select "Add to Home Screen"'
                                : 'Install our app for a better experience'
                            }
                        </p>
                        {!isIOS && (
                            <button
                                onClick={handleInstall}
                                className="btn-primary text-sm mt-3 flex items-center gap-2"
                            >
                                <Download className="h-4 w-4" />
                                Install App
                            </button>
                        )}
                    </div>
                    <button
                        onClick={handleDismiss}
                        className="text-gray-500 hover:text-white p-1"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
