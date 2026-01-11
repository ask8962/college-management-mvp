'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { alertApi, AttendanceAlert } from '@/lib/api';
import { Plus, X, MapPin, Clock, AlertTriangle, Bell, Vibrate } from 'lucide-react';

export default function AlertsPage() {
    const { token, user } = useAuth();
    const [alerts, setAlerts] = useState<AttendanceAlert[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        location: '',
        message: '',
    });

    const loadAlerts = useCallback(async () => {
        if (!token) return;
        try {
            const data = await alertApi.getActive();
            setAlerts(data);

            // Trigger vibration for urgent alerts on mobile
            if (data.some(a => a.isUrgent) && 'vibrate' in navigator) {
                navigator.vibrate([200, 100, 200]);
            }
        } catch (error) {
            console.error('Failed to load alerts:', error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        loadAlerts();
        // Auto-refresh every 30 seconds
        const interval = setInterval(loadAlerts, 30000);
        return () => clearInterval(interval);
    }, [loadAlerts]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await alertApi.create(formData);
            setShowForm(false);
            setFormData({ subject: '', location: '', message: '' });
            loadAlerts();
        } catch (error) {
            alert('Failed to send alert');
        }
    };

    const handleDeactivate = async (id: string) => {
        try {
            await alertApi.deactivate(id);
            loadAlerts();
        } catch (error) {
            alert('Failed to deactivate alert');
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
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">🏃 Flash Alert</h1>
                    <p className="text-gray-400">See attendance alerts from your class. Help your bunking bros!</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="btn-primary flex items-center gap-2 animate-pulse"
                >
                    <AlertTriangle className="h-5 w-5" />
                    🚨 Send Alert
                </button>
            </div>

            {/* Active Alerts */}
            {alerts.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center">
                    <Bell className="h-16 w-16 mx-auto mb-4 text-gray-500 opacity-50" />
                    <p className="text-gray-400 text-lg mb-2">No active alerts right now</p>
                    <p className="text-gray-500 text-sm">All clear! Enjoy your bunk 😎</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {alerts.map(alert => (
                        <div
                            key={alert.id}
                            className={`glass rounded-2xl p-6 relative overflow-hidden ${alert.isUrgent ? 'border-2 border-red-500 animate-pulse' : ''
                                }`}
                        >
                            {alert.isUrgent && (
                                <div className="absolute top-0 right-0 bg-red-500 text-white px-4 py-1 text-xs font-bold rounded-bl-lg">
                                    🔥 URGENT
                                </div>
                            )}

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl font-bold text-red-400">{alert.subject}</span>
                                        <span className="px-3 py-1 bg-white/10 rounded-full text-sm flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {alert.location}
                                        </span>
                                    </div>
                                    <p className="text-gray-300 mb-2">{alert.message}</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {alert.minutesAgo < 1 ? 'Just now' : `${alert.minutesAgo} min ago`}
                                        </span>
                                        <span>by {alert.postedByName}</span>
                                        <span className="text-orange-400">⏳ {alert.minutesLeft} min left</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if ('vibrate' in navigator) navigator.vibrate([500, 200, 500]);
                                        }}
                                        className="p-3 glass rounded-xl hover:bg-red-500/20 text-red-400 transition-colors"
                                        title="Vibrate"
                                    >
                                        <Vibrate className="h-6 w-6" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Info Card */}
            <div className="glass rounded-2xl p-6 bg-gradient-to-r from-primary-500/10 to-accent-500/10">
                <h3 className="font-bold mb-2">💡 How it works</h3>
                <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Someone in class taps "Send Alert" when attendance starts</li>
                    <li>• All students see the alert instantly</li>
                    <li>• Alerts auto-expire after 15 minutes</li>
                    <li>• Your phone vibrates for urgent alerts!</li>
                </ul>
            </div>

            {/* Alert Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="glass rounded-2xl p-6 w-full max-w-md animate-slide-up">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">🚨 Send Alert</h2>
                            <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-white/10">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="e.g., Maths, Physics Lab"
                                    value={formData.subject}
                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="e.g., Room 301, Lab 2"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Message (Optional)</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="e.g., Prof just started roll call!"
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary flex-1 bg-red-500 hover:bg-red-600">
                                    🚨 Send Alert NOW
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
