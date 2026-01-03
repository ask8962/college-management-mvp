'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { alertApi, AttendanceAlert } from '@/lib/api';

export default function AlertNotifier() {
    const { token } = useAuth();
    const lastAlertIdRef = useRef<string | null>(null);
    const hasPermissionRef = useRef(false);

    // Request notification permission on mount
    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                hasPermissionRef.current = permission === 'granted';
            });
        } else if ('Notification' in window && Notification.permission === 'granted') {
            hasPermissionRef.current = true;
        }
    }, []);

    const checkAlerts = useCallback(async () => {
        if (!token) return;

        try {
            const alerts = await alertApi.getActive(token);

            if (alerts.length > 0) {
                const latestAlert = alerts[0];

                // Only notify if this is a new alert we haven't seen
                if (latestAlert.id !== lastAlertIdRef.current && latestAlert.isUrgent) {
                    lastAlertIdRef.current = latestAlert.id;

                    // Vibrate (works on mobile)
                    if ('vibrate' in navigator) {
                        navigator.vibrate([300, 100, 300, 100, 300]);
                    }

                    // Show browser notification
                    if (hasPermissionRef.current) {
                        new Notification('🚨 Attendance Alert!', {
                            body: `${latestAlert.subject} - ${latestAlert.location}\n${latestAlert.message}`,
                            icon: '/favicon.ico',
                            tag: 'attendance-alert',
                            requireInteraction: true,
                        });
                    }

                    // Also play a sound (optional)
                    try {
                        const audio = new Audio('/alert.mp3');
                        audio.volume = 0.5;
                        audio.play().catch(() => { }); // Ignore if audio fails
                    } catch { }
                }
            }
        } catch (error) {
            // Silently fail - background process
        }
    }, [token]);

    useEffect(() => {
        // Initial check
        checkAlerts();

        // Poll every 30 seconds
        const interval = setInterval(checkAlerts, 30000);

        return () => clearInterval(interval);
    }, [checkAlerts]);

    // This component doesn't render anything
    return null;
}
